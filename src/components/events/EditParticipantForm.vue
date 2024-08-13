<template>
	<!-- BELONGING MODAL -->
	<div
		class="modal fade"
		id="editParticipantModal"
		tabindex="-1"
		aria-hidden="true"
		aria-labelledby="editParticipantModalLabel"
	>
		<div
			class="modal-dialog modal-lg modal-dialog-centered"
			id="editParticipantModalBody"
		>
			<div class="modal-content py-4 px-3 rounded">
				<div class="modal-header">
					<h4>Edit Participant {{ participantIndex }}</h4>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						data-bs-placement="bottom"
						data-bs-title="Close"
					>
						<span class="visually-hidden">Close</span>
					</button>
				</div>
				<div class="modal-body input">
					<form
						class="row g-3 needs-validation"
						novalidate
						@submit.prevent="update"
					>
						<!-- FIRST NAME -->
						<div class="col-md-6">
							<label
								for="first_name"
								class="form-label is-required"
								>First name<span class="visually-hidden">
									(required)</span
								></label
							>
							<div class="input-group has-validation">
								<input
									type="text"
									class="form-control"
									id="first_name"
									aria-describedby="inputGroupPrepend"
									v-model="first_name"
									required
								/>
								<div class="invalid-feedback">
									Please provide a first name.
								</div>
							</div>
						</div>

						<!-- PHONE NUMBER -->
						<div class="col-md-6">
							<label
								for="phone_number"
								class="form-label is-required"
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

						<!-- MIDDLE NAME -->
						<div class="col-md-6">
							<label for="middle_name" class="form-label"
								>Middle name</label
							>
							<input
								type="text"
								class="form-control"
								id="middle_name"
								v-model="middle_name"
								aria-describedby="inputGroupPrepend"
							/>
						</div>

						<!-- EMAIL -->
						<div class="col-md-6">
							<label for="email" class="form-label">Email</label>
							<div class="input-group">
								<input
									type="email"
									v-model="email"
									:class="[
										validEmail && 'validated',
										'form-control',
									]"
									id="email"
									aria-describedby="inputGroupPrepend"
									autocomplete="off"
								/>
								<div
									:class="[
										'invalid-feedback',
										validEmail && 'show-feedback',
									]"
								>
									{{ validEmailMessage }}
								</div>
							</div>
							<div id="emailHelp" class="form-text">
								Enter a valid email address. For example:
								john12@gmail.com
							</div>
						</div>

						<!-- LAST NAME -->
						<div class="col-md-6">
							<label
								for="last_name"
								class="form-label is-required"
								>Last name<span class="visually-hidden">
									(required)</span
								></label
							>
							<div class="input-group has-validation">
								<input
									type="text"
									class="form-control"
									id="last_name"
									v-model="last_name"
									required
								/>
								<div class="invalid-feedback">
									Please provide a last name.
								</div>
							</div>
						</div>

						<!-- ADDRESS -->
						<div class="col-md-6">
							<label for="address" class="form-label is-required"
								>Address<span class="visually-hidden">
									(required)</span
								></label
							>
							<div class="input-group has-validation">
								<input
									type="text"
									class="form-control"
									id="address"
									v-model="address"
									required
								/>
								<div class="invalid-feedback">
									Please provide an address.
								</div>
							</div>
							<div id="emailHelp" class="form-text">
								Enter descriptive address. For example: Congo
								Town, Adjacent Satcom, Monrovia, Liberia
							</div>
						</div>

						<div class="col-md-12 d-flex gap-2 justify-content-end">
							<button
								@click="update"
								type="submit"
								class="btn btn-primary"
							>
								Update
							</button>

							<button
								type="button"
								class="btn btn-outline-secondary"
								data-bs-dismiss="modal"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { emailValidation, msisdnValidation } from "@/assets/js/util";

const props = defineProps({
	data: {
		type: Object,
		required: true,
	},
});

// Participant data
const first_name = ref("");
const middle_name = ref("");
const last_name = ref("");
const msisdn = ref("");
const email = ref("");
const address = ref("");

const emit = defineEmits(["updated", "cancel"]);

const participantIndex = defineModel("participantIndex");

function update() {
	if (
		!first_name.value ||
		!last_name.value ||
		!msisdn.value ||
		!address.value
	) {
		return;
	}

	const editParticipantModal = document.querySelector(
		"#editParticipantModal"
	);
	editParticipantModal.classList.remove("show");
	editParticipantModal.style.display = "none";

	emit("updated", {
		first_name: first_name.value,
		middle_name: middle_name.value,
		last_name: last_name.value,
		address: address.value,
		email: email.value,
		msisdn: msisdn.value,
	});
}

watch(
	() => props.data,
	(n) => {
		first_name.value = n.participant?.first_name;
		middle_name.value = n.participant?.middle_name;
		last_name.value = n.participant?.last_name;
		msisdn.value = n.participant?.msisdn;
		email.value = n.participant?.email;
		address.value = n.participant?.address;
	}
);

const validEmail = ref(false);
const validMsisdn = ref(false);
const validMsisdnMessage = ref("Please provide a phone number");
const validEmailMessage = ref("Please provide a valid email address");

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

watch(
	() => msisdn.value,
	(n) => {
		if (!n) {
			return;
		}
		contactValidation(n);
	}
);

watch(
	() => email.value,
	(n) => {
		if (!n) {
			return;
		}
		validateEmail(n);
	}
);

const validateEmail = (mail) => {
	console.log({ mail });
	if (!mail) {
		validEmail.value = false;
		validEmailMessage.value = "Please provide a valid email address";
	}
	const isValid = emailValidation(mail);

	if (!isValid.valid) {
		validEmail.value = true;
		validEmailMessage.value = isValid.message;
	} else {
		validEmail.value = false;
	}
};

// Lifecycle Hooks
onMounted(async () => {
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
</script>

<style scoped>
.show-feedback {
	display: flex;
}

.validated {
	border-color: var(--bs-form-invalid-border-color);
}

.validated:focus {
	border-color: var(--bs-form-invalid-border-color) !important;
}
#editParticipantModalBody {
	max-width: 67% !important;
	margin-left: 24.5% !important;
}

.modal {
	background-color: #1616158f;
}
</style>
