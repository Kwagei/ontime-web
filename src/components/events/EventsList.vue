<template>
	<div class="mb-3 d-flex justify-content-center">
		<table
			v-if="Array.isArray(allEvents) && allEvents.length"
			class="table table-hover mb-0"
		>
			<thead>
				<tr>
					<th scope="col">
						<input type="checkbox" class="form-check-input" />
					</th>
					<th scope="col">Title</th>
					<th scope="col">Host</th>
					<th scope="col">Start Date</th>
					<th scope="col">End Date</th>
					<th scope="col">Facilitator</th>
					<th scope="col">Type</th>
					<th scope="col">Details</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="event in eventsToShow"
					@click="displayEventPage(event.id)"
					class="cursorPointer"
				>
					<td>
						<input
							class="form-check-input"
							type="checkbox"
							name="{{ event.id }}"
							@click.stop
						/>
					</td>
					<td>{{ event.title }}</td>
					<td>{{ event.host }}</td>
					<td style="min-width: 150px">
						{{ formatDate(event.start_date) }}
					</td>
					<td style="min-width: 150px">
						{{ formatDate(event.end_date) }}
					</td>
					<td>{{ event.facilitator }}</td>
					<td>{{ event.type }}</td>
					<td>{{ formatDetails(event.details) }}</td>
				</tr>
			</tbody>
		</table>
		<h2
			class="w-75 text-center"
			v-else-if="Array.isArray(allEvents) && allEvents.length <= 0"
		>
			<hr />
			No Events Currently!
		</h2>
		<div
			class="d-flex justify-content-center"
			style="margin: 75px 0"
			v-else-if="allEvents == 'loading'"
		>
			<div class="spinner-border" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>
		<h2 class="w-75 text-center" v-else-if="allEvents == 'noMatch'">
			<hr />
			No match!
		</h2>
		<h2 class="w-75 text-center" v-else>
			<hr />
			Error Loading Events, Try again!
		</h2>
	</div>
	<Pagination
		v-if="Array.isArray(allEvents) && !!allEvents.length"
		v-model="paginationStart"
	/>
</template>

<script setup>
import Pagination from "../Pagination.vue";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { formatDate, API_URL } from "../../assets/js/index.js";
import $ from "jquery";

const paginationStart = ref(0);
const allEvents = ref("loading");
const eventsToShow = ref([]);
const MAX_EVENTS_TO_SHOW = ref(30);
const router = useRouter();
const MAX_DETAIL_LEN = 5;

const props = defineProps({
	searchQuery: String,
	refresh: Boolean,
});

const emit = defineEmits(["refreshComplete"]);

onMounted(async () => {
	await getEvents();
});

// Watch Pagination Switches
watch(paginationStart, (newValue) => {
	eventsToShow.value = allEvents.value.slice(
		newValue,
		MAX_EVENTS_TO_SHOW.value + newValue
	);

	// get more events if we're on the last page of the
	// pagination and we still have events to fetch
	if (allEvents.value.length - newValue == 10) moreEvents();
});

// Watch Input into the Events Search Input
watch(
	() => props.searchQuery,
	async (newValue) => {
		if (!props.searchQuery) await getEvents();

		// pass search query to events retrieval function
		await getEvents(newValue, 0, 30);
	}
);

// Watch Refresh Prop to refresh events accordingly
watch(
	() => props.refresh,
	async () => {
		if (props.refresh) {
			await getEvents();
			emit("refreshComplete");
		}
	}
);

async function getEvents(
	search = "",
	start = 0,
	limit = 20,
	from = "",
	to = ""
) {
	allEvents.value = "loading";

	// Get Events from API
	try {
		let url = API_URL + `/events?start=${start}&limit=${limit}`;

		if (search) url += `&search=${search}`;
		if (from) url += `&from=${from}`;
		if (to) url += `&to=${to}`;

		await $.get(url, (data) => {
			// display no match if there was no result from the search
			if (search && !data.data.length) {
				allEvents.value = "noMatch";
			} else {
				console.log(data);
				allEvents.value = data.data;
				eventsToShow.value = allEvents.value.slice(0, 10);
			}
		});
	} catch (error) {
		// do nothing
		allEvents.value = "error";
	}
}

function formatDetails(detail) {
	const detailLen = detail.length;
	console.log({ detailLen });
	const newDetail =
		detailLen >= MAX_DETAIL_LEN
			? `${detail.slice(0, MAX_DETAIL_LEN)}...`
			: detail;

	return newDetail;
}

async function moreEvents(
	search = "",
	start = allEvents.value.length,
	limit = 20,
	from = "",
	to = ""
) {
	try {
		let url = API_URL + `events?start=${start}&limit=${limit}`;

		if (search) url += `&search=${search}`;
		if (from) url += `&from=${from}`;
		if (to) url += `&to=${to}`;

		await $.get(url, (data) => {
			console.log("More Events: ", data);
			allEvents.value.push(...data.data);
		});
	} catch (error) {
		// do nothing
	}
}

function displayEventPage(pageId) {
	router.push({ name: "specific-event", params: { id: pageId } });
}
</script>

<style scoped>
.cursorPointer {
	cursor: pointer;
}

th,
td {
	padding: 0.9rem;
	font-size: 0.9rem;
}

.cursorPointer {
	cursor: pointer;
}
</style>
