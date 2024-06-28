<template>
	<Modal
		:data="{
			title: successModalData.title,
			message: successModalData.message,
			status: successModalData.status,
			pageLink: successModalData.pageLink,
		}"
	/>
	<div id="eventsWrapper" class="d-flex flex-column container">
		<div class="d-flex justify-content-between">
			<div>
				<BreadCrumbs v-model:breadCrumbs="activeBreadCrumbs" />
			</div>
			<div>
				<button
					@click="mode == 'add' ? postEvent() : putEvent()"
					class="border-primary btn btn-primary px-5 py-2"
					type="submit"
				>
					Submit
				</button>
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

		<form
			@submit.prevent="mode == 'add' ? postEvent() : putEvent()"
			id="eventsFormWrapper"
			novalidate
			class="my-4 p-5 needs-validation"
		>
			<div>
				<label for="titleInput" class="form-label is-required">
					Title
					<span class="visually-hidden">(required)</span>
				</label>
				<input
					type="text"
					class="form-control"
					:class="{
						border: titleError,
						'border-danger': titleError,
					}"
					id="titleInput"
					placeholder="Title"
					v-model="title"
					required
				/>

				<Alert :title="titleError" />
			</div>

			<!-- Facilitator -->
			<div>
				<label for="facilitatorInput" class="form-label is-required">
					Facilitator
					<span class="visually-hidden">(required)</span>
				</label>
				<input
					type="text"
					class="form-control"
					id="facilitatorInput"
					:class="{
						border: facilitatorError,
						'border-danger': facilitatorError,
					}"
					placeholder="Facilitator"
					v-model="facilitator"
					required
				/>

				<Alert :title="facilitatorError" />
			</div>

			<!-- Start Date -->
			<div>
				<label for="startDateInput" class="form-label is-required">
					Start Date
					<span class="visually-hidden">(required)</span>
				</label>
				<input
					type="date"
					class="form-control"
					id="startDateInput"
					:class="{
						border: startDateError,
						'border-danger': startDateError,
					}"
					placeholder="Start Date"
					v-model="startDate"
					required
				/>

				<Alert :title="startDateError" />
			</div>

			<!-- Host -->
			<div class="dropdown">
				<label for="typeInput" class="form-label is-required">
					Host
					<span class="visually-hidden">(required)</span>
				</label>
				<input
					type="text"
					class="form-control"
					id="facilitatorInput"
					:class="{
						border: facilitatorError,
						'border-danger': facilitatorError,
					}"
					:id="hostID"
					:value="hostValue"
					aria-expanded="false"
					data-bs-toggle="dropdown"
					autocomplete="off"
					required
				/>
				<ul class="dropdown-menu w-100">
					<template v-for="(host, index) in hosts">
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

				<Alert :title="hostError" />
			</div>

			<!-- End Date -->
			<div>
				<label for="endDateInput" class="form-label is-required">
					End Date
					<span class="visually-hidden">(required)</span>
				</label>
				<input
					type="date"
					class="form-control"
					id="endDateInput"
					:class="{
						border: endDateError,
						'border-danger': endDateError,
					}"
					placeholder="End Date"
					v-model="endDate"
					required
				/>

				<Alert :title="endDateError" />
			</div>

			<!-- Room -->
			<div>
				<label for="typeInput" class="form-label is-required">
					Room
					<span class="visually-hidden">(required)</span>
				</label>
				<select
					class="form-select"
					v-model="room"
					:class="{
						border: typeError,
						'border-danger': typeError,
					}"
					aria-label="Select Event Type"
					required
				>
					<option value="FabLab">FabLab</option>
					<option value="Super Coders">Super Coders</option>
					<option value="Conference Hall">Conference Hall</option>
				</select>

				<Alert :title="typeError" />
			</div>

			<!-- Type -->
			<div>
				<label for="typeInput" class="form-label is-required">
					Type
					<span class="visually-hidden">(required)</span>
				</label>
				<select
					class="form-select"
					v-model="type"
					:class="{
						border: typeError,
						'border-danger': typeError,
					}"
					aria-label="Select Event Type"
					required
				>
					<option value="Course">Course</option>
					<option value="Conference">Conference</option>
					<option value="Hackathon">Hackathon</option>
					<option value="Workshop">Workshop</option>
					<option value="Excursion">Excursion</option>
				</select>

				<Alert :title="typeError" />
			</div>

			<!-- Details -->
			<div>
				<label for="detailsTextarea" class="form-label">Details</label>
				<textarea
					placeholder="Enter details..."
					class="form-control"
					id="detailsTextarea"
					:class="{
						border: detailsError,
						'border-danger': detailsError,
					}"
					v-model="details"
					rows="4"
				></textarea>

				<Alert :title="detailsError" />
			</div>
			<button type="submit" class="btn btn-primary visually-hidden">
				Submit
			</button>
		</form>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import $ from "jquery";

