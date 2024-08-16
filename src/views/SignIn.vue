<template>
	<div
		class="w-100 h-100 d-flex justify-content-center;"
		style="background-color: #ececec"
	>
		<div
			class="form-control input boxShadow"
			style="
				margin: auto;
				padding: 3rem;
				border-radius: 0.5rem;
				width: 30rem;
			"
		>
			<!-- <h1 class="text-center display-1">Ontime</h1> -->
			<div class="d-flex justify-content-center mb-5">
				<img
					src="../assets/images/ontime_logo.jpg"
					style="width: 9rem"
					alt=""
				/>
			</div>
			<div
				class="py-2 mb-3 text-center rounded d-none"
				style="background-color: rgba(34, 135, 34, 0.2)"
			>
				<span class="">Success</span>
			</div>
			<form class="row g-3 needs-validation" novalidate>
				<!-- EMAIL -->
				<div class="">
					<label for="email" class="form-label is-required"
						>Email<span class="visually-hidden">
							(required)</span
						></label
					>
					<div class="input-group has-validation">
						<input
							type="text"
							class="form-control"
							style="padding: 0.8rem"
							id="email"
							aria-describedby="inputGroupPrepend"
							v-model="email"
							required
						/>
					</div>
				</div>

				<!-- PASSWORD -->
				<div class="">
					<label for="password" class="form-label is-required"
						>Password<span class="visually-hidden">
							(required)</span
						></label
					>
					<div
						class="input-group has-validation"
						style="position: relative"
					>
						<input
							:type="type ? 'password' : 'text'"
							style="padding: 0.8rem"
							class="form-control"
							id="password"
							aria-describedby="inputGroupPrepend"
							v-model="password"
							required
						/>

						<div
							style="
								position: absolute;
								right: 0;
								cursor: pointer;
							"
							@click="togglePassword"
							class="h-100 px-2 d-flex justify-content-center align-items-center password-visibility"
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
					</div>
				</div>

				<div class="my-3 d-flex justify-content-between">
					<div class="col-md-6">
						<label class="form-check-label" for="keepLoggedIn">
							Keep me logged in
						</label>
						<input
							class="form-check-input mx-2"
							type="checkbox"
							name="gridcheckboxs"
							id="keepLoggedIn"
							value="option2"
						/>
					</div>
					<div class="col-md-6 d-flex justify-content-end">
						<a href="#">Forgot Password?</a>
					</div>
				</div>

				<div class="col-md-12 d-flex gap-3 justify-content-end">
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
</template>

<script setup>
import { ref } from "vue";
import Icons from "../components/Icons.vue";
const visionIcon = "accessibility-vision";
const hideIcon = "hide";
const signInIcon = "session-enter";
const hidePassword = ref(true);
const showPassword = ref(false);
const type = ref(true);

const togglePassword = (event) => {
	const input = event.target.closest(".input-group").children[0];

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
</script>

<style scoped>
span {
	color: rgba(34, 135, 34);
	font-weight: bold;
}
</style>
