<template>
    <div class="d-flex align-items-center flex-column">
        <div class="w-100 d-flex justify-content-between gap-4 pt-3">
            <BreadCrumbs :breadCrumbs="['events', event.title]" />
            <div class="d-flex gap-3">
                <button
                    class="btn btn-secondary"
                    @click="emit('switch', 'todaysAttendance')"
                    style="border: 0.125rem solid black"
                    data-bs-theme="dark"
                >
                    Today's Attendance
                </button>
                <button
                    class="btn btn-secondary"
                    @click="emit('switch', 'importParticipants')"
                >
                    Import Participants
                </button>
                <button
                    class="btn btn-primary"
                    id="addParticipantBtn"
                    @click="emit('switch', 'addParticipant')"
                >
                    Add Participant
                </button>
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
        <div class="w-100 d-flex justify-content-between gap-4">
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
                    <h4>
                        {{ formatDateTime(event.start_date, { date: true }) }}
                    </h4>
                    <span class="fs-6">End Date</span>
                    <h4>
                        {{ formatDateTime(event.end_date, { date: true }) }}
                    </h4>
                    <span class="fs-6">Room</span>
                    <h4>{{ event.room }}</h4>
                    <span class="fs-6">Created At</span>
                    <h4>
                        {{ formatDateTime(event.created_at) }}
                    </h4>
                </div>
            </div>
            <div class="border border-1"></div>
            <div class="w-50 pt-2 text-left flex-grow-1">
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
import { formatDateTime } from "../../assets/js/util.js";

const edit = "pencil";

const props = defineProps({
    event: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["editEvent", "switch"]);
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

.editBtn {
    padding: 0.5rem;
}

.editBtn svg {
    height: 1.3rem !important;
    padding: 0 !important;
    margin: 0 !important;
}
</style>
