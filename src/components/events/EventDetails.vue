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

        <div class="d-flex gap-3" id="detailsOptionsContainer">
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
            <Options @click="displayOptions" />
            <ul class="d-none" id="eventOptionsUL">
                <a
                    class="link-underline link-underline-opacity-0"
                    href="http://localhost:5173/participants_template.csv"
                    download="participants_template.csv"
                >
                    <li>Download CSV Template</li>
                </a>
                <a
                    class="link-underline link-underline-opacity-0"
                    :href="`/events/${eventId}/participants`"
                >
                    <li>View Participants</li>
                </a>
            </ul>
        </div>
    </div>
</template>

<script setup>
import Options from "../Options.vue";

import { formatDate } from "../../assets/js/index.js";
import $ from "jquery";
import { useRoute } from "vue-router";

const router = useRoute();
const eventId = router.params.id;
const props = defineProps({
    event: {
        type: Object,
        required: true,
    },
});

$(document).on("click", () => {
    $("#eventOptionsUL").addClass("d-none");
});

function displayOptions(event) {
    // show drop down list of options
    const eventsOptionsUL = $("#eventOptionsUL");
    eventsOptionsUL.toggleClass("d-none");
    event.stopPropagation();
    eventsOptionsUL[0].style.left = `${event.clientX - 130}px`;
    eventsOptionsUL[0].style.top = `${event.clientY + 10}px`;
}
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
