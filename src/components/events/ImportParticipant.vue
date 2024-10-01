<template>
    <EditParticipantForm
        v-if="Object.keys(participantToEdit).length"
        :data="participantToEdit"
        @updated="onParticipantUpdate"
        @deleteParticipant="deleteParticipant"
    />

    <div class="container">
        <div class="d-flex justify-content-between align-items-center mt-3">
            <div class="d-flex align-items-center gap-4">
                <BackArrow
                    v-show="!participants.length"
                    @click="$emit('switch', 'details')"
                />
                <BreadCrumbs
                    :breadCrumbs="['events', eventId, 'Import Participants']"
                />
            </div>
            <div>
                <a
                    class="link-underline link-underline-opacity-0"
                    href="/docs/participants_template.csv"
                    download="participants_template.csv"
                >
                    <button class="btn btn-primary" style="min-width: 235px">
                        Download CSV Template
                    </button>
                </a>
            </div>
        </div>
        <div
            id="fileSelectorAndGridWrapper"
            class="d-flex justify-content-center gap-3 mt-2"
        >
            <div class="pt-2" id="importParticipantsFileSelectorWrapper">
                <h2 class="pb-2 text">Import Participants</h2>
                <div>
                    <label
                        for="formFile"
                        class="form-label d-flex justify-content"
                    >
                        Upload Participants CSV File
                    </label>
                    <input
                        class="form-control"
                        id="formFile"
                        type="file"
                        ref="participantsFile"
                        @change="handleFileImport"
                    />
                    <Alert
                        v-if="errorAlertMessage"
                        :title="errorAlertMessage"
                        class="mb-1"
                    />
                </div>
                <form
                    class="d-flex gap-2 pt-2 text-center justify-content-start"
                    v-if="participants.length"
                    @submit.prevent="postParticipants"
                >
                    <button class="btn btn-primary" type="submit">
                        Upload
                    </button>
                    <button
                        @click="$emit('switch', 'details')"
                        class="btn btn-outline-secondary"
                    >
                        Cancel
                    </button>
                </form>
            </div>
            <ImportedParticipantsGrid
                v-if="participants.length"
                :participants="participants"
                @edit="editParticipant"
                @delete="deleteParticipant"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import { parse } from "papaparse"; // Import Papa Parse for CSV parsing
import { useRoute } from "vue-router";

import { registerEventParticipants } from "../../assets/js/index.js";
import ImportedParticipantsGrid from "./ImportedParticipantsGrid.vue";
import EditParticipantForm from "./EditParticipantForm.vue";
import Alert from "../Alert.vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import BackArrow from "../BackArrow.vue";
import { showModal, removeQuotes } from "@/util/util.js";

const route = useRoute();
const eventId = route.params.id;

const props = defineProps({
    eventId: {
        type: String,
        required: true,
    },
    eventTitle: {
        type: String,
        required: true,
    },
});

const emit = defineEmits([
    "participantsImported",
    "errorImportingParticipants",
    "switch",
]);

// section loader flag
const $sectionIsLoading =
    getCurrentInstance().appContext.config.globalProperties.$sectionIsLoading;

const participants = ref([]);
const participantsFile = ref(null);
const errorAlertMessage = ref("");
const participantToEdit = ref({});

function handleFileImport(event) {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
        const reader = new FileReader();
        reader.onload = (e) => {
            $sectionIsLoading.value = true;
            errorAlertMessage.value = "";
            participants.value = [];

            // wait a bit for section loader to appear
            setTimeout(() => {
                const csvData = e.target.result;
                parse(csvData, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        results.data = removeEmptyRows(results.data);

                        // validate csv file table columns
                        if (!validateParticipantsCsvFile(results)) {
                            $sectionIsLoading.value = false;
                            return false;
                        }

                        participants.value = [];
                        participants.value.push(...results.data);

                        formatParticipants();

                        $sectionIsLoading.value = false;

                        if (participants.value.length > 150) {
                            emit("errorImportingParticipants", {
                                status: "warning",
                                message:
                                    "Import Maximum 150 Participants at a time",
                            });
                        }
                    },
                });
            }, 1500);
        };

        reader.readAsText(file);
    } else errorAlertMessage.value = "CSV File only";
}

async function onParticipantUpdate(updatedParticipant) {
    participants.value[participantToEdit.value.idx] = updatedParticipant;

    // temporarily copy error message before clearing the entire participant to edit
    let errorMessage = participantToEdit.value.errorMessage;
    participantToEdit.value = {};

    // only repost the participants if there was an error
    if (errorMessage) await postParticipants();
}

