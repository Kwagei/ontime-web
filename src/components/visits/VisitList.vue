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
							<Icons v-model:icon="check" />
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

<script setup>
import Pagination from "../Pagination.vue";
import Search from "../Search.vue";
import Sort from "../Sort.vue";
import Icons from "@/components/Icons.vue";
import { updateDepartureTime } from "@/assets/js/index";

import { ref, computed, watch } from "vue";
import { getVisits } from "@/assets/js/index.js";

const check = "tick-confirmation";

const visits = ref([]);
const start = ref(0);
const limit = ref(10);
const loader = ref(true);
const sort = ref("");
const MAX_ITEMS_LEN = 30;

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
							<svg data-v-61ae8e47="" class="solaris-icon" aria-hidden="true" focusable="false"><use href="/src/assets/svg/solaris-icons-sprite.svg#tick-confirmation"></use></svg>
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
			visit.items = formatItems(visit.items);
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

const formatItems = (belonging) => {
	const items = belonging.join(", ");
	return items.length > MAX_ITEMS_LEN
		? `${items.slice(0, MAX_ITEMS_LEN)}...`
		: items;
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

svg {
	color: #228722;
}

@media (min-width: 768px) and (max-width: 1440px) {
	th,
	td {
		padding: 0.7rem;
	}
}
</style>
