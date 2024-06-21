<template>
	<div class="row justify-content-between container p-0 mx-auto">
		<Search v-model:search="searchTerms" />
		<Filter />
		<Sort
			:sortTerms="sortTerms"
			v-model:term="sortTerm"
			v-model:direction="directionTerm"
		/>
	</div>
	<div class="table-responsive container p-0">
		<table class="table table-sm table-hover has-checkbox">
			<thead>
				<tr>
					<th scope="col">
						<div class="form-check mb-0">
							<input
								class="form-check-input"
								type="checkbox"
								id="selectAll"
								@change="selectAll"
								:checked="allSelected"
							/>
							<label class="form-check-label" for="selectAll">
								<span class="visually-hidden">Select all</span>
							</label>
						</div>
					</th>
					<th scope="col">Date</th>
					<th scope="col">Visitor</th>
					<th scope="col">Arrival time</th>
					<th scope="col">Departure time</th>
					<th scope="col">Phone number</th>
					<th scope="col">Purpose</th>
					<th scope="col">Items</th>
					<th scope="col">Checkout</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="visit in visits" :key="visit.id" :id="visit">
					<td>
						<div class="form-check mb-0">
							<input
								class="form-check-input"
								type="checkbox"
								:id="`checkbox-${visit.id}`"
								v-model="visit.selected"
							/>
						</div>
					</td>
					<td>{{ visit.date }}</td>
					<td>{{ visit.first_name + " " + visit.last_name }}</td>
					<td>{{ visit.arrival_time }}</td>
					<td>{{ visit.departure_time }}</td>
					<td>{{ visit.msisdn }}</td>
					<td>{{ visit.purpose }}</td>
					<td>{{ visit.items }}</td>
					<td>

						<button type="button" class="btn btn-primary">Checkout</button>
					</td>
				</tr>
			</tbody>
		</table>
		<div
			id="spinner"
			v-if="loader"
			class="d-flex justify-content-center p-4"
		>
			<div class="spinner-border" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>
	</div>
	<Pagination v-model="start" />
</template>

<script setup>
import Pagination from "../Pagination.vue";
import Search from "../Search.vue";
import Filter from "../Filter.vue";
import Sort from "../Sort.vue";

import { ref, computed, watch } from "vue";
import { getVisits } from "@/assets/js/index.js";

const visits = ref([]);
const start = ref(0);
const limit = ref(10);
const loader = ref(true);
const sort = ref("");

const searchTerms = ref("");

const sortTerms = ref([
	{ type: "Date", term: "date_time" },
	{ type: "Arrival Time", term: "arrival_time" },
	{ type: "Departure Time", term: "departure_time" },
	{ type: "Purpose", term: "purpose" },
	{ type: "Phone Number", term: "msisdn" },
]);
const sortTerm = defineModel("term");
sortTerm.value = "created_at";

const directionTerm = defineModel("direction");
directionTerm.value = "desc";

watch(
	() => [searchTerms.value, sortTerm.value, directionTerm.value, start.value],
	async ([searchValue, sortValue, directionValue, startValue]) => {
		const data = await getVisits({
			start: startValue,
			search: searchValue,
			sort: sortValue,
			direction: directionValue,
			limit: limit.value,
		});
		visits.value = formatDateTime(data);
	}
);

const fetchData = async () => {
	try {
		const data = await getVisits({
			sort: sortTerm.value,
			direction: directionTerm.value,
			limit: limit.value,
		});
		visits.value = formatDateTime(data);
		loader.value = false;
	} catch (error) {
		console.error("Error fetching visits:", error);
	}
};

const formatDateTime = (visits) => {
	return visits.map((visit) => {
		let date = "",
			arrival_time = "",
			items = "";

		if (visit.date_time) {
			[date, arrival_time] = visit.date_time.split("T");
			arrival_time = arrival_time.split(".")[0];
		}

		if (Array.isArray(visit.items)) {
			items = visit.items.join(", ");
		}

		return {
			...visit,
			date,
			arrival_time,
			items,
			selected: false,
		};
	});
};

const formatItems = (visits) => {
	visits.forEach((visit) => {
		if (visit.items && Array.isArray(visit.items)) {
			const commaSeparatedString = visit.items.join(", ");
			console.log(commaSeparatedString);
		}
	});
};

fetchData();

const allSelected = computed({
	get() {
		return (
			visits.value.length > 0 &&
			visits.value.every((visit) => visit.selected)
		);
	},
	set(value) {
		visits.value.forEach((visit) => {
			visit.selected = value;
		});
	},
});

const selectAll = (event) => {
	allSelected.value = event.target.checked;
};

// Optional: Remove or comment out after debugging
console.log(visits);
</script>

<style scoped>
table {
	margin: 0;
}
th,
td {
	padding: 0.9rem;
}

@media (min-width: 768px) and (max-width: 1440px) {
	th,
	td {
		padding: 0.7rem;
	}
}
</style>
