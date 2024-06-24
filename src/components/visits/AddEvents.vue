<template>
	<Modal :data="{ title, message, status }" />
	<div id="visit-view" class="d-flex flex-column container">
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

				<!-- NEW VISITOR -->
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
				<div class="col-md-6">
					<label
						for="validationCustomHost"
						class="form-label is-required"
					>
						Host<span class="visually-hidden">(required)</span>
					</label>
					<div class="input-group has-validation">
						<select
							v-model="host_name"
							class="form-select"
							id="validationCustomHost"
							required
						>
							<option value="" disabled>Select a host</option>
							<option
								v-for="option in options"
								:key="option.value"
								:value="option.value"
							>
								{{ option.text }}
							</option>
						</select>
						<div class="invalid-feedback">
							Please provide a host name.
						</div>
					</div>
				</div>

				<!-- Belonging -->
				<div class="col-md-6">
					<label
						for="validationCustomBelonging"
						class="form-label is-required"
					>
						Belonging<span class="visually-hidden">(required)</span>
					</label>
					<div class="input-group has-validation">
						<input
							type="text"
							class="form-control"
							id="validationCustomBelonging"
							v-model="belonging"
							required
						/>
						<div class="invalid-feedback">
							Please provide a belonging name.
						</div>
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
							v-model="visit_address"
							required
						/>
						<div class="invalid-feedback">
							Please provide an address.
						</div>
					</div>
				</div>

				<!-- Purpose -->
				<div class="col-12">
					<label
						for="validationCustomPurpose"
						class="form-label is-required"
					>
						Purpose<span class="visually-hidden">(required)</span>
					</label>
					<div class="input-group has-validation">
						<textarea
							class="form-control"
							id="validationCustomPurpose"
							required
							v-model="purpose"
						></textarea>
						<div class="invalid-feedback">
							Please provide a purpose.
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
	getUsers,
} from "@/assets/js/index.js";

const msisdn = ref("");
const visitor = ref("");
const visitorId = ref("");
const host_name = ref("");
const belonging = ref("");
const options = ref([]);
const host_id = ref("");
const institution = ref("");
const room = ref("");
const visit_address = ref("");
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
	getUserOptions();
});

// function for inserting each username in the select element
const getUserOptions = async () => {
	try {
		const users = await getUsers();
		options.value = users.map((user) => ({
			value: user.id,
			text: user.username,
		}));
		// console.log(options.value);
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
watch(host_name, (newValue) => {
	const selectedUser = options.value.find(
		(option) => option.value === newValue
	);
	if (selectedUser) {
		console.log(`Selected username: ${selectedUser.text}`);
		host_id.value = selectedUser.value;
		// console.log(host_id.value);
	}
});

const room_id = "01d95aba-31c4-48d3-8b03-2587d8bb5730";

// function to validate form before it submit the form
const onSubmit = async () => {
	if (
		!msisdn.value ||
		!visitor.value ||
		!host_name.value ||
		!belonging.value ||
		!room.value ||
		!visit_address.value ||
		!purpose.value
	) {
		return;
	}

	// plitting text into array by using command as the deleminator
	const formatedItems = belonging.value.split(",").map((item) => item.trim());

	// require values for the submittion of the form
	const visitData = {
		visitor_id: visitorId.value,
		institution: institution.value,
		address: visit_address.value,
		items: formatedItems,
		room_id: room_id,
		host_id: host_id.value,
		purpose: purpose.value,
	};
	// console.log(visitData);
	const response = await registerVisit(visitData);

	// console.log(response);

	const myModal = new boosted.Modal("#exampleModal", { backdrop: true });
	if (!response.ok) {
		myModal.show(document.querySelector("#toggleMyModal"));
		status.value = "danger";
		message.value = response.result.message;
		title.value = "Error";
	} else {
		myModal.show(document.querySelector("#toggleMyModal"));
		status.value = "success";
		message.value = response.result.message;
		title.value = "Success";
	}

	visuallyHideModalBackdrop();
};

function visuallyHideModalBackdrop() {
	const modalsBackdrops = document.querySelectorAll(".modal-backdrop");

	if (modalsBackdrops.length) {
		modalsBackdrops.forEach((modal) =>
			modal.classList.add("visually-hidden")
		);
	}
}
</script>

<style scoped>
.input {
	border: 0.0125rem solid #ccc;
	border-radius: 0.25rem !important;
}
</style>
