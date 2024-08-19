<template>
	<section class="vh-100" style="background-color: #ececec">
		<div class="container py-5 h-100">
			<div
				class="row d-flex justify-content-center align-items-center h-100"
			>
				<div class="col-12 col-md-8 col-lg-6 col-xl-5">
					<div
						class="card shadow-2-strong boxShadow"
						style="border-radius: 1rem"
					>
						<div class="card-body p-5">
							<div class="d-flex justify-content-center mb-3">
								<img
									src="../assets/images/ontime_logo.jpg"
									style="width: 9rem"
									alt=""
								/>
							</div>
							<div
								class="py-2 mb-3 text-center rounded"
								id="message"
							></div>

							<form
								@submit.prevent="signIn"
								class="needs-validation"
								novalidate
							>
								<!-- EMAIL -->
								<div
									data-mdb-input-init
									class="form-outline mb-4"
								>
									<label
										class="form-label is-required"
										for="email"
										>Email<span class="visually-hidden">
											(required)</span
										></label
									>
									<div class="input-group has-validation">
										<input
											type="text"
											id="email"
											class="form-control form-control-lg"
											aria-describedby="inputGroupPrepend"
											v-model="email"
											required
										/>

										<div class="invalid-feedback">
											Please provide an email or username.
										</div>
									</div>
								</div>

								<!-- PASSWORD -->
								<div
									data-mdb-input-init
									class="form-outline mb-4"
								>
									<label
										class="form-label is-required"
										for="password"
										>Password<span class="visually-hidden">
											(required)</span
										></label
									>

									<div
										class="input-group has-validation position-relative"
									>
										<input
											:type="type ? 'password' : 'text'"
											id="password"
											class="form-control form-control-lg"
											aria-describedby="inputGroupPrepend"
											v-model="password"
											required
											autocomplete="true"
										/>
										<div
											@click="togglePassword"
											class="position-absolute end-0 cursor-pointer h-100 px-2 d-flex justify-content-center align-items-center password-visibility"
										>
											<Icons
												v-if="showPassword"
												v-model:icon="visionIcon"
											/>
											<Icons
												v-if="hidePassword"
												v-model:icon="hideIcon"
											/>
										</div>
										<div class="invalid-feedback">
											Please provide an email or username.
										</div>
									</div>
								</div>

								<!-- Checkbox -->
								<div
									class="form-check d-flex justify-content-between align-items-center gap-1 mb-4"
								>
									<div>
										<input
											class="form-check-input"
											type="checkbox"
											value=""
											id="form1Example3"
										/>
										<label
											class="form-check-label"
											for="form1Example3"
										>
											Keep me logged in
										</label>
									</div>
									<div
										class="d-flex justify-content-end form-check-label"
									>
										<a href="#">Forgot Password?</a>
									</div>
								</div>

								<div
									class="col-md-12 d-flex gap-3 justify-content-end"
								>
									<button
										type="submit"
										class="btn btn-primary w-100"
										style="padding: 0.4rem"
									>
										<Icons v-model:icon="signInIcon" />
										Sign In
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import Icons from "../components/Icons.vue";
import { formValidation, getElement, removeClass } from "@/util/util";
import { login } from "@/assets/js";
import { setCookie } from "@/util/auth";

const visionIcon = "accessibility-vision";
const hideIcon = "hide";
const signInIcon = "session-enter";
const hidePassword = ref(true);
const showPassword = ref(false);
const type = ref(true);
const email = ref("");
const password = ref("");
const router = useRouter();

const togglePassword = () => {
	if (hidePassword.value) {
		hidePassword.value = false;
		showPassword.value = true;
		type.value = false;
	} else {
		showPassword.value = false;
		hidePassword.value = true;
		type.value = true;
	}
};

const signIn = async () => {
	if (!email.value || !password.value) {
		return;
	}

	const { ok, result } = await login({
		username: email.value,
		password: password.value,
	});

	warning(
		result.message,
		ok ? "success" : "danger",
		ok ? "#83d61631" : "#ea060629"
	);
	setTimeout(() => {
		if (ok) {
			resetForm();
			const { token } = result.data;
			setCookie("token", token, 1);
			router.push("/dashboard");
		}
	}, 2000);
};

const resetForm = () => {
	email.value = "";
	password.value = "";

	// Remove validation classes
	const form = getElement(".needs-validation");
	removeClass(form, "was-validated");
};

/**
 * Displays a warning message with the specified content, class name, and background color.
 * The message will be automatically hidden after 10 seconds.
 *
 * @param {string} message - The message text to display.
 * @param {string} className - The CSS class name to apply to the warning message element.
 * @param {string} bgColor - The background color to apply to the warning message container.
 */
const warning = (message, className, bgColor) => {
	const warningMessageContainer = getElement("#message");

	warningMessageContainer.innerHTML = `<span class="${className}">${message}</span>`;
	warningMessageContainer.style.backgroundColor = bgColor;
	removeClass(warningMessageContainer, "hide");
};

onMounted(async () => {
	formValidation();
});
</script>

<style>
.form-check-label {
	font-size: 0.8rem;
}

.danger {
	color: #cd3c14 !important;
}
.success {
	color: #228722 !important;
}
</style>
