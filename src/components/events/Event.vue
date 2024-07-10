<template>
    <Modal v-if="!!Object.keys(modalData).length" :data="modalData" />
    <h2 v-if="event == 'error'" class="d-flex justify-content-center pt-5">
        Unable to load events, Try again
    </h2>
    <div
        v-else-if="event == 'loading'"
        class="text-center d-flex justify-content-center align-items-center"
        role="status"
        style="height: 85vh"
    >
        <div class="spinner-border" style="margin-top: -25vh" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <!-- Dont' change the margin on this div! -->
    <div
        v-else
        class="d-flex flex-column align-items-center"
        style="margin-top: -2rem; margin-left: -50rem; margin-right: -50rem"
    >
        <EventTitle :title="event.title" />
        <!-- don't change the width on this div -->
        <div style="width: 45%">
            <EventDetails
                :event="event"
                v-model:participants="participants"
                v-if="state == 'details'"
                @switch="switchState"
                @displayEventParticipants="switchState"
                @editEvent="editEvent"
            />
            <AddParticipant
                v-if="state == 'addParticipant'"
                @switch="switchState"
                @participantAdded="setModalData"
                @errorCreatingParticipant="setModalData"
            />
            <ImportParticipant
                v-if="state == 'importParticipants'"
                :eventId="eventId"
                :eventTitle="event.title"
                @switch="switchState"
                @participantsImported="setModalData"
                @errorImportingParticipants="setModalData"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import $ from "jquery";

import AddParticipant from "./AddParticipant.vue";
import ImportParticipant from "./ImportParticipant.vue";
import EventDetails from "./EventDetails.vue";
import EventTitle from "./EventTitle.vue";
import Modal from "../Modal.vue";

import { API_URL } from "@/assets/js/index.js";
import { showModal } from "@/assets/js/util.js";

const router = useRouter();

const event = ref("loading");
const eventId = ref(router.currentRoute.value.params.id);
const state = ref("details");
const participants = ref("loading");
const modalData = ref({});

const props = defineProps({
    breadCrumbs: Array,
});

onMounted(async () => {
    getEvent();
    getParticipants();
});

async function getEvent() {
    try {
        await $.get(API_URL + `events/${eventId.value}`, (data) => {
            event.value = data.data[0];
        });
    } catch {
        event.value = "error";
        // do nothing
    }
}

async function getParticipants() {
    try {
        await $.get(
            API_URL + `events/${eventId.value}/participants`,
            (data) => {
                participants.value = data.data;
            }
        );
    } catch {
        participants.value = "error";
        // do nothing
    }
}

function switchState(newState) {
    state.value = newState;
}

function setModalData(newData) {
    modalData.value = newData;

    // wait a little bit for I don't know what
    // still tryna understand this part
    // but that's the only way it'll work
    setTimeout(() => {
        showModal("#alertModal", "#alertModalBody");
    }, 500);
}

function editEvent() {
    router.push(`/events/${eventId.value}/edit-event`, {
        params: { id: eventId.value },
    });
}
</script>

<style scoped></style>
