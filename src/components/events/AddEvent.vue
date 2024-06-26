<template>
	<Modal
		:data="{
			title: successModalData.title,
			message: successModalData.message,
			status: successModalData.status,
			pageLink: successModalData.pageLink,
		}"
	/>
	<div id="eventsWrapper">
		<div class="d-flex justify-content-between">
			<div>
				<BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
			</div>
			<div>
				<button
					@click="postEvent"
					class="border-primary btn btn-primary px-5 py-2"
					type="submit"
				>
					Submit
				</button>
			</div>
		</div>

		<form
			@submit.prevent="postEvent"
			id="eventsFormWrapper"
			novalidate
			class="my-4 p-5 needs-validation"
		>
			<!-- Title -->
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
						<router-link
							:to="{ name: 'new-host' }"
							class="text-primary"
						>
							<li class="dropdown-item" v-if="!hosts[index + 1]">
								create new host
							</li>
						</router-link>
					</template>
				</ul>

				<Alert :title="typeError" />
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

			<!-- Rooms -->
			<div>
				<label for="typeInput" class="form-label is-required">
					Rooms
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
import { ref, defineProps, onMounted } from "vue";
import $ from "jquery";

import {
	visuallyHideModalBackdrop,
	API_URL,
	getHosts,
} from "../../assets/js/index.js";

import BreadCrumbs from "../BreadCrumbs.vue";
import Modal from "../Modal.vue";
import Alert from "../Alert.vue";

import { RouterLink } from "vue-router";

const activeBreadCrumbs = ref([]);

// Event Creation Data
const title = ref("");
const facilitator = ref("");
const startDate = ref("");
const endDate = ref("");
const hostValue = ref("");
const hostID = ref("");
const hosts = ref("");
const type = ref("");
const room = ref("");
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
const detailsError = ref("");

const props = defineProps({
	breadCrumbs: {
		type: Array,
		required: true,
	},
});

activeBreadCrumbs.value = [...props.breadCrumbs, "add-event"];

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
		await $.post(API_URL + "/events/", body, (data) => {
			const modal = new boosted.Modal("#exampleModal");
			modal.show(document.querySelector("#toggleMyModal"));

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

function displayErrorMessage(msg) {
	const tmpMsg = msg.toLowerCase();

	if (tmpMsg.includes("title")) titleError.value = msg;
	else if (tmpMsg.includes("facilitator")) facilitatorError.value = msg;
	else if (tmpMsg.includes("start date")) startDateError.value = msg;
	else if (tmpMsg.includes("end date")) endDateError.value = msg;
	else if (tmpMsg.includes("type")) typeError.value = msg;
	else if (tmpMsg.includes("details")) detailsError.value = msg;
}

function clearInputs() {
	// clear inputs
	title.value = "";
	facilitator.value = "";
	startDate.value = "";
	endDate.value = "";
	type.value = "";
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
	(() => {
		"use strict";

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
	})();

	hosts.value = await getHosts();
});
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
	margin: 50px 125px;
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
