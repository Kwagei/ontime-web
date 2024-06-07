<template>
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
    <div
        v-else
        class="d-flex flex-column align-items-center"
        style="width: 100% !important"
    >
        <EventTitle :title="event.title" />
        <EventDetails
            :event="event"
            v-if="state == 'details'"
            @switch="switchState"
        />
        <AddParticipant
            v-if="state == 'addParticipant'"
            @switch="switchState"
        />
        <ImportParticipant
            v-if="state == 'importParticipants'"
            :eventId="eventId"
            @switch="switchState"
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

const event = ref("loading");
const eventId = ref("");
const state = ref("details");

const router = useRouter();

onMounted(async () => {
    eventId.value = router.currentRoute.value.params.id;

    try {
        await $.get(
            `http://localhost:3000/api/events/${eventId.value}`,
            (data) => {
                event.value = data.data[0];
            }
        );
    } catch {
        event.value = "error";
        // do nothing
    }
});

function switchState(newState) {
    state.value = newState;
}
</script>

<style scoped></style>
