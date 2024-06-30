<template>
	<Modal :data="{ title, message, status }" />

	<!-- BELONGING MODAL -->
	<div
		class="modal fade"
		id="visitModal"
		tabindex="-1"
		aria-hidden="true"
		aria-labelledby="visitModalLabel"
		style="z-index: 2000"
	>
		<div
			class="modal-dialog modal-lg modal-dialog-centered"
			id="modal-dialog"
		>
			<div class="modal-content">
				<div class="modal-header">
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						data-bs-toggle="tooltip"
						data-bs-placement="bottom"
						data-bs-title="Close"
					>
						<span class="visually-hidden">Close</span>
					</button>
				</div>
				<div class="modal-body">
					<form class="row g-3" @submit.prevent="onSubmit">
						<div class="">
							<label for="belongings" class="form-label"
								>Belongings</label
							>
							<div class="input-group has-validation">
								<input
									type="text"
									class="form-control"
									id="belongings"
									aria-describedby="inputGroupPrepend"
									v-model="temBelonging"
									@keyup.prevent="addBelongings"
								/>
							</div>
							<div
								v-for="belonging in belongings"
								:key="belonging"
								@click="deleteBelongings(belonging)"
								class="belonging"
							>
								{{ belonging }}
							</div>
						</div>
						<div class="">
							<label for="institution" class="form-label"
								>Institution</label
							>
							<div class="input-group">
								<input
									type="text"
									class="form-control"
									id="institution"
									aria-describedby="inputGroupPrepend"
									v-model="institution"
								/>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button
						type="submit"
						@click="onSubmit"
						class="btn btn-primary"
					>
						Check In
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- EVENT LIST -->
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
							@click="participantDetail(participant.id)"
							data-bs-target="#visitModal"
							data-bs-toggle="modal"
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
				<Pagination v-model="start" />
			</div>
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
	registerVisitor,
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
const belongings = ref([]);
const temBelonging = ref("");
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

// function to validate form before it submit the form
const onSubmit = async (event) => {
	console.group();
	console.log("msisdn:", msisdn.value);
	console.log("visitor", visitor.value);
	console.log("purpose:", purpose.value);
	console.log("room:", room.value);
	console.log("address:", address.value);
	console.groupEnd();

	if (
		!msisdn.value ||
		!visitor.value ||
		!purpose.value ||
		!room.value ||
		!address.value ||
		event.type === "submit"
	) {
		return;
	}

	// require values for the submittion of the form
	const visitData = {
		visitor_id: visitorId.value,
		institution: institution.value,
		address: address.value,
		items: belongings.value,
		room_id: room_id.value,
		host_id: host_id.value,
		purpose: purpose.value,
	};

	console.log(visitData);

	const response = await registerVisit(visitData);

	const myModal = new boosted.Modal("#exampleModal");
	myModal.show(document.querySelector("#toggleMyModal"));
	status.value = response.ok ? "success" : "danger";
	message.value = response.result.message;
	title.value = response.ok ? "Success" : "Error";

	// Reset form if the response is successful
	if (response.ok) {
		const visitModal = document.querySelector("#visitModal");
		console.log(visitModal);
		visitModal.classList.remove("show");
		visitModal.style.display = "none";
		visitModal.ariaHidden = true;
		visitModal.removeAttribute("aria-modal");
		visitModal.removeAttribute("role");
		resetForm();
	}
};

const resetForm = () => {
	visitor.value = "";
	msisdn.value = "";
	address.value = "";
	eventValue.value = "";
	belongings.value = [];
	temBelonging.value = "";
	institution.value = "";
};

const addBelongings = (event) => {
	const { key } = event;

	if (key === "Enter" && temBelonging.value) {
		if (!belongings.value.includes(temBelonging.value)) {
			belongings.value.push(temBelonging.value);
		}
		temBelonging.value = "";
	}
};

const deleteBelongings = (item) => {
	belongings.value = belongings.value.filter((val) => val !== item);
};

const participantDetail = async (id) => {
	const event = events.value.find((val) => val.id === eventID.value);

	const participant = participants.value.find((val) => val.id === id);
	let visitorData = await getSingleVisitor({ msisdn: participant.msisdn });

	if (!visitorData) {
		const data = await registerVisitor({
			first_name: participant.first_name,
			middle_name: participant.middle_name,
			last_name: participant.last_name,
			email: participant.email,
			msisdn: participant.msisdn,
			address: participant.address,
		});
		visitorData = data.result.data[0];
	}

	visitorId.value = visitorData.id;
	visitor.value = `${visitorData.first_name} ${visitorData.last_name}`;
	msisdn.value = visitorData.msisdn;
	room_id.value = event.room_id;
	host_id.value = event.host_id;
	address.value = participant.address;
};
</script>

<style scoped>
.belonging {
	text-transform: capitalize;
	display: inline-block;
	margin: 20px 10px 0 0;
	padding: 6px 12px;
	background-color: #eee;
	border-radius: 20px;
	font-size: 12px;
	letter-spacing: 1px;
	font-weight: bold;
	color: #777;
	cursor: pointer;
}
a {
	text-decoration: none;
}
.form-select {
	padding: calc(1rem - 1px) 1rem calc(0.5rem + 1px);
}

.modal {
	background-color: #1616157a;
}

.modal-content {
	/* border: none !important; */
	/* z-index: 2000; */
}
</style>
