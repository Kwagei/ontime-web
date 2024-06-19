<template>
    <div v-if="hasParticipants">
        <div class="mt-3" style="width: 67.5vw">
            <div class="d-flex justify-content-between mb-3">
                <Search v-model:search="searchQuery" />
                <Filter />
                <Sort :sortTerms="participantsSortTerms" />
            </div>
            <ParticipantsTable :participants="participantsToShow" />
        </div>
        <Pagination
            v-if="Array.isArray(participants) && !!participants.length"
            v-model="paginationStart"
        />
    </div>
    <div
        class="d-flex justify-content-center"
        style="margin: 75px 0"
        v-else-if="participants == 'loading'"
    >
        <div
            class="spinner-border spinner-border-lg position-absolute top-75"
            role="status"
        >
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <h2 class="w-75 text-center" v-else-if="participants == 'error'">
        <hr />
        Error Loading Event Participants, Try again!
    </h2>
    <h2 class="w-75 text-center" v-else>
        <hr />
        No Event Participants Currently!
    </h2>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import $ from "jquery";
import { useRouter } from "vue-router";

import ParticipantsTable from "./ParticipantsTable.vue";
import Pagination from "../Pagination.vue";
import Search from "../Search.vue";
import Filter from "../Filter.vue";
import Sort from "../Sort.vue";
import { API_URL } from "../../assets/js/index.js";

const router = useRouter();

const currentEvent = ref({});
const participants = ref("loading");
const participantsToShow = ref([]);
const paginationStart = ref(0);
const MAX_PARTICIPANTS_TO_SHOW = 10;
const searchQuery = ref("");

const participantsSortTerms = [
    { type: "First Name", term: "first_name" },
    { type: "Middle Name", term: "middle_name" },
    { type: "Last Name", term: "last_name" },
    { type: "Email", term: "email" },
    { type: "Contact", term: "msisdn" },
    { type: "Address", term: "address" },
];

const eventId = router.currentRoute.value.params.id;

const hasParticipants = computed(
    () => Array.isArray(participants.value) && participants.value.length
);

onMounted(() => {
    getEvent();
    getParticipants();
});

// Watch Pagination for Switches
watch(paginationStart, (newValue) => {
    participantsToShow.value = participants.value.slice(
        newValue,
        MAX_PARTICIPANTS_TO_SHOW + newValue
    );

    // get more events if we're on the last page of the
    // pagination and we still have events to fetch
    if (participants.value.length - newValue == 10) moreParticipants();
});

// Watch Search Input for Input
watch(searchQuery, async (newValue) => {
    if (!searchQuery) {
        participantsToShow.value = participants.value.slice(
            0,
            MAX_PARTICIPANTS_TO_SHOW
        );
        return;
    }

    // pass search query to events retrieval function
    search(newValue);
});

async function getParticipants() {
    try {
        await $.get(API_URL + `events/${eventId}/participants`, (data) => {
            console.log("Retrieved Participants: ", data);
            participants.value = data.data;
            participantsToShow.value = participants.value.slice(0, 10);
        });
    } catch (error) {
        console.log(
            "Error retrieving event participants: ",
            error.responseJSON
        );
        participants.value = "error";
    }
}

async function getEvent() {
    try {
        await $.get(API_URL + `events/${eventId}/`, (data) => {
            console.log("Retrieved Event Data: ", data.data[0]);
            currentEvent.value = data.data[0];
        });
    } catch (error) {
        console.log("Error fetching event: ", error.responseJSON);
    }
}

async function moreParticipants(
    search = "",
    start = allEvents.value.length,
    limit = 20,
    from = "",
    to = ""
) {
    // Get Events from API on `localhost:3000`
    try {
        let url = `http://localhost:3000/api/events?start=${start}&limit=${limit}`;

        if (search) url += `&search=${search}`;
        if (from) url += `&from=${from}`;
        if (to) url += `&to=${to}`;

        await $.get(url, (data) => {
            participants.value.push(...data.data);
        });
    } catch (error) {
        // do nothing
    }
}

function search(query) {
    participantsToShow.value = participants.value.filter((participant) => {
        return (
            participant.first_name
                .toLowerCase()
                .includes(query.toLowerCase()) ||
            (participant.middle_name &&
                participant.middle_name
                    .toLowerCase()
                    .includes(query.toLowerCase())) ||
            participant.last_name.toLowerCase().includes(query.toLowerCase()) ||
            participant.address.toLowerCase().includes(query.toLowerCase()) ||
            participant.msisdn.toLowerCase().includes(query.toLowerCase()) ||
            participant.email.toLowerCase().includes(query.toLowerCase())
        );
    });
}
</script>

<style scoped>
/* code... */
</style>
