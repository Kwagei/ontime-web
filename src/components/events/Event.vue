<template>
    <Modal
        style="z-index: 999999999"
        v-if="!!Object.keys(modalData).length"
        :data="modalData"
    />
    <h2 v-if="event == 'error'" class="d-flex justify-content-center pt-5">
        Error Loading Event, Try again
    </h2>
    <div v-else-if="event == 'loading'" class="text-center" role="status">
        <div
            class="spinner-border spinner-border-lg position-absolute top-50"
            role="status"
        >
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div v-else class="w-100 d-flex flex-column align-items-center">
        <EventTitle :title="event.title" />
        <EventDetails
            :event="event"
            v-if="state == 'details'"
            @switch="switchState"
            @displayEventParticipants="switchState"
        />
        <AddParticipant
            v-if="state == 'addParticipant'"
            @switch="switchState"
            @participantCreated="setModalData"
            @errorCreatingParticipant="setModalData"
        />
        <ImportParticipant
            v-if="state == 'importParticipants'"
            :eventId="eventId"
            @switch="switchState"
            @participantsImported="setModalData"
            @errorImportingParticipants="setModalData"
        />
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

import { visuallyHideModalBackdrop, API_URL } from "@/assets/js";

const event = ref("loading");
const eventId = ref("");
const state = ref("details");

const modalData = ref({});

const router = useRouter();

onMounted(async () => {
    eventId.value = router.currentRoute.value.params.id;

    try {
        await $.get(API_URL + `events/${eventId.value}`, (data) => {
            event.value = data.data[0];
        });
    } catch {
        event.value = "error";
        // do nothing
    }
});

function switchState(newState) {
    state.value = newState;
}

function setModalData(newData) {
    modalData.value = newData;

    // wait a little bit for I don't know what
    // still tryna understand this part
    // but that's the only way it'll work
    setTimeout(() => {
        const modal = new boosted.Modal("#exampleModal");
        modal.show("#toggleMyModal");

        visuallyHideModalBackdrop();
    }, 500);
}
</script>

<style scoped></style>
