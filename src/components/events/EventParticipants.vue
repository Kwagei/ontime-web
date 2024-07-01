<template>
	<div
		v-show="
			(participants == 'loading' && searchQuery) ||
			participants == 'noMatch' ||
			sorting ||
			hasParticipants
		"
		class="mt-3 w-100"
	>
		<div class="d-flex justify-content-between mb-3">
			<Search v-model:search="searchQuery" />
			<!-- <Filter /> -->
			<Sort
				v-model:term="term"
				v-model:direction="direction"
				:sortTerms="participantsSortTerms"
			/>
		</div>
	</div>
	<div class="w-100" v-if="hasParticipants">
		<ParticipantsTable :participants="participantsToShow" />
		<Pagination
			class="mx-2"
			v-if="Array.isArray(participants) && !!participants.length"
			v-model="paginationStart"
		/>
	</div>
	<div
		class="d-flex justify-content-center mt-5"
		v-else-if="participants == 'loading'"
	>
		<div class="spinner-border spinner-border-lg" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
	</div>
	<h2 class="w-75 text-center" v-else-if="participants == 'error'">
		<hr />
		Error Loading Event Participants, Try again!
	</h2>
	<h2 class="w-75 text-center" v-else-if="participants == 'noMatch'">
		<hr />
		No match!
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
import Sort from "../Sort.vue";
import { API_URL } from "../../assets/js/index.js";

const router = useRouter();

const currentEvent = ref({});
const participants = ref("loading");
const participantsToShow = ref([]);
const paginationStart = ref(0);
const MAX_PARTICIPANTS_TO_SHOW = 10;
const sorting = ref(false);

const searchQuery = ref("");
const sortTern = ref("created_at");
const direction = ref("ASC");

const participantsSortTerms = [
	{ type: "Created At", term: "created_at" },
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
	participants.value = "loading";

	if (!searchQuery) {
		getParticipants();
		return;
	}

	// pass search query to events retrieval function
	getParticipants(newValue, 0, 30);
});

// Watch for Changes in the Sort and Direction
watch(
	() => [sortTern.value, direction.value],
	async ([newTerm, newDirection]) => {
		if (newTerm && newDirection) {
			sorting.value = true;
			participants.value = "loading";

			await getParticipants(
				searchQuery.value,
				0,
				30,
				newTerm,
				newDirection
			);

			sorting.value = false;
		}
	}
);

async function getParticipants(
	search = "",
	start = 0,
	limit = 20,
	sortTerm = sortTern.value,
	sortDirection = direction.value
) {
	try {
		let url = API_URL + `events/${eventId}/participants`;
		url += `?search=${search}`;
		url += `&start=${start}`;
		url += `&limit=${limit}`;
		url += `&sort=${sortTerm}`;
		url += `&direction=${sortDirection}`;

		await $.get(url, (data) => {
			// display 'No match' if there was no result from the search
			if (search && !data.data.length) participants.value = "noMatch";
			else {
				participants.value = data.data;
				participantsToShow.value = participants.value.slice(0, 10);
			}
		});
	} catch (error) {
		participants.value = "error";
	}
}

async function getEvent() {
	try {
		await $.get(API_URL + `events/${eventId}/`, (data) => {
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
</script>

<style scoped>
/* code... */
</style>
