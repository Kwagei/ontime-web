<template>
    <div class="d-flex gap-4 mt-2">
        <div class="pt-4">
            <h2 class="pb-2">Import Participants</h2>
            <div>
                <label for="formFile" class="form-label">
                    Upload Participants CSV File
                </label>
                <input
                    class="form-control"
                    id="formFile"
                    type="file"
                    ref="participantsFile"
                    @change="handleFileImport"
                />
                <Alert v-if="errorMessage" :title="errorMessage" class="mb-1" />
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
                <div class="d-flex gap-2">
                    <button
                        class="btn btn-primary"
                        @click="$emit('switch', 'details')"
                    >
                        View Details
                    </button>
                    <button
                        class="btn btn-primary"
                        @click="$emit('switch', 'addParticipant')"
                    >
                        Add Participant
                    </button>
                </div>
            </div>
        </div>
        <ImportedParticipantsGrid
            v-if="participants.length"
            :participants="participants"
        />
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { parse } from "papaparse"; // Import Papa Parse for CSV parsing
import $ from "jquery";

import ImportedParticipantsGrid from "./ImportedParticipantsGrid.vue";
import Alert from "../Alert.vue";

const props = defineProps({
    eventId: {
        type: String,
        required: true,
    },
});

const participants = reactive([]);
const participantsFile = ref(null);
const errorMessage = ref("");

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
                    if (!validateParticipantsCsvFile(results)) {
                        return false;
                    }

                    participants.push(...results.data);
                    console.log("Uploaded Participants: ", participants);

                    participantsFile.value = null; // Clear file input after import
                },
            });
        };
        reader.readAsText(file);
    }
}

async function postParticipants() {
    const data = {
        event_id: props.eventId,
        event_participants: participants,
    };

    try {
        await $.post(
            "http://localhost:3000/api/event_participants/",
            data,
            (res) => {
                console.log("Response: ", res);
            }
        );
    } catch (error) {
        console.error("Error Posting Event Participants: ", error);
    }
}

function validateParticipantsCsvFile(result) {
    const fields = result.meta.fields;

    if (result.errors.length) return true;

    // ensure first_name column exists
    if (!fields.includes("first_name")) {
        errorMessage.value = "`first_name` column required but not found";
        return false;
    }

    // ensure last_name column exists
    if (!fields.includes("last_name")) {
        errorMessage.value = "`last_name` column required but not found";
        return false;
    }

    // ensure email column exists
    if (!fields.includes("email")) {
        errorMessage.value = "`email` column required but not found";
        return false;
    }

    // ensure address column exists
    if (!fields.includes("address")) {
        errorMessage.value = "`address` column required but not found";
        return false;
    }

    // ensure msisdn column exists
    if (!fields.includes("msisdn")) {
        errorMessage.value = "`msisdn` column required but not found";
        return false;
    }

    // clear errorMessage
    errorMessage.value = "";

    return true;
}
</script>

<style scoped>
/* code... */
</style>
