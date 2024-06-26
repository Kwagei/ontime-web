<template>
	<Modal
		:data="{
			title: alert.title,
			message: alert.message,
			status: alert.status,
			pageLink: alert.pageLink,
		}"
	/>
	<div id="eventsWrapper" class="d-flex flex-column container">
		<div class="d-flex justify-content-between">
			<div>
				<BreadCrumbs v-model:breadCrumbs="activeBreadCrumbs" />
			</div>
		</div>

		<h3
			v-if="errorGettingEventToEdit"
			class="text-center mt-3 d-flex align-items-center flex-column text-danger"
			style="margin-bottom: -21px"
		>
			Error getting event to edit, please try again!
			<hr class="text-center w-75" />
		</h3>

		<div
			class="mt-4 form-control input"
			style="margin: auto; padding: 3rem"
		>
			<form
				class="row g-3 needs-validation"
				novalidate
				@submit.prevent="onSubmit"
			>
				<!-- TITLE -->
				<div class="col-md-6">
					<label for="title" class="form-label is-required"
						>Title<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<input
							type="text"
							class="form-control"
							id="title"
							aria-describedby="inputGroupPrepend"
							v-model="title"
							required
						/>

						<div class="invalid-feedback">
							Please provide a title.
						</div>
					</div>
				</div>

				<!-- FACILITATOR -->
				<div class="col-md-6">
					<label for="facilitator" class="form-label is-required"
						>Facilitator<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<input
							type="text"
							class="form-control"
							id="facilitator"
							aria-describedby="inputGroupPrepend"
							v-model="facilitator"
							required
						/>

						<div class="invalid-feedback">
							Please provide a facilitator.
						</div>
					</div>
				</div>

				<!-- START DATE -->
				<div class="col-md-6">
					<label for="startDate" class="form-label is-required"
						>Start Date<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<input
							type="date"
							class="form-control"
							id="startDate"
							aria-describedby="inputGroupPrepend"
							v-model="startDate"
							required
						/>

						<div class="invalid-feedback">
							Please provide a start date.
						</div>
					</div>
				</div>

				<!-- HOST -->
				<div class="dropdown col-md-6">
					<label for="first_name" class="form-label is-required"
						>Host<span class="visually-hidden">
							(required)</span
						></label
					>

					<div class="input-group has-validation">
						<input
							type="text"
							class="form-control"
							id="facilitatorInput"
							:id="hostID"
							:value="hostValue"
							aria-expanded="false"
							data-bs-toggle="dropdown"
							autocomplete="off"
							required
						/>
						<ul class="dropdown-menu w-100">
							<template v-for="host in hosts">
								<li
									class="dropdown-item"
									:value="host.id"
									@click="updateHostTerm(host)"
								>
									{{ host.name }}
								</li>
							</template>
							<router-link
								:to="{ name: 'new-host' }"
								class="text-primary"
							>
								<li class="dropdown-item">create new host</li>
							</router-link>
						</ul>

						<div class="invalid-feedback">
							Please provide a host.
						</div>
					</div>
				</div>

				<!-- END DATE -->
				<div class="col-md-6">
					<label for="endDate" class="form-label is-required"
						>End Date<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<input
							type="date"
							class="form-control"
							id="endDate"
							aria-describedby="inputGroupPrepend"
							v-model="endDate"
							required
						/>

						<div class="invalid-feedback">
							Please provide an end date.
						</div>
					</div>
				</div>

				<!-- ROOM -->
				<div class="col-md-6">
					<label for="room" class="form-label is-required"
						>Room<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<select
							class="form-select"
							v-model="room"
							aria-label="Select Event Type"
							required
						>
							<option value="FabLab">FabLab</option>
							<option value="Super Coders">Super Coders</option>
							<option value="Conference Hall">
								Conference Hall
							</option>
						</select>

						<div class="invalid-feedback">
							Please select a room.
						</div>
					</div>
				</div>

				<!-- TYPE -->
				<div class="col-md-6">
					<label for="type" class="form-label is-required"
						>Type<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<select
							class="form-select"
							v-model="type"
							aria-label="Select Event Type"
							required
						>
							<option value="Course">Course</option>
							<option value="Conference">Conference</option>
							<option value="Workshop">Workshop</option>
							<option value="Hackathon">Hackathon</option>
						</select>

						<div class="invalid-feedback">
							Please select a type.
						</div>
					</div>
				</div>

				<!-- DETAILS -->
				<div class="">
					<label for="detail" class="form-label">Details</label>
					<div class="input-group">
						<textarea
							placeholder="Enter details..."
							class="form-control"
							id="detailsTextarea"
							v-model="details"
							rows="2"
						></textarea>

						<div class="invalid-feedback">
							Please enter event details.
						</div>
					</div>
				</div>

				<div class="col-md-12 d-flex">
					<button
						type="submit"
						class="btn btn-primary"
						style="
							padding: 0.7rem 2rem !important;
							font-weight: 600;
							margin-left: auto;
						"
					>
						{{ buttonLabel }}
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import $ from "jquery";

import { API_URL, getHosts } from "../../assets/js/index.js";

