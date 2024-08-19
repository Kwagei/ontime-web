<template>
	<AlertModal :data="alert" />
	<div id="visitor-view" class="d-flex flex-column container">
		<div
			class="d-flex justify-content-between align-items-center container p-0 mx-auto"
			style="margin-top: 0.3rem"
		>
			<BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
		</div>

		<div
			class="mt-1 form-control input rounded"
			style="margin: auto; padding: 3rem"
		>
			<form
				class="row g-3 needs-validation"
				novalidate
				@submit.prevent="onSubmit"
			>
				<!-- USERNAME -->
				<div class="col-md-6">
					<label for="username" class="form-label is-required"
						>Username<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<input
							type="text"
							class="form-control"
							id="username"
							aria-describedby="inputGroupPrepend"
							v-model="username"
							required
						/>
						<div class="invalid-feedback">
							Please provide a Username.
						</div>
					</div>
				</div>

				<!-- PASSWORD -->
				<div class="col-md-6">
					<label for="password" class="form-label">Password</label>
					<div class="input-group">
						<input
							type="password"
							:class="[
								validPassword && 'validated',
								'form-control',
							]"
							v-model="password"
							id="password"
							aria-describedby="inputGroupPrepend"
							autocomplete="off"
						/>
						<div
							:class="[
								'invalid-feedback',
								validPassword && 'show-feedback',
							]"
						>
							{{ validPasswordMessage }}
						</div>
					</div>
					<div class="helpMessage form-text">
						Password should be min 6 characters with at least one
						upper, lower case, digit and symbol.
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
					<div class="helpMessage form-text">
						Phone number should start with 0. For example:
						0778675908
					</div>
				</div>

				<!-- EMAIL -->
				<div class="col-md-6">
					<label for="email" class="form-label">Email</label>
					<div class="input-group">
						<input
							type="email"
							:class="[validEmail && 'validated', 'form-control']"
							v-model="email"
							id="email"
							aria-describedby="inputGroupPrepend"
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
					<div class="helpMessage form-text">
						Enter a valid email address. For example:
						john12@gmail.com
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
					<div class="helpMessage form-text">
						Enter descriptive address. For example: Congo Town,
						Adjacent Satcom, Monrovia, Liberia
					</div>
				</div>

				<!-- USER ROLES -->
				<div class="col-md-6">
					<label for="user-role" class="form-label is-required"
						>User Role<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<select
							class="form-select form-control"
							aria-label="Default select example"
							required
							v-model="roles"
						>
							<option value="administrator">Administrator</option>
							<option value="security">Security</option>
						</select>

						<div class="invalid-feedback">
							Please select a role.
						</div>
					</div>
				</div>

				<!-- GENDER -->
				<div class="col-md-6">
					<label for="address" class="form-label is-required"
						>Gender<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<select
							class="form-select"
							aria-label="Default select example"
							required
							v-model="gender"
						>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
						<div class="invalid-feedback">
							Please select a gender.
						</div>
					</div>
				</div>

				<div class="col-md-12 d-flex gap-2 justify-content-end">
					<button type="submit" class="btn btn-primary">Save</button>
					<button
						class="btn btn-outline-secondary"
						type="button"
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
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import BreadCrumbs from "../BreadCrumbs.vue";
import AlertModal from "../modals/AlertModal.vue";
import { getSingleUser, registerUser, editUser } from "@/assets/js/index.js";
import {
	msisdnValidation,
	emailValidation,
	showModal,
	getElement,
	removeClass,
	formValidation,
	passwordValidation,
} from "@/util/util.js";

// Route and State
const route = useRoute();
const router = useRouter();

// visitor data
const username = ref("");
const msisdn = ref("");
const email = ref("");
const address = ref("");
const gender = ref("");
const roles = ref("");
const password = ref("");

const alert = ref({
	status: "",
	title: "",
	message: "",
	pageLink: "",
});

let userInfo;

