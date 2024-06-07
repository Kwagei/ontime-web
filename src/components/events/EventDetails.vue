<template>
    <div class="w-100 d-flex align-items-center flex-column">
        <div class="d-flex justify-content-between w-50 mt-3 gap-4">
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
        <div class="w-50 pt-2 text-center">
            <h4>{{ event.details }}</h4>
        </div>

        <div class="d-flex gap-3">
            <button
                class="btn btn-primary"
                @click="$emit('switch', 'addParticipant')"
            >
                Add Participant
            </button>
            <button
                class="btn btn-primary"
                @click="$emit('switch', 'importParticipants')"
            >
                Import Participants
            </button>
        </div>

        <ul class="participant-list">
            <li v-for="participant in participants" :key="participant.id">
                {{ participant.firstName }} {{ participant.lastName }} -
                {{ participant.email }}
                <button @click="removeParticipant(participant)">Remove</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { formatDate } from "../../assets/js/index.js";

const props = defineProps({
    event: {
        type: Object,
        required: true,
    },
});
</script>

<style scoped>
/* code... */
</style>
