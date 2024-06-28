<template>
	<Modal :data="{ title, message, status }" />
	<div
		id="visit-view"
		class="d-flex flex-column container"
		style="padding-top: 2rem"
	>
		<div
			class="d-flex justify-content-between align-items-center container p-0 mx-auto"
			style="margin-top: 0.3rem"
		>
			<BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
		</div>

		<div
			class="mt-4 p-0 d-flex flex-column"
			style="border: none; background-color: transparent; gap: 3rem"
		>
			<form class="row g-3">
				<div class="dropdown" style="width: 42.5%">
					<label for="typeInput" class="form-label is-required">
						Select Event:
					</label>
					<input
						type="text"
						class="form-control"
						id="host"
						:id="eventID"
						:value="eventValue"
						aria-expanded="false"
						data-bs-toggle="dropdown"
						autocomplete="off"
					/>
					<ul class="dropdown-menu" style="width: 96.5%">
						<template v-for="(option, index) in options">
							<li
								class="dropdown-item"
								:value="option.id"
								@click="updateEventTerm(option)"
							>
								{{ option.text }}
							</li>
							<router-link :to="{ name: 'add-event' }">
								<li
									class="dropdown-item"
									style="color: #ff7900"
									v-if="!options[index + 1]"
								>
									Create new event
								</li>
							</router-link>
						</template>
					</ul>
				</div>
			</form>

			<!-- All Participants -->
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
									/>
									<label
										class="form-check-label"
										for="customCheck"
									>
										<span class="visually-hidden"
											>Select all</span
										>
									</label>
								</div>
							</th>
							<th scope="col">First name</th>
							<th scope="col">Middle name</th>
							<th scope="col">Last name</th>
							<th scope="col">Contact</th>
							<th scope="col">Email</th>
							<th scope="col">Address</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="participant in participants"
							:key="participant.id"
							@click="visitorDetail(participant.id)"
						>
							<td>
								<div class="form-check mb-0">
									<input
										class="form-check-input"
										type="checkbox"
										:id="`checkbox-${participant.id}`"
										v-model="participant.selected"
									/>
								</div>
							</td>
							<td>{{ participant.first_name }}</td>
							<td>{{ participant.middle_name }}</td>
							<td>{{ participant.last_name }}</td>
							<td>{{ participant.msisdn }}</td>
							<td>{{ participant.email }}</td>
							<td>{{ participant.address }}</td>
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
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import Modal from "../Modal.vue";
import {
	registerVisit,
	getSingleVisitor,
	getEvents,
	getParticipants,
} from "@/assets/js/index.js";
import Pagination from "../Pagination.vue";
import Search from "../Search.vue";
import Sort from "../Sort.vue";

const msisdn = ref("");
const visitor = ref("");
const visitorId = ref("");
const events = ref(null);
const belonging = ref("");
const options = ref([]);
const eventValue = ref("");
const eventID = ref("");
const host_id = ref("");
const room_id = ref("");
const room = ref("");
const institution = ref("");
const address = ref("");
const purpose = ref("");
const status = ref("");
const message = ref("");
const title = ref("");
const participants = ref("");
const start = ref(0);
const limit = ref(10);
const loader = ref(false);
const sort = ref("");
const sortTerm = defineModel("term");
sortTerm.value = "created_at";
const fetchError = ref(false);
const errorMessage = ref("Error Loading Visits, Try Again!");

const directionTerm = defineModel("direction");
directionTerm.value = "desc";

const searchTerms = ref("");

const activeBreadCrumbs = ref([]);

const props = defineProps({
	breadCrumbs: {
		type: Array,
		required: true,
	},
});

activeBreadCrumbs.value = [...props.breadCrumbs, "visit-checkin"];

onMounted(() => {
	(() => {
		"use strict";

		const forms = document.querySelectorAll(".needs-validation");

		Array.prototype.slice.call(forms).forEach((form) => {
			form.addEventListener(
				"submit",
				(event) => {
					if (!form.checkValidity()) {
						event.preventDefault();
						event.stopPropagation();
					}
					form.classList.add("was-validated");
				},
				false
			);
		});
	})();
	getEventsOptions();
});

