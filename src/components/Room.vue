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
							Please provide a room name.
						</div>
					</div>
				</div>

				<!-- CODE -->
				<div class="col-md-6">
					<label for="code" class="form-label">Code </label>
					<div class="input-group has-validation">
						<input
							type="tel"
							class="form-control"
							v-model="code"
							id="code"
							aria-describedby="inputGroupPrepend"
							autocomplete="off"
						/>
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import BreadCrumbs from "../components/BreadCrumbs.vue";
import Modal from "../components/Modal.vue";
import { registerRoom, editRoom, getRooms } from "@/assets/js/index.js";
import { showModal } from "@/assets/js/util.js";
// Route and State
const route = useRoute();
const name = ref("");
const code = ref("");

const alert = ref({
	status: "",
	message: "",
	title: "",
});

const buttonLabel = ref("Save");
let roomInfo;

// Form status and breadcrumbs
const activeBreadCrumbs = ref([]);
const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);
activeBreadCrumbs.value = breadCrumbs.value;
const tem = [...breadCrumbs.value];
const formStatus = tem.pop();

// Functions
const onSubmit = async () => {
	if (!name.value) {
		return;
	}

	const room = {
		name: name.value,
		code: code.value,
	};

	const response = formStatus.startsWith("new")
		? await registerRoom(room)
		: await editRoom(roomInfo.id, room);

	showModal("#alertModal", "#alertModalBody");

	alert.value.status = response.ok ? "success" : "danger";
	alert.value.message = response.result.message;
	alert.value.title = response.ok ? "Success" : "Error";

	// Reset form if the response is successful
	if (response.ok) {
		resetForm();
	}
};

const fetchRoom = async () => {
	if (formStatus.startsWith("edit")) {
		buttonLabel.value = "Update";
		const id = breadCrumbs.value[1];
		roomInfo = await getRooms({ id });

		name.value = roomInfo.name;
		code.value = roomInfo.code;
	}
};

const resetForm = () => {
	name.value = "";
	code.value = "";
	buttonLabel.value = "Save";

	// Remove validation classes
	const form = document.querySelector(".needs-validation");
	form.classList.remove("was-validated");
};

// Lifecycle Hooks
onMounted(() => {
	fetchRoom();

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
