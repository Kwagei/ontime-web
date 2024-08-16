<template>
	<Modal :data="{ title, message, status }" />
	{{ (purpose, address, host, items, institution, visitor) }}
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
					<ul class="dropdown-menu" style="width: 97%">
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
								<li
									class="dropdown-item"
									v-if="!hosts[index + 1]"
								>
									create new host
								</li>
							</router-link>
						</template>
					</ul>

					<Alert :title="typeError" />
				</div>

				<!-- Room -->
				<!-- <div class="col-md-6">
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
				</div> -->

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

				<!-- Purpose -->
				<div class="col-md-6">
					<label
						for="validationCustomPurpose"
						class="form-label is-required"
					>
						Purpose
						<span class="visually-hidden">(required)</span>
					</label>
					<div class="input-group has-validation">
						<input
							type="text"
							class="form-control"
							id="validationCustomPurpose"
							v-model="purpose"
							required
						/>
						<div class="invalid-feedback">
							Please provide an address.
						</div>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="col-12 d-flex gap-2">
					<button
						class="btn btn-primary px-5"
						style="margin-left: auto"
						type="submit"
					>
						Save
					</button>
					<button
						class="btn btn-secondary px-5"
						@click="router.back()"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import Modal from "../modals/AlertModal.vue";
import {
	registerVisit,
	getSingleVisitor,
	getEvents,
	getHosts,
} from "@/assets/js/index.js";
import { useRouter } from "vue-router";
import { addClass, getElement, removeClass } from "@/assets/js/util";

const events = ref(null);
const options = ref([]);

// Form Data
const hosts = ref("");
const hostValue = ref("");
const hostID = ref("");
const host_id = ref("");
const room_id = ref("");
const room = ref("");
const institution = ref("");
const address = ref("");
const purpose = ref("");
const belonging = ref("");
const msisdn = ref("");
const visitor = ref("");
const visitorId = ref("");

// Modal Data
const status = ref("");
const message = ref("");
const title = ref("");

const activeBreadCrumbs = ref([]);

const router = useRouter();

const props = defineProps({
	breadCrumbs: {
		type: Array,
		required: true,
	},
});

activeBreadCrumbs.value = [...props.breadCrumbs, "visit-checkin"];

onMounted(async () => {
	(() => {
		"use strict";

		const form = getElement(".needs-validation");

		form.addEventListener(
			"submit",
			(event) => {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				}

				addClass(form, "was-validated");
			},
			false
		);
	})();

	hosts.value = await getHosts();
});
const updateHostTerm = (host) => {
	hostValue.value = host.name;
	hostID.value = host.id;
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
	myModal.show(getElement("#toggleMyModal"));
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
	const modalsBackdrops = getElementAll(".modal-backdrop");

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
	hostValue.value = "";
	belonging.value = "";
	institution.value = "";

	// Remove validation classes
	const form = getElement(".needs-validation");
	removeClass(form, "was-validated");
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
