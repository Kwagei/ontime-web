<template>
	<Modal
		:data="{
			title: alert.title,
			message: alert.message,
			status: alert.status,
		}"
	/>
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
			<form
				class="row g-3 needs-validation"
				novalidate
				@submit.prevent="onSubmit"
			>
				<!-- NAME -->
				<div class="col-md-6">
					<label for="name" class="form-label is-required"
						>Name<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<input
							type="text"
							class="form-control"
							id="name"
							aria-describedby="inputGroupPrepend"
							v-model="name"
							required
						/>
						<div class="invalid-feedback">
							Please provide a host name.
						</div>
					</div>
				</div>

				<!-- HOST TYPE -->
				<div class="col-md-6">
					<label for="host_type" class="form-label is-required"
						>Host Type<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="form-check">
						<input
							class="form-check-input"
							type="radio"
							name="flexRadioDefault"
							id="flexRadioDefault2"
							value="c"
							@click="updateHostType('Company')"
							checked
						/>
						<label class="form-check-label" for="flexRadioDefault2">
							Company
						</label>
					</div>
					<div class="form-check">
						<input
							class="form-check-input"
							type="radio"
							name="flexRadioDefault"
							id="flexRadioDefault1"
							@click="updateHostType('Individual')"
						/>
						<label class="form-check-label" for="flexRadioDefault1">
							Individual
						</label>
					</div>
				</div>

				<!-- PHONE NUMBER -->
				<div class="col-md-6">
					<label for="phone_number" class="form-label is-required"
						>Phone number<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<input
							type="tel"
							:class="[
								validMsisdn && 'validated',
								'form-control',
							]"
							v-model="msisdn"
							id="phone_number"
							aria-describedby="inputGroupPrepend"
							required
							autocomplete="off"
						/>
						<div
							:class="[
								'invalid-feedback',
								validMsisdn && 'show-feedback',
							]"
						>
							{{ validMsisdnMessage }}
						</div>
					</div>
					<div id="emailHelp" class="form-text">
						Phone number should start with 0. For example:
						0778675908
					</div>
				</div>

				<!-- DETAILS -->
				<div class="col-md-6">
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

				<div class="col-md-12 d-flex justify-content-end">
					<button
						type="submit"
						class="btn btn-primary"
						style="
							padding: 0.7rem 2rem !important;
							font-weight: 600;
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
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import BreadCrumbs from "../components/BreadCrumbs.vue";
import Modal from "../components/Modal.vue";
import { registerHost, editHost, getHosts } from "@/assets/js/index.js";
import { msisdnValidation, showModal } from "@/assets/js/util.js";
// Route and State
const route = useRoute();
const name = ref("");
const msisdn = ref("");
const details = ref("");
const type = ref("Company");

const alert = ref({
	status: "",
	message: "",
	title: "",
});

const buttonLabel = ref("Save");
let hostInfo;

// Form status and breadcrumbs
const activeBreadCrumbs = ref([]);
const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);
activeBreadCrumbs.value = breadCrumbs.value;
const tem = [...breadCrumbs.value];
const formStatus = tem.pop();

// Functions
const onSubmit = async () => {
	if (!name.value || !msisdn.value) {
		return;
	}

	const host = {
		name: name.value,
		msisdn: msisdn.value.startsWith("0")
			? `231${msisdn.value.slice(1)}`
			: msisdn.value,
		details: details.value,
		type: type.value,
	};

	const response = formStatus.startsWith("new")
		? await registerHost(host)
		: await editHost(hostInfo.id, host);

	console.log(response);
	showModal("#alertModal", "#alertModalBody");

	alert.value.status = response.ok ? "success" : "danger";
	alert.value.message = response.result.message;
	alert.value.title = response.ok ? "Success" : "Error";

	// Reset form if the response is successful
	if (response.ok) {
		resetForm();
	}
};

watch(
	() => msisdn.value,
	(n) => contactValidation(n)
);

const fetchHost = async () => {
	if (formStatus.startsWith("edit")) {
		buttonLabel.value = "Update";
		const id = breadCrumbs.value[1];
		hostInfo = await getHosts({ id });

		name.value = hostInfo.name;
		msisdn.value = hostInfo.msisdn;
		details.value = hostInfo.details;
	}
};

const validMsisdn = ref(false);
const validMsisdnMessage = ref("Please provide a phone number");

const contactValidation = (number) => {
	if (!number) {
		validMsisdn.value = false;
		validMsisdnMessage.value = "Please provide a phone number";

		return;
	}

	const isValid = msisdnValidation([number]);

	if (!isValid.valid) {
		validMsisdn.value = true;
		validMsisdnMessage.value = isValid.message;
	} else {
		validMsisdn.value = false;
	}
};

const resetForm = () => {
	name.value = "";
	msisdn.value = "";
	details.value = "";
	buttonLabel.value = "Save";

	// Remove validation classes
	const form = document.querySelector(".needs-validation");
	form.classList.remove("was-validated");
};

// Lifecycle Hooks
onMounted(() => {
	fetchHost();

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
});

const updateHostType = (hostType) => {
	type.value = hostType;
};
</script>

<style scoped>
.show-feedback {
	display: flex;
}

.validated {
	border-color: var(--bs-form-invalid-border-color);
}

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

#visitor-view {
	gap: 1.5rem;
}

/* @media (min-width: 768px) and (max-width: 1440px) {
	#visitor-view {
		padding: 1rem 3rem 0 3rem;
	}
} */
</style>
