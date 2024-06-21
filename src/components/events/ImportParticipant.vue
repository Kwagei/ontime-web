<template>
    <EditParticipantForm
        v-if="!!Object.keys(participantToEdit).length"
        :data="participantToEdit"
        @updated="onParticipantUpdate"
        @cancel="participantToEdit = {}"
    />
    <div style="width: 81%">
        <div
            class="d-flex justify-content-between align-items-center gap-5 mt-3"
        >
            <div class="d-flex align-items-center gap-4">
                <BackArrow @click="$emit('switch', 'details')" />
                <BreadCrumbs
                    :breadCrumbs="['events', eventId, 'Import Participants']"
                />
            </div>
            <div>
                <a
                    class="link-underline link-underline-opacity-0"
                    href="/participants_template.csv"
                    download="participants_template.csv"
                >
                    <button class="btn btn-primary">
                        Download CSV Template
                    </button>
                </a>
            </div>
        </div>
        <div class="d-flex justify-content-center gap-3 mt-2">
            <div class="pt-2">
                <h2 class="pb-2 text-center">Import Participants</h2>
                <div>
                    <label
                        for="formFile"
                        class="form-label d-flex justify-content-center"
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
                <div
                    class="d-flex flex-column gap-2 pt-3 text-center justify-content-center"
                >
                    <div v-if="participants.length">
                        <button
                            class="w-100 btn btn-primary"
                            @click="postParticipants"
                        >
                            Upload
                        </button>
                    </div>
                </div>
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
import { ref } from "vue";
import { parse } from "papaparse"; // Import Papa Parse for CSV parsing
import $ from "jquery";
import { useRoute } from "vue-router";

import { API_URL } from "../../assets/js/index.js";
import ImportedParticipantsGrid from "./ImportedParticipantsGrid.vue";
import EditParticipantForm from "./EditParticipantForm.vue";
import Alert from "../Alert.vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import BackArrow from "../BackArrow.vue";

const router = useRoute();
const eventId = router.params.id;

const props = defineProps({
    eventId: {
        type: String,
        required: true,
    },
});

const emit = defineEmits([
    "participantsImported",
    "errorImportingParticipants",
    "switch",
]);

const participants = ref([]);
const participantsFile = ref(null);
const errorAlertMessage = ref("");
const participantToEdit = ref({});

function handleFileImport(event) {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvData = e.target.result;
            parse(csvData, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    results.data = removeEmptyRows(results.data);

                    // validate csv file table columns
                    if (!validateParticipantsCsvFile(results)) return false;

                    participants.value = [];
                    participants.value.push(...results.data);

                    participantsFile.value.value = ""; // Clear file input after import
                },
            });
        };

        reader.readAsText(file);
    } else errorAlertMessage.value = "CSV File only";
}

async function onParticipantUpdate(updatedParticipant) {
    participants.value[participantToEdit.value.idx] = updatedParticipant;

    // only repost the participants if there was an error
    if (participantToEdit.value.errorMessage) {
        await postParticipants();
        return;
    }

    // empty the value if it there wasn't any error
    participantToEdit.value = {};
}

async function postParticipants() {
    $("body").css("pointer-events", "none");

    const data = {
        event_id: props.eventId,
        event_participants: participants.value,
    };

    try {
        await $.post(API_URL + "event_participants/", data, () => {
            // clear participant to edit if all went well
            participantToEdit.value = {};

            emit("participantsImported", {
                status: "success",
                title: "Participants Imported",
                pageLink: `/events/${eventId}`,
            });
        });
        $("body").css("pointer-events", "auto");
    } catch (error) {
        $("body").css("pointer-events", "auto");
        if (error.responseJSON.status === 500) {
            emit("errorImportingParticipants", {
                status: "danger",
                title: "Error Importing Participants, try again",
            });
            return;
        }

        participantToEdit.value = {
            errorMessage: error.responseJSON.message,
            participant: error.responseJSON.data.participant,
            idx: error.responseJSON.data.idx,
            status: error.responseJSON.status,
        };
    }
}

function removeEmptyRows(data) {
    // only keep rows that have either of the values
    // don't add it if it has none
    return data.filter(
        (participant) =>
            participant.first_name ||
            participant.middle_name ||
            participant.last_name ||
            participant.msisdn ||
            participant.address ||
            participant.email
    );
}

function validateParticipantsCsvFile(result) {
    const fields = result.meta.fields;

    if (result.errors.length) return true;

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

    // ensure email column exists
    if (!fields.includes("email")) {
        errorAlertMessage.value = "`email` column required but not found";
        return false;
    }

    // ensure address column exists
    if (!fields.includes("address")) {
        errorAlertMessage.value = "`address` column required but not found";
        return false;
    }

    // ensure msisdn column exists
    if (!fields.includes("msisdn")) {
        errorAlertMessage.value = "`msisdn` column required but not found";
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

    // set a participant to edit and
    // the form to edit a participant will show
    // automatically based on the condition at the top of the template
    participantToEdit.value = {
        participant: participants.value[idxToEdit],
        idx: idxToEdit,
        errorMessage: "",
    };
}

function deleteParticipant(msisdn) {
    const idxToDelete = participants.value.findIndex(
        (participant) => participant.msisdn === msisdn
    );

    participants.value.splice(idxToDelete, 1);
}
</script>

<style scoped>
/* code... */
</style>