import {
	visuallyHideModalBackdrop,
	API_URL,
	getHosts,
} from "../../assets/js/index.js";

import BreadCrumbs from "../BreadCrumbs.vue";
import Modal from "../Modal.vue";
import Alert from "../Alert.vue";
import { useRouter } from "vue-router";

// Event Creation Data
const title = ref("");
const facilitator = ref("");
const startDate = ref("");
const endDate = ref("");
const hostValue = ref("");
const hostID = ref("");
const hosts = ref("");
const room = ref("");
const type = ref("");
const details = ref("");

// Modal Data
const successModalData = ref({
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

async function postEvent() {
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

	try {
		await $.post(API_URL + "events/", body, (data) => {
			const modal = new boosted.Modal("#exampleModal");
			modal.show($("#toggleMyModal")[0]);

			// set modal data
			successModalData.value.message = data.message;
			successModalData.value.status = "success";
			successModalData.value.title = "Event Created";
			successModalData.value.pageLink = `/events/${data.data.id}`;

			visuallyHideModalBackdrop();
		});

		clearInputs();
		clearErrors();
	} catch (error) {
		console.log("Error creating event: ", error.responseJSON);
		clearErrors();
		displayErrorMessage(error.responseJSON.message);
	}
}

async function putEvent() {
	const body = {
		title: title.value,
		facilitator: facilitator.value,
		start_date: startDate.value,
		end_date: endDate.value,
		type: type.value,
		details: details.value,
	};

	// PUT request to Edit the Event with the given
	// data from the form

	$.ajax({
		url: API_URL + `events/${eventId.value}`,
		type: "PUT",
		data: body,
		success: () => {
			clearInputs();
			clearErrors();

			// redirect the user to the edited event page
			// so they can see the updates
			router.push({
				name: "specific-event",
				params: { id: eventId.value },
			});
		},
		error: (err) => {
			clearErrors();
			displayErrorMessage(err.responseJSON.message);
		},
	});
}

function displayErrorMessage(msg) {
	const tmpMsg = msg.toLowerCase();

	if (tmpMsg.includes("title")) titleError.value = msg;
	else if (tmpMsg.includes("facilitator")) facilitatorError.value = msg;
	else if (tmpMsg.includes("start date")) startDateError.value = msg;
	else if (tmpMsg.includes("end date")) endDateError.value = msg;
	else if (tmpMsg.includes("type")) typeError.value = msg;
	else if (tmpMsg.includes("host")) hostError.value = msg;
	else if (tmpMsg.includes("details")) detailsError.value = msg;
}

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

onMounted(async () => {
	// get event to edit if we're trying to edit
	if (mode == "edit") await getEventToEdit();

	("use strict");

	$(".needs-validation").on(
		"submit",
		(event) => {
			if (!form[0].checkValidity()) {
				event.preventDefault();
				event.stopPropagation();
			}

			this.addClass("was-validated");
		},
		false
	);

	hosts.value = await getHosts();
	console.log(hosts.value);
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

#eventsFormWrapper {
	outline: 1px solid #aaa;
	border-radius: 5px;
	display: grid;
	grid-template-columns: repeat(2, 0.5fr);
	gap: 30px;
	background-color: #fff;
}
</style>
