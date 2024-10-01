<template>
    <AlertModal :data="modalData" />
    <h2 v-if="event == 'error'" class="d-flex justify-content-center pt-5">
        Unable to load event, Try again
    </h2>
    <div
        v-else-if="event == 'loading'"
        class="text-center d-flex justify-content-center align-items-center"
        role="status"
        style="height: 85vh"
    >
        <div
            class="spinner-border spinner-border-lg"
            style="margin-top: -25vh"
            role="status"
        >
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div v-else class="d-flex flex-column" id="eventContentDiv">
        <EventTitle :title="event.title" />
        <!-- don't change the width on this div -->
        <div id="eventSlotDiv">
            <EventDetails
                :event="event"
                v-if="state == 'details'"
                @switch="switchState"
                @displayEventParticipants="switchState"
                @editEvent="editEvent"
            />
            <EventAttendance
                v-if="state == 'todaysAttendance'"
                :eventId="eventId"
                @switch="switchState"
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

import AddParticipant from "./AddParticipant.vue";
import ImportParticipant from "./ImportParticipant.vue";
import EventDetails from "./EventDetails.vue";
import EventTitle from "./EventTitle.vue";
import AlertModal from "../modals/AlertModal.vue";

import { getEvents } from "@/assets/js/index.js";
import { showModal } from "@/util/util.js";
import EventAttendance from "./EventAttendance.vue";

const router = useRouter();

const event = ref("loading");
const eventId = ref(router.currentRoute.value.params.id);
const state = ref("details");
const modalData = ref({});

const props = defineProps({
    breadCrumbs: Array,
});

onMounted(async () => {
    fetchEvents();
});

async function fetchEvents() {
    try {
        const data = await getEvents(eventId.value);
        event.value = data[0];
    } catch {
        event.value = "error";
    }
}

function switchState(newState) {
    state.value = newState;
}

function setModalData(newData) {
    modalData.value = newData;

    showModal("#alertModal", "#alertModalBody");
}

function editEvent() {
    router.push(`/events/${eventId.value}/edit-event`, {
        params: { id: eventId.value },
    });
}
</script>

<style scoped>
#eventContentDiv {
    width: 100%;
}

#eventSlotDiv {
    width: 90%;
    display: flex;
    align-self: center;
}
</style>
