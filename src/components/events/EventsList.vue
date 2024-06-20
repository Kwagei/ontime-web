<template>
	<div id="eventsTableContainer">
		<table v-if="allEvents.length" class="table table-hover mb-0">
			<thead>
				<tr>
					<th scope="col">
						<input type="checkbox" class="form-check-input" />
					</th>
					<th scope="col">Title</th>
					<th scope="col">Start Date</th>
					<th scope="col">End Date</th>
					<th scope="col">Facilitator</th>
					<th scope="col">Type</th>
					<th scope="col">Details</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="event in eventsToShow">
					<td>
						<input
							class="form-check-input"
							type="checkbox"
							name="{{ event.id }}"
						/>
					</td>
					<td>{{ event.title }}</td>
					<td>
						{{ formatDate(event.start_date) }}
					</td>
					<td>{{ formatDate(event.end_date) }}</td>
					<td>{{ event.facilitator }}</td>
					<td>{{ event.type }}</td>
					<td>{{ formatDetails(event.details) }}</td>
				</tr>
			</tbody>
		</table>
		<h2 v-else-if="Array.isArray(allEvents) && allEvents.length <= 0">
			No Events Currently!
		</h2>
		<div
			class="d-flex justify-content-center"
			v-else-if="allEvents == 'loading'"
		>
			<div
				class="spinner-border spinner-border-lg position-absolute top-50"
				role="status"
			>
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>
		<h2 v-else>Error Loading Events, Try again!</h2>
	</div>
	<Pagination v-model="paginationStart" />
</template>

<script setup>
import Pagination from "../Pagination.vue";
import { ref, onMounted, watch } from "vue";
import $ from "jquery";

import { formatDate, API_URL } from "../../assets/js/index.js";

const paginationStart = ref(0);
const allEvents = ref("loading");
const eventsToShow = ref([]);
const MAX = ref(10);

const formatDetails = (detail) => {
	let words = detail.split(" ");

	return words.length > 7 ? `${words.slice(0, 7).join(" ")}...` : detail;
};

onMounted(async () => {
	await getEvents();
});

watch(paginationStart, (newValue) => {
	eventsToShow.value = allEvents.value.slice(newValue, MAX.value + newValue);

	// get more events if we're on the last page of the
	// pagination and we still have events to fetch
	if (allEvents.value.length - newValue == 10) moreEvents();
});

async function getEvents(
	search = "",
	start = 0,
	limit = 20,
	from = "",
	to = ""
) {
	// Get Events from API on `localhost:3000`
	try {
		const url = API_URL + `events?start=${start}&limit=${limit}`;

		if (search) url += `&search=${search}`;
		if (from) url += `&from=${from}`;
		if (to) url += `&to=${to}`;

		await $.get(url, (data) => {
			allEvents.value = data.data;
			hasEvents.value = allEvents.value.length ? false : true;
			eventsToShow.value = allEvents.value.slice(0, 10);
		});
	} catch (error) {
		// do nothing
		allEvents.value = "error";
	}
}

async function moreEvents(
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
			allEvents.value.push(...data.data);
		});
	} catch (error) {
		// do nothing
	}
}
</script>

<style scoped>
#eventsTableContainer {
	max-height: 63vh;
	overflow: scroll;
	margin-bottom: 30px;
}
</style>
