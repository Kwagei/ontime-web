<template>
	<div
		class="table-responsive container p-0 d-flex flex-column"
		style="gap: 0.9rem"
	>
		<div class="row justify-content-between container p-0 mx-auto">
			<Search v-model:search="searchTerms" />
			<Sort v-model:direction="directionTerm" />
		</div>
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
					<th
						scope="col"
						class="d-flex justify-content-center align-items-center"
					>
						Checkout
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="visit in visits" :key="visit.id" :id="visit.id">
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
					<td>{{ `${visit.first_name} ${visit.last_name}` }}</td>
					<td>{{ visit.arrival_time }}</td>
					<td>{{ visit.departure_time }}</td>
					<td>{{ visit.msisdn }}</td>
					<td>{{ visit.purpose }}</td>
					<td>{{ visit.items }}</td>
					<td
						class="d-flex justify-content-center align-items-center"
					>
						<button
							v-if="!visit.departure_time"
							type="button"
							class="btn btn-primary"
							style="font-size: 0.9rem"
							@click="handleCheckout(visit.id)"
						>
							Checkout
						</button>
						<span v-else>
							<svg
								width="100"
								height="100"
								viewBox="0 0 100 100"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill="#228722"
									fill-rule="evenodd"
									d="M29.745 27a5.77 5.77 0 00-7.845.3l-2.31 2.312a5.78 5.78 0 00-.425 7.7l18.482 23.12a5.77 5.77 0 009.019 0l36.965-46.24a5.776 5.776 0 00-8.458-7.826L41 39.48Zm50.193-4.63-6.992 8.74A32.4 32.4 0 0175 42.5C75 60.449 60.449 75 42.5 75S10 60.449 10 42.5 24.551 10 42.5 10a32.35 32.35 0 0119.144 6.237L68.909 9.2A42.32 42.32 0 0042.5 0C19.028 0 0 19.028 0 42.5S19.028 85 42.5 85 85 65.972 85 42.5a42.3 42.3 0 00-5.062-20.131Z"
								/>
							</svg>
						</span>
					</td>
				</tr>
			</tbody>
		</table>
		<div>
			<div
				id="spinner"
				v-if="loader"
				class="d-flex justify-content-center p-4"
			>
				<div class="spinner-border" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
			<div
				v-if="fetchError"
				class="invalid-feedback show-feedback m-auto"
			>
				{{ errorMessage }}
			</div>
		</div>
	</div>
	<Pagination v-model="start" />
</template>

<style scoped>
.show-feedback {
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: larger;
	padding: 4rem;
}
table {
	margin: 0;
}
th,
td {
	padding: 0.9rem;
	font-size: 0.9rem;
}

@media (min-width: 768px) and (max-width: 1440px) {
	th,
	td {
		padding: 0.7rem;
	}
}
</style>

<script setup>
import Pagination from "../Pagination.vue";
import Search from "../Search.vue";
import Filter from "../Filter.vue";
import Sort from "../Sort.vue";
import { updateDepartureTime } from "@/assets/js/index";

import { ref, computed, watch } from "vue";
import { getVisits } from "@/assets/js/index.js";

const visits = ref([]);
const start = ref(0);
const limit = ref(10);
const loader = ref(true);
const sort = ref("");
const MAX_ITEMS_LEN = 3;

const fetchError = ref(false);
const errorMessage = ref("Error Loading Visits, Try Again!");

const searchTerms = ref("");
const refresh = defineModel("refresh");

watch(
	() => refresh.value,
	async () => {
		visits.value = [];
		loader.value = true;
		await fetchVisits();
		refresh.value = false;
	}
);
const sortTerms = ref([
	{ type: "Date", term: "date_time" },
	{ type: "Arrival Time", term: "arrival_time" },
	{ type: "Departure Time", term: "departure_time" },
	{ type: "Purpose", term: "purpose" },
	{ type: "Phone Number", term: "msisdn" },
]);
const sortTerm = defineModel("term");
sortTerm.value = "date_time";

const directionTerm = defineModel("direction");
directionTerm.value = "desc";

// function to update departure time
const checkout = async (id) => {
	try {
		const visit_checkout = await updateDepartureTime(id);
		if (visit_checkout.ok) {
			return visit_checkout.result.data[0].departure_time;
		}
	} catch (error) {
		console.error("Error updating departure time:", error);
	}
};

const handleCheckout = async (id) => {
	try {
		const time = await checkout(id);
		const tr = document.getElementById(id).children;
		const checkStatus = tr[8];
		checkStatus.innerHTML = `<span>
							<svg
								width="100"
								height="100"
								viewBox="0 0 100 100"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill="#228722"
									fill-rule="evenodd"
									d="M29.745 27a5.77 5.77 0 00-7.845.3l-2.31 2.312a5.78 5.78 0 00-.425 7.7l18.482 23.12a5.77 5.77 0 009.019 0l36.965-46.24a5.776 5.776 0 00-8.458-7.826L41 39.48Zm50.193-4.63-6.992 8.74A32.4 32.4 0 0175 42.5C75 60.449 60.449 75 42.5 75S10 60.449 10 42.5 24.551 10 42.5 10a32.35 32.35 0 0119.144 6.237L68.909 9.2A42.32 42.32 0 0042.5 0C19.028 0 0 19.028 0 42.5S19.028 85 42.5 85 85 65.972 85 42.5a42.3 42.3 0 00-5.062-20.131Z"
								/>
							</svg>
						</span>`;
		const departure_time = tr[4];
		departure_time.textContent = time;
	} catch (error) {
		console.error("Error updating departure time:", error);
	}
};

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

const fetchVisits = async () => {
	try {
		const data = await getVisits({
			sort: sortTerm.value,
			direction: directionTerm.value,
			limit: limit.value,
		});
		visits.value = formatDateTime(data);
		loader.value = false;
	} catch (error) {
		loader.value = false;
		fetchError.value = true;
	}
};

const formatDateTime = (visits) => {
	return visits.map((visit) => {
		let date = "",
			arrival_time = "";

		if (visit.date_time) {
			[date, arrival_time] = visit.date_time.split("T");
			arrival_time = arrival_time.split(".")[0];
		}

		if (Array.isArray(visit.items)) {
			visit.items =
				visit.items.length > MAX_ITEMS_LEN
					? `${visit.items.slice(0, MAX_ITEMS_LEN).join(", ")}...`
					: visit.items.join(", ");
		}

		if (visit.purpose) {
			const purpose = visit.purpose.split(" ");
			visit.purpose =
				purpose.length > MAX_ITEMS_LEN
					? `${purpose.slice(0, MAX_ITEMS_LEN).join(" ")}...`
					: visit.purpose;
		}

		return {
			...visit,
			date,
			arrival_time,
			selected: false,
		};
	});
};

fetchVisits();

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
</script>
