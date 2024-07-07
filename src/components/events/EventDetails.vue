<template>
    <div class="w-100 d-flex align-items-center flex-column container">
        <div class="w-100 d-flex justify-content-between pt-3">
            <BreadCrumbs :breadCrumbs="['events', event.title]" />
            <div class="d-flex gap-3">
                <button
                    @click="emit('switch', 'importParticipants')"
                    class="btn btn-secondary"
                >
                    Import Participants
                </button>

                <router-link
                    :to="{
                        name: 'add-event-participant',
                    }"
                >
                    <button class="btn btn-primary">Add Participant</button>
                </router-link>

                <button
                    class="btn btn-secondary editBtn"
                    style="border: 0.125rem solid black"
                    type="button"
                    data-bs-theme="dark"
                    @click="$emit('editEvent')"
                >
                    <Icons v-model:icon="edit" />
                </button>
            </div>
        </div>
        <div class="d-flex justify-content-between gap-4" style="width: 81%">
            <div
                class="d-flex justify-content-between mt-3 gap-4 mx-auto"
                style="width: 70%"
            >
                <div class="d-flex flex-column align-items-start">
                    <span class="fs-6">Facilitator</span>
                    <h4>{{ event.facilitator }}</h4>
                    <span class="fs-6">Type</span>
                    <h4>{{ event.type }}</h4>
                    <span class="fs-6">Host</span>
                    <h4>{{ event.host }}</h4>
                    <span class="fs-6">Host Type</span>
                    <h4>{{ event.host_type }}</h4>
                </div>
                <div class="d-flex flex-column align-items-end">
                    <span class="fs-6">Start Date</span>
                    <h4>{{ formatDate(event.start_date) }}</h4>
                    <span class="fs-6">End Date</span>
                    <h4>{{ formatDate(event.end_date) }}</h4>
                    <span class="fs-6">Room</span>
                    <h4>{{ event.room }}</h4>
                    <span class="fs-6">Created At</span>
                    <h4>{{ formatDate(event.created_at) }}</h4>
                </div>
            </div>
            <div v-show="event.details" class="border border-1"></div>
            <div v-show="event.details" class="w-50 pt-2 text-left flex-grow-1">
                <span class="fs-6">Details</span>
                <h5 class="mt-2 mb-0">{{ event.details }}</h5>
            </div>
        </div>
        <EventParticipants />
    </div>
</template>

<script setup>
import BreadCrumbs from "../BreadCrumbs.vue";
import EventParticipants from "./EventParticipants.vue";
import Icons from "../Icons.vue";

const edit = "pencil";

import { formatDate } from "../../assets/js/index.js";
import { RouterLink } from "vue-router";

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

.btn {
    padding: 0.5rem !important;
}
.btn:hover {
    border: 0.125rem solid black !important;
}

.btn:hover path {
    fill: white;
}
.editBtn svg {
    height: 1.5rem !important;
    margin: 0 !important;
}
</style>
