<template>
	<div id="visitor-view" class="d-flex flex-column container">
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
			<!-- Button trigger modal -->
			<button
				type="button"
				class="btn btn-primary"
				data-bs-toggle="modal"
				data-bs-target="#exampleModal"
			>
				Launch demo modal
			</button>

			<!-- Modal -->
			<div
				class="modal fade"
				id="exampleModal"
				tabindex="-1"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title h5" id="exampleModalLabel">
								Modal title
							</h1>
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
						<div class="modal-body">...</div>
						<div class="modal-footer">
							<button
								type="button"
								class="btn btn-outline-secondary"
								data-bs-dismiss="modal"
							>
								Close
							</button>
							<button type="button" class="btn btn-primary">
								Save changes
							</button>
						</div>
					</div>
				</div>
			</div>

			<form
				class="row g-3 needs-validation"
				novalidate
				@submit.prevent="onSubmit"
			>
				<!-- NEW VISITOR -->
				<div class="col-md-6">
					<label
						for="validationCustom01"
						class="form-label is-required"
						>Visitor<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<input
							type="text"
							class="form-control"
							id="validationCustomNewVisitor"
							aria-describedby="inputGroupPrepend"
							v-model="new_visitor"
							required
						/>
						<div class="invalid-feedback">
							Please provide a visitor name.
						</div>
					</div>
				</div>

				<!-- Arrival Time -->
				<div class="col-md-6">
					<label for="validationCustomUsername" class="form-label"
						>Arrival Time</label
					>
					<input
						type="time"
						class="form-control"
						id="validationCustomVisitorArrivalTime"
						v-model="arrival_time"
						aria-describedby="inputGroupPrepend"
						disabled
					/>
				</div>

				<!-- PHONE NUMBER -->
				<div class="col-md-6">
					<label
						for="validationCustom02"
						class="form-label is-required"
						>Phone number<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<input
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
				<!-- Departural Time -->
				<div class="col-md-6">
					<label for="validationCustom03" class="form-label"
						>Departural Time</label
					>
					<input
						type="time"
						class="form-control"
						id="validationCustomUsername"
						v-model="email"
						aria-describedby="inputGroupPrepend"
						disabled
					/>
				</div>

				<!-- Host -->
				<div class="col-md-6">
					<label
						for="validationCustom02"
						class="form-label is-required"
						>Host<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<input
							type="text"
							class="form-control"
							id="validationCustom02"
							v-model="host_name"
							required
						/>
						<div class="invalid-feedback">
							Please provide a host name.
						</div>
					</div>
				</div>

				<!-- Current Date -->
				<div class="col-md-6 has-validation">
					<label for="validationCustomCurrentDate" class="form-label"
						>Date</label
					>
					<input
						type="Date"
						class="form-control"
						id="validationCustomVisitorArrivalTime"
						v-model="date"
						aria-describedby="inputGroupPrepend"
						required
					/>
					<div class="invalid-feedback">
						Please provide the current date.
					</div>
				</div>

				<!-- Purpose -->
				<div class="col-12">
					<label
						for="validationCustom02"
						class="form-label is-required"
						>Purpose<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<textarea
							class="form-control"
							id="validationCustom02"
							required
							v-model="purpose"
						></textarea>
						<div class="invalid-feedback">
							Please provide an purpose.
						</div>
					</div>
				</div>
				<div class="col-12">
					<button class="btn btn-primary mt-2" type="submit">
						Save
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<style scoped>
.input {
	border: 0.0125rem solid #ccc;
	border-radius: 0.25rem !important;
}
</style>

<script setup>
import BreadCrumbs from "../BreadCrumbs.vue";
import ModalTemplate from "../ModalTemplate.vue";
import { registerVisitor } from "@/assets/js/index.js";

import { ref, defineProps, onMounted } from "vue";

const new_visitor = ref("");
const arrival_time = ref("");
const host_name = ref("");
const msisdn = ref("");
const email = ref("");
const purpose = ref("");
const belonging = ref("");

const emit = defineEmits(["visitorFormSubmitted"]);

const onSubmit = async () => {
	if (
		!new_visitor.value ||
		!host_name.value ||
		!msisdn.value ||
		!purpose.value
	) {
		return;
	}

	const visitor = {
		new_visitor: new_visitor.value,
		arrival_time: arrival_time.value,
		host_name: host_name.value,
		msisdn: msisdn.value,
		email: email.value,
		purpose: purpose.value,
	};

	const response = await registerVisitor(visitor);

	if (!response.ok) {
		console.log("");
		onMounted(() => {
			document.querySelector("#exampleModal").classList.toggle("show");
		});
	}
	console.log({ response });

	emit("visitorFormSubmitted", visitor);
};

const activeBreadCrumbs = ref([]);

const props = defineProps({
	breadCrumbs: {
		type: Array,
		required: true,
	},
});

activeBreadCrumbs.value = [...props.breadCrumbs, "new-visit"];

const formValidation = onMounted(() => {
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
#list-options {
	padding: 0.6rem 0.5rem;
	font-weight: 400;
	border: 0.0125rem solid #ccc;
	border-radius: 0.25rem !important;
}
svg {
	height: 20px !important;
	margin: 0 !important;
}

#new-visitor:hover {
	color: white !important;
}

#visitor-view {
	padding-top: 2rem;
	gap: 1.5rem;
}

@media (min-width: 768px) and (max-width: 1440px) {
	#visitor-view {
		padding: 1rem 3rem 0 3rem;
	}
}
</style>
