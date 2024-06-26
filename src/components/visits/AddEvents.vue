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
			class="mt-4 form-control input"
			style="margin: auto; padding: 3rem"
		>
			<form
				class="row g-3 needs-validation"
				novalidate
				@submit.prevent="onSubmit"
			>
				<!-- PHONE NUMBER -->
				<div class="col-md-6">
					<label
						for="validationCustomVisitorNumber"
						class="form-label is-required"
					>
						Phone number<span class="visually-hidden"
							>(required)</span
						>
					</label>
					<div class="input-group has-validation">
						<input
							@blur="getVisitor"
							type="text"
							class="form-control"
							v-model="msisdn"
							id="validationCustomVisitorNumber"
							aria-describedby="inputGroupPrepend"
							required
						/>
						<div class="invalid-feedback">
							Please provide a valid phone number.
						</div>
					</div>
				</div>

				<!-- VISITOR -->
				<div class="col-md-6">
					<label
						for="validationCustomNewVisitor"
						class="form-label is-required"
					>
						Visitor<span class="visually-hidden">(required)</span>
					</label>
					<div class="input-group has-validation">
						<input
							type="text"
							class="form-control"
							id="validationCustomNewVisitor"
							aria-describedby="inputGroupPrepend"
							v-model="visitor"
							required
						/>
						<div class="invalid-feedback">
							Please provide a visitor name.
						</div>
					</div>
				</div>

				<!-- Host -->
				<div class="dropdown col-md-6">
					<label for="typeInput" class="form-label is-required">
						Event
						<span class="visually-hidden">(required)</span>
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
						required
					/>
					<ul class="dropdown-menu" style="width: 97%">
						<template v-for="(option, index) in options">
							<li
								class="dropdown-item"
								:value="option.id"
								@click="updateHostTerm(option)"
							>
								{{ option.text }}
							</li>
							<router-link :to="{ name: 'add-event' }">
								<li
									class="dropdown-item"
									v-if="!options[index + 1]"
								>
									Create new event
								</li>
							</router-link>
						</template>
					</ul>
				</div>

				<!-- Room -->
				<div class="col-md-6">
					<label
						for="validationCustomRoom"
						class="form-label is-required"
					>
						Room<span class="visually-hidden">(required)</span>
					</label>
					<div class="input-group has-validation">
						<input
							type="text"
							class="form-control"
							id="validationCustomRoom"
							v-model="room"
							required
						/>
						<div class="invalid-feedback">
							Please provide a room name.
						</div>
					</div>
				</div>

				<!-- Belonging -->
				<div class="col-md-6">
					<label for="validationCustomBelonging" class="form-label">
						Items
					</label>
					<div class="input-group">
						<input
							type="text"
							class="form-control"
							id="validationCustomBelonging"
							v-model="belonging"
						/>
					</div>
				</div>

				<!-- Institution -->
				<div class="col-md-6">
					<label for="validationCustomInstitution" class="form-label">
						Institution<span class="visually-hidden"
							>(required)</span
						>
					</label>
					<div class="input-group has-validation">
						<input
							type="text"
							class="form-control"
							id="validationCustomInstitution"
							v-model="institution"
						/>
					</div>
				</div>

				<!-- Address -->
				<div class="col-md-6">
					<label
						for="validationCustomAddress"
						class="form-label is-required"
					>
						Address<span class="visually-hidden">(required)</span>
					</label>
					<div class="input-group has-validation">
						<input
							type="text"
							class="form-control"
							id="validationCustomAddress"
							v-model="address"
							required
						/>
						<div class="invalid-feedback">
							Please provide an address.
						</div>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="col-12">
					<button class="btn btn-primary mt-2" type="submit">
						Save
					</button>
				</div>
			</form>
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
} from "@/assets/js/index.js";

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

const updateHostTerm = (host) => {
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
watch(purpose, (title) => {
	const selectedEvent = events.value.find((event) => event.title === title);
	if (selectedEvent) {
		host_id.value = selectedEvent.host_id;
		room_id.value = selectedEvent.room_id;
		room.value = selectedEvent.room;
	}
});

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