// Form status and breadcrumbs
const activeBreadCrumbs = ref([]);
const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);
activeBreadCrumbs.value = breadCrumbs.value;
const tem = [...breadCrumbs.value];
const formStatus = tem.pop();

// Functions
const onSubmit = async () => {
	if (!username.value || !msisdn.value || !address.value || !gender.value) {
		return;
	}

	const user = {
		username: username.value,

		// format msisdn for backend
		msisdn: msisdn.value.startsWith("0")
			? `231${msisdn.value.slice(1)}`
			: msisdn.value,

		email: email.value,
		address: address.value,
		gender: gender.value,
		password: password.value,
		roles: [roles.value],
	};

	const response = formStatus.startsWith("new")
		? await registerUser(user)
		: await editUser(userInfo.id, user);

	console.log({ response });

	showModal("#alertModal", "#alertModalBody");
	alert.value.status = response.ok ? "success" : "danger";
	alert.value.message = response.result.message;
	alert.value.pageLink = `/users/${response.result.data.id}`;

	// Reset form if the response is successful
	if (response.ok) {
		resetForm();
	}
};

const fetchUser = async () => {
	if (formStatus.startsWith("edit")) {
		const id = breadCrumbs.value[1];
		const [user] = await getSingleUser({ id });
		userInfo = user;
		// update references for input fields
		username.value = user.username;
		msisdn.value = user.msisdn[0];
		email.value = user.email;
		address.value = user.address;
		gender.value = user.gender;
		roles.value = user.roles[0];
	}
};

const validEmail = ref(false);
const validMsisdn = ref(false);
const validPassword = ref(false);
const validMsisdnMessage = ref("Please provide a phone number");
const validEmailMessage = ref("Please provide a valid email address");
const validPasswordMessage = ref(
	"Password should be min 6 characters with at least one upper, lower case, digit and symbol"
);

const validateMsisdn = (number) => {
	if (!number) {
		validMsisdn.value = false;
		validMsisdnMessage.value = "Please provide a phone number";
		return;
	}

	const { valid, message } = msisdnValidation([number]);

	if (!valid) {
		validMsisdn.value = true;
		validMsisdnMessage.value = message;
	} else {
		validMsisdn.value = false;
	}
};

const validateEmail = (mail) => {
	if (!mail) {
		validEmail.value = false;
		validEmailMessage.value = "Please provide a valid email address";
		return;
	}
	const { valid, message } = emailValidation(mail);

	if (!valid) {
		validEmail.value = true;
		validEmailMessage.value = message;
	} else {
		validEmail.value = false;
	}
};

const validatePassword = (pwd) => {
	if (!pwd) {
		validPassword.value = false;
		validPasswordMessage.value =
			"Password should be min 6 characters with at least one upper, lower case, digit and symbol";
		return;
	}

	const { valid, message } = passwordValidation(pwd);

	if (!valid) {
		validPassword.value = true;
		validPasswordMessage.value = message;
	} else {
		validPassword.value = false;
	}
};

watch(
	() => msisdn.value,
	(n) => {
		validateMsisdn(n);
	}
);

watch(
	() => email.value,
	(n) => {
		validateEmail(n);
	}
);

watch(
	() => password.value,
	(n) => {
		validatePassword(n);
	}
);

const resetForm = () => {
	username.value = "";
	msisdn.value = "";
	email.value = "";
	address.value = "";
	gender.value = "";
	roles.value = "";
	password.value = "";

	// Remove validation classes
	const form = getElement(".needs-validation");
	removeClass(form, "was-validated");
};

// Lifecycle Hooks
onMounted(async () => {
	formValidation();
	await fetchUser();
});
</script>

<style scoped>
.show-feedback {
	display: flex;
}

.validated {
	border-color: var(--bs-form-invalid-border-color) !important;
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

select {
	padding: calc(1rem - 1px) 1rem calc(0.5rem + 1px);
}
</style>
