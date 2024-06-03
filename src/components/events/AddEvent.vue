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
<<<<<<< HEAD
import { ref, defineProps, onMounted } from "vue";
import $ from "jquery";

import { visuallyHideModalBackdrop, API_URL } from "../../assets/js/index.js";

import BreadCrumbs from "../BreadCrumbs.vue";
import Modal from "../Modal.vue";
import Alert from "../Alert.vue";
=======
import { ref, defineProps } from "vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import $ from "jquery";
>>>>>>> ff015c8 (completed creating and retrieving events from database, pulling code to use Modal for displaying messages)

const activeBreadCrumbs = ref([]);

// Event Creation Data
const title = ref("");
const facilitator = ref("");
const startDate = ref("");
const endDate = ref("");
<<<<<<< HEAD
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
const detailsError = ref("");

=======
const type = ref("Select Event Type...");
const details = ref("");

>>>>>>> ff015c8 (completed creating and retrieving events from database, pulling code to use Modal for displaying messages)
const props = defineProps({
	breadCrumbs: {
		type: Array,
		required: true,
	},
});

activeBreadCrumbs.value = [...props.breadCrumbs, "add-event"];

async function postEvent() {
	const body = {
		title: title.value,
		facilitator: facilitator.value,
		start_date: startDate.value,
		end_date: endDate.value,
		type: type.value,
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

onMounted(() => {
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
});
</script>

<style scoped>
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