async function postParticipants() {
    $sectionIsLoading.value = true;

    const { ok, result } = await registerEventParticipants({
        event: {
            id: props.eventId,
        },
        event_participants: participants.value,
    });

    $sectionIsLoading.value = false;

    if (ok) {
        participants.value = [];

        emit("participantsImported", {
            status: "success",
            message: "Participants Successfully Imported",
            pageLink: `/events/${eventId}`,
        });
    } else {
        if (result.status === 500) {
            emit("errorImportingParticipants", {
                status: "danger",
                message: "Unable to Import Participants, try again",
            });
            return;
        } else if (result.type == "entity.too.large") {
            emit("errorImportingParticipants", {
                status: "danger",
                message:
                    "Participants too many, please import participants in smaller partitions (100 each)",
            });
            return;
        }

        participantToEdit.value = {
            errorMessage: result.message,
            participant: result.data.participant,
            idx: result.data.idx,
            status: result.status,
        };

        setTimeout(
            () =>
                showModal("#editParticipantModal", "#editParticipantModalBody"),
            150
        );
    }
}

function removeEmptyRows(data) {
    // only keep rows that have either of the values
    // don't add it if it has none
    return data.filter(
        (participant) =>
            participant.first_name ||
            participant.last_name ||
            participant.msisdn ||
            participant.email ||
            participant.session
    );
}

function validateParticipantsCsvFile(result) {
    const fields = result.meta.fields;

    // ensure first_name column exists
    if (!fields.includes("first_name")) {
        errorAlertMessage.value = "`first_name` column required but not found";
        return false;
    }

    // ensure last_name column exists
    if (!fields.includes("last_name")) {
        errorAlertMessage.value = "`last_name` column required but not found";
        return false;
    }

    // // ensure address column exists
    // if (!fields.includes("address")) {
    //     errorAlertMessage.value = "`address` column required but not found";
    //     return false;
    // }

    // ensure msisdn column exists
    if (!fields.includes("msisdn")) {
        errorAlertMessage.value = "`msisdn` column required but not found";
        return false;
    }

    // ensure gender column exists
    if (!fields.includes("gender")) {
        errorAlertMessage.value = "`gender` column required but not found";
        return false;
    }

    // ensure session column exists
    if (!fields.includes("session")) {
        errorAlertMessage.value = "`session` column required but not found";
        return false;
    }

    // clear errorMessage
    errorAlertMessage.value = "";

    return true;
}

function editParticipant(msisdn) {
    const idxToEdit = participants.value.findIndex(
        (participant) => participant.msisdn === msisdn
    );

    // set a participant to edit
    participantToEdit.value = {
        participant: participants.value[idxToEdit],
        idx: idxToEdit,
        errorMessage: "",
    };

    setTimeout(
        () => showModal("#editParticipantModal", "#editParticipantModalBody"),
        150
    );
}

async function deleteParticipant(msisdn) {
    const idxToDelete = participants.value.findIndex(
        (participant) => participant.msisdn === msisdn
    );

    participants.value.splice(idxToDelete, 1);
    let errorMessage = participantToEdit.value.errorMessage;
    participantToEdit.value = {};

    if (errorMessage) await postParticipants();
}

function formatParticipants() {
    for (const participant of participants.value) {
        participant.first_name = removeQuotes(
            participant.first_name.trim(),
            true
        );

        // format middle_name if any
        if (participant.middle_name) {
            participant.middle_name = removeQuotes(
                participant.middle_name.trim(),
                true
            );
        }

        participant.last_name = removeQuotes(
            participant.last_name.trim(),
            true
        );
        participant.gender = removeQuotes(
            participant.gender.toLowerCase().trim(),
            true
        );

        participant.session = removeQuotes(participant.session.trim(), true);

        // format occupation if any
        if (participant.occupation) {
            // participant.address = removeQuotes(participant.address.trim(), true);
            participant.occupation = removeQuotes(
                participant.occupation.trim(),
                true
            );
        }

        if (
            !participant.msisdn.startsWith("0") &&
            !participant.msisdn.startsWith("231")
        ) {
            participant.msisdn =
                "231" + removeQuotes(participant.msisdn.trim(), true);
        }
    }
}
</script>

<style scoped>
@media (max-width: 1450px) {
    #fileSelectorAndGridWrapper {
        flex-direction: column !important;
    }
}

@media (min-width: 1100px) {
    #importParticipantsFileSelectorWrapper {
        min-width: 300px;
    }
}
</style>
