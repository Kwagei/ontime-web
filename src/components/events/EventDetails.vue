<template>
    <div style="width: 81%" class="d-flex align-items-center flex-column">
        <div class="w-100 d-flex justify-content-between gap-4 pt-3">
            <BreadCrumbs :breadCrumbs="['events', event.title]" />
            <div class="d-flex gap-3">
                <button
                    @click="emit('switch', 'importParticipants')"
                    class="btn btn-secondary"
                >
                    Import Participants
                </button>
                <button
                    @click="emit('switch', 'addParticipant')"
                    class="btn btn-primary"
                >
                    Add Participant
                </button>
                <Edit
                    style="height: 45px; width: 50px; background-color: #ddd"
                    @click="$emit('editEvent')"
                />
            </div>
        </div>
        <div class="w-100 d-flex justify-content-between gap-4">
            <div
                class="d-flex justify-content-between mt-3 gap-4 mx-auto"
                style="width: 70%"
            >
                <div class="d-flex flex-column align-items-start">
                    <span class="fs-5">Facilitator</span>
                    <h3>{{ event.facilitator }}</h3>
                    <span class="fs-5">Type</span>
                    <h3>{{ event.type }}</h3>
                </div>
                <div class="d-flex flex-column align-items-end">
                    <span class="fs-5">Start Date</span>
                    <h3>{{ formatDate(event.start_date) }}</h3>
                    <span class="fs-5">End Date</span>
                    <h3>{{ formatDate(event.end_date) }}</h3>
                </div>
            </div>
            <div v-show="event.details" class="border border-1"></div>
            <div v-show="event.details" class="w-50 pt-2 text-left flex-grow-1">
                <span class="fs-5">Details</span>
                <h5 class="mt-2 mb-0">{{ event.details }}</h5>
            </div>
        </div>
        <EventParticipants @switch="emit('switch', 'addParticipant')" />
    </div>
</template>

<script setup>
import BreadCrumbs from "../BreadCrumbs.vue";
import EventParticipants from "./EventParticipants.vue";

import { formatDate } from "../../assets/js/index.js";
import Edit from "../Edit.vue";

const props = defineProps({
    event: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["switch"]);
</script>

<style scoped>
#eventOptionsUL {
    position: absolute;
    z-index: 9999;
    background-color: #eee;
    list-style: none;
    border: 2px solid #555;
    padding: 0;
}

#eventOptionsUL li {
    padding: 15px;
    cursor: pointer;
    font-weight: 800;
}

#eventOptionsUL li:hover {
    background-color: #ddd;
}
</style>