const updateEventTerm = (host) => {
	eventValue.value = host.text;
	eventID.value = host.value;
	purpose.value = host.text;

	const selectedHost = events.value.find((val) => val.id === eventID.value);

	if (selectedHost) {
		room.value = selectedHost.room;
	}
};

// function for inserting each username in the select element
const getEventsOptions = async () => {
	try {
		events.value = await getEvents();

		options.value = events.value.map((event) => ({
			value: event.id,
			text: event.title,
		}));
	} catch (error) {
		console.error("Error retrieving users:", error);
	}
};

// function to get visitor bt MSISDN
const getVisitor = async () => {
	try {
		const visitorData = await getSingleVisitor({ msisdn: msisdn.value });
		if (!visitorData) {
			visitor.value = "";
			return;
		}
		visitor.value = `${visitorData.first_name} ${visitorData.last_name}`;
		visitorId.value = visitorData.id;
	} catch (error) {
		console.error("Error retrieving visitor:", error);
	}
};

// watching selected host name to update host ID
// watch(purpose, (title) => {
// 	const selectedEvent = events.value.find((event) => event.title === title);
// 	if (selectedEvent) {
// 		host_id.value = selectedEvent.host_id;
// 		room_id.value = selectedEvent.room_id;
// 		room.value = selectedEvent.room;
// 	}
// });

// watch(
// 	() => eventID.value,
// 	async (id) => {
// 		loader.value = true;
// 		const data = await getParticipants(id, {
// 			sort: sortTerm.value,
// 			direction: directionTerm.value,
// 			limit: limit.value,
// 		});
// 		participants.value = data;
// 		loader.value = false;
// 		fetchError.value = true;
// 	}
// );

watch(
	() => [
		searchTerms.value,
		sortTerm.value,
		eventID.value,
		directionTerm.value,
		start.value,
	],
	async ([searchValue, sortValue, id, directionValue, startValue]) => {
		loader.value = true;
		const data = await getParticipants(id, {
			start: startValue,
			search: searchValue,
			sort: sortValue,
			direction: directionValue,
			limit: limit.value,
		});

		participants.value = data;
		loader.value = false;
		fetchError.value = true;
	}
);

// function to validate form before it submit the form
const onSubmit = async () => {
	if (
		!msisdn.value ||
		!visitor.value ||
		!purpose.value ||
		!room.value ||
		!address.value
	) {
		return;
	}

	// plitting text into array by using command as the deleminator
	const items = belonging.value.split(",").map((item) => item.trim());

	// require values for the submittion of the form
	const visitData = {
		visitor_id: visitorId.value,
		institution: institution.value,
		address: address.value,
		items,
		room_id: room_id.value,
		host_id: host_id.value,
		purpose: purpose.value,
	};

	const response = await registerVisit(visitData);

	const myModal = new boosted.Modal("#exampleModal", { backdrop: true });
	myModal.show(document.querySelector("#toggleMyModal"));
	status.value = response.ok ? "success" : "danger";
	message.value = response.result.message;
	title.value = response.ok ? "Success" : "Error";

	visuallyHideModalBackdrop();

	// Reset form if the response is successful
	if (response.ok) {
		resetForm();
	}
};

function visuallyHideModalBackdrop() {
	const modalsBackdrops = document.querySelectorAll(".modal-backdrop");

	if (modalsBackdrops.length) {
		modalsBackdrops.forEach((modal) =>
			modal.classList.add("visually-hidden")
		);
	}
}

const resetForm = () => {
	visitor.value = "";
	purpose.value = "";
	room.value = "";
	msisdn.value = "";
	address.value = "";
	eventValue.value = "";
	belonging.value = "";
	institution.value = "";

	// Remove validation classes
	const form = document.querySelector(".needs-validation");
	form.classList.remove("was-validated");
};
</script>

<style scoped>
a {
	text-decoration: none;
}
.form-select {
	padding: calc(1rem - 1px) 1rem calc(0.5rem + 1px);
}
</style>