import BreadCrumbs from "../BreadCrumbs.vue";
import Modal from "../Modal.vue";
import Alert from "../Alert.vue";
import { useRouter } from "vue-router";
import { showModal } from "@/assets/js/util.js";

// Event Creation Data
const title = ref("");
const facilitator = ref("");
const startDate = ref("");
const endDate = ref("");
const hostValue = ref("");
const hostID = ref("");
const hosts = ref("");
const room = ref("");
const roomID = ref("");
const type = ref("");
const details = ref("");
const buttonLabel = ref("Save");

// Modal Data
const alert = ref({
	title: "",
	status: "",
	message: "",
	pageLink: "",
});

// Error Alert Data
const titleError = ref("");
const facilitatorError = ref("");
const startDateError = ref("");
const endDateError = ref("");
const typeError = ref("");
const hostError = ref("");
const detailsError = ref("");

const props = defineProps({
	breadCrumbs: {
		type: Array,
		required: true,
	},
});

const router = useRouter();
const eventId = ref(router.currentRoute.value.params.id);
const mode = setMode();
const errorGettingEventToEdit = ref("");

// Set breadcrumbs for editing of adding new event
const activeBreadCrumbs = ref(
	eventId.value
		? [...props.breadCrumbs, eventId.value, "edit-event"]
		: [...props.breadCrumbs, "add-event"]
);

const updateHostTerm = (host) => {
	hostValue.value = host.name;
	hostID.value = host.id;
};

const onSubmit = async () => {
	if (
		!title.value ||
		!facilitator.value ||
		!startDate.value ||
		!endDate.value ||
		!type.value ||
		!hostValue.value ||
		!room.value
	) {
		return;
	}

	const body = {
		title: title.value,
		facilitator: facilitator.value,
		start_date: startDate.value,
		end_date: endDate.value,
		type: type.value,
		host: hostValue.value,
		room: room.value,
		details: details.value,
	};

	const api =
		setMode() === "edit"
			? { url: API_URL + `events/${eventId.value}`, type: "PUT" }
			: { url: API_URL + "events/", type: "POST" };

	$.ajax({
		url: api.url,
		type: api.type,
		data: body,
		success: (data) => {
			showModal("#alertModal", "#alertModalBody");

			alert.value.status = "success";
			alert.value.title = "Success";
			alert.value.message = data.message;
			alert.value.pageLink = `/events/${
				data.data.length ? data.data[0].id : data.data.id
			}`;

			clearInputs();
			clearErrors();
		},
		error: (error) => {
			showModal("#alertModal", "#alertModalBody");
			alert.value.status = "danger";
			alert.value.title = "Error";
			alert.value.message = error.responseJSON.message;
		},
	});
};

function clearInputs() {
	// clear inputs
	title.value = "";
	facilitator.value = "";
	startDate.value = "";
	endDate.value = "";
	type.value = "";
	hosts.value = "";
	room.value = "";
	details.value = "";

	document
		.querySelector(".needs-validation")
		.classList.remove("was-validated");
}

function clearErrors() {
	// clear errors
	titleError.value = "";
	facilitatorError.value = "";
	startDateError.value = "";
	endDateError.value = "";
	typeError.value = "";
	detailsError.value = "";
}

// Lifecycle Hooks
onMounted(async () => {
	// get event to edit if we're trying to edit
	if (mode == "edit") await getEventToEdit();

	("use strict");

	const form = document.querySelector(".needs-validation");
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
	hosts.value = await getHosts();
});

function setMode() {
	return eventId.value ? "edit" : "add";
}

async function getEventToEdit() {
	try {
		$.get(API_URL + `events/${eventId.value}/`, (data) => {
			const retrievedEvent = data.data[0];

			title.value = retrievedEvent.title;
			type.value = retrievedEvent.type;
			facilitator.value = retrievedEvent.facilitator;
			details.value = retrievedEvent.details;
			hostValue.value = retrievedEvent.host;
			hostID.value = retrievedEvent.host_id;
			room.value = retrievedEvent.room;
			roomID.value = retrievedEvent.room_id;

			// format date before setting it as the value
			// start date input field in the form
			startDate.value = new Date(retrievedEvent.start_date)
				.toISOString()
				.split("T")[0];

			// format date before setting it as the value
			// end date input field in the form
			endDate.value = new Date(retrievedEvent.end_date)
				.toISOString()
				.split("T")[0];

			errorGettingEventToEdit.value = false;
		}).fail((error) => {
			console.log("Error getting event to edit: ", error.responseJSON);
			errorGettingEventToEdit.value = true;
		});
	} catch (error) {
		console.log("Error getting event to edit: ", error.responseJSON);
		errorGettingEventToEdit.value = true;
	}
}
</script>

<style scoped>
.form-select {
	padding: calc(1rem - 1px) 1rem calc(0.5rem + 1px);
}

.dropdown-item {
	cursor: pointer;
}

a {
	text-decoration: none;
}

a:hover {
	color: #ff7900 !important;
}

#eventsWrapper {
	padding-top: 2rem;
	gap: 1.5rem;
}

/* #eventsFormWrapper {
	outline: 1px solid #aaa;
	border-radius: 5px;
	display: grid;
	grid-template-columns: repeat(2, 0.5fr);
	gap: 30px;
	background-color: #fff;
} */
</style>
