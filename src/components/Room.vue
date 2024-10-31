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
            style="margin-top: 1.5rem"
        >
            <BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
        </div>

        <div
            class="form-control input"
            id="mobileFormWrapper"
            style="margin: auto; padding: 3rem"
        >
            <form
                class="row g-3 needs-validation"
                novalidate
                @submit.prevent="onSubmit"
            >
                <!-- NAME -->
                <div class="col-md-6">
                    <label for="name" class="form-label is-required">
                        Name
                        <span class="visually-hidden">(required)</span>
                    </label>
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

                <!-- TYPE -->
                <div class="col-md-6">
                    <label for="type" class="form-label is-required">
                        Type
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <div class="input-group has-validation">
                        <select
                            class="form-select"
                            v-model="type"
                            id="type"
                            aria-describedby="inputGroupPrepend"
                            autocomplete="off"
                            required
                        >
                            <option>Office</option>
                            <option>Class</option>
                            <option>Other</option>
                        </select>
                        <div class="invalid-feedback">
                            Please provide a room type.
                        </div>
                    </div>
                </div>

                <!-- CODE -->
                <div class="col-md-6">
                    <label for="code" class="form-label">Code (alias) </label>
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

                <div class="col-md-12 d-flex gap-2 justify-content-end">
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="loading"
                    >
                        <div
                            class="spinner-border submitBtnLoader"
                            role="status"
                            v-if="loading"
                        >
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        {{ buttonLabel }}
                    </button>
                    <button
                        type="button"
                        class="btn btn-outline-secondary"
                        data-bs-dismiss="modal"
                        @click="router.push('/rooms')"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BreadCrumbs from "../components/BreadCrumbs.vue";
import Modal from "./modals/AlertModal.vue";
import { registerRoom, editRoom, getRooms } from "@/assets/js/index.js";
import {
    formValidation,
    getElement,
    removeClass,
    showModal,
} from "@/util/util.js";
// Route and State
const route = useRoute();
const router = useRouter();

const name = ref("");
const type = ref("");
const code = ref("");

const alert = ref({
    status: "",
    message: "",
    title: "",
});

const buttonLabel = ref("Save");
let roomInfo = {};

const loading = ref(false);

// Form status and breadcrumbs
const activeBreadCrumbs = ref([]);
const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);
activeBreadCrumbs.value = breadCrumbs.value;

// Functions
const onSubmit = async () => {
    if (loading.value) return;

    if (!name.value) {
        return;
    }

    const room = {
        name: name.value,
        type: type.value,
        code: code.value,
    };

    loading.value = true;

    const response = route.params.id
        ? await editRoom(route.params.id, room)
        : await registerRoom(room);

    loading.value = false;

    showModal();

    alert.value.status = response.ok ? "success" : "danger";
    alert.value.message = response.result.message;
    alert.value.title = response.ok ? "Success" : "Error";

    // Reset form if the response is successful
    if (response.ok) {
        resetForm();
    }
};

const fetchRoom = async () => {
    if (route.params.id) {
        roomInfo.id = route.params.id;
        buttonLabel.value = "Update";

        const id = route.params.id;
        roomInfo = await getRooms(id);
        if (!roomInfo) {
            alert.value.message = "Unable to fetch room to edit, try again";
            alert.value.status = "danger";

            showModal();
            return;
        }

        roomInfo = roomInfo.rooms;

        roomInfo.id = route.params.id;
        name.value = roomInfo.name;
        type.value = roomInfo.type;
        code.value = roomInfo.code;
    }
};

const resetForm = () => {
    if (route.params.id) return;

    name.value = "";
    type.value = "";
    code.value = "";
    buttonLabel.value = "Save";

    // Remove validation classes
    const form = getElement(".needs-validation");
    removeClass(form, "was-validated");
};

// Lifecycle Hooks
onMounted(async () => {
    formValidation();
    await fetchRoom();
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
