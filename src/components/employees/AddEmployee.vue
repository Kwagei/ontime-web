<template>
    <Modal
        :data="{
            title: alert.title,
            message: alert.message,
            status: alert.status,
            pageLink: alert.pageLink,
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
                <!-- FIRST NAME -->
                <div class="col-md-6">
                    <label for="firstName" class="form-label is-required">
                        First Name
                        <span class="visually-hidden"> (required)</span>
                    </label>
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="firstName"
                            aria-describedby="inputGroupPrepend"
                            v-model="firstName"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide an employee first name.
                        </div>
                    </div>
                </div>

                <!-- LAST NAME -->
                <div class="col-md-6">
                    <label for="lastName" class="form-label is-required">
                        Last Name
                        <span class="visually-hidden"> (required)</span>
                    </label>
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="lastName"
                            aria-describedby="inputGroupPrepend"
                            v-model="lastName"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide an employee last name.
                        </div>
                    </div>
                </div>

                <!-- PHONE NUMBER -->
                <div class="col-md-6">
                    <label for="msisdn" class="form-label is-required">
                        Phone Number
                        <span class="visually-hidden"> (required)</span>
                    </label>
                    <div class="input-group has-validation">
                        <input
                            type="tel"
                            class="form-control"
                            id="msisdn"
                            aria-describedby="inputGroupPrepend"
                            v-model="msisdn"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide an employee phone number.
                        </div>
                    </div>
                </div>

                <!-- EMAIL -->
                <div class="col-md-6">
                    <label for="email" class="form-label"> Email </label>
                    <div class="input-group">
                        <input
                            type="email"
                            class="form-control"
                            id="email"
                            aria-describedby="inputGroupPrepend"
                            v-model="email"
                        />
                        <div class="invalid-feedback">
                            Please provide an employee email.
                        </div>
                    </div>
                </div>

                <!-- POSITION -->
                <div class="col-md-6">
                    <label for="position" class="form-label is-required">
                        Position
                        <span class="visually-hidden"> (required)</span>
                    </label>
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="position"
                            aria-describedby="inputGroupPrepend"
                            v-model="position"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide an employee position.
                        </div>
                    </div>
                </div>

                <!-- ADDRESS -->
                <div class="col-md-6">
                    <label for="address" class="form-label"> Address </label>
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="address"
                            aria-describedby="inputGroupPrepend"
                            v-model="address"
                        />
                        <div class="invalid-feedback">
                            Please provide an employee address.
                        </div>
                    </div>
                </div>

                <!-- ROOM -->
                <div class="dropdown col-md-6">
                    <label for="room" class="form-label is-required">
                        Room
                        <span class="visually-hidden">(required)</span>
                    </label>

                    <div class="input-group has-validation position-relative">
                        <input
                            type="text"
                            class="form-select"
                            id="facilitatorInput"
                            v-model="roomValue"
                            aria-expanded="false"
                            data-bs-toggle="dropdown"
                            autocomplete="off"
                            required
                        />

                        <ul class="dropdown-menu w-100">
                            <template v-for="room in rooms">
                                <li
                                    class="dropdown-item"
                                    :value="room.id"
                                    @click="updateRoomTerm(room)"
                                >
                                    {{ room.name }}
                                </li>
                            </template>
                            <router-link
                                :to="{ name: 'new-room' }"
                                class="text-primary"
                            >
                                <li class="dropdown-item">Create new room</li>
                            </router-link>
                        </ul>

                        <div class="invalid-feedback">
                            Please select a room.
                        </div>
                    </div>
                </div>

                <div class="col-md-12 d-flex gap-2 justify-content-end">
                    <button
                        type="submit"
                        class="btn btn-primary"
                        style="margin-left: auto"
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
                        class="btn btn-secondary"
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import BreadCrumbs from "@/components/BreadCrumbs.vue";
import Modal from "@/components/modals/AlertModal.vue";
import { registerHost, editHost, getHosts } from "@/assets/js/index.js";
import {
    formValidation,
    getElement,
    removeClass,
    showModal,
} from "@/util/util.js";
import router from "@/router";

// Route and State
const route = useRoute();
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const msisdn = ref("");
const address = ref("");
const position = ref("");
const roomValue = ref("");

const rooms = ref([]);

// Modal Data
const alert = ref({
    title: "",
    status: "",
    message: "",
    pageLink: "",
});

const buttonLabel = ref("Save");

const loading = ref(false);

// Form status and breadcrumbs
const activeBreadCrumbs = ref([]);
const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);
activeBreadCrumbs.value = breadCrumbs.value;
const tem = [...breadCrumbs.value];
const formStatus = tem.pop();

// Functions
const onSubmit = async () => {
    if (loading.value) return;

    if (!name.value) {
        return;
    }

    loading.value = true;

    const host = {
        name: name.value,
        details: details.value,
        type: type.value,
    };

    const response = formStatus.startsWith("new")
        ? await registerHost(host)
        : await editHost(hostInfo.id, host);

    showModal("#alertModal", "#alertModalBody");
    alert.value.status = response.ok ? "success" : "danger";
    alert.value.message = response.result.message;

    loading.value = false;

    // Reset form if the response is successful
    if (response.ok) {
        resetForm();
    }
};

const fetchHost = async () => {
    if (formStatus.startsWith("edit")) {
        buttonLabel.value = "Update";
        const id = breadCrumbs.value[1];
        hostInfo = await getHosts({ id });

        name.value = hostInfo.name;
        details.value = hostInfo.details;
    }
};

const resetForm = () => {
    name.value = "";
    details.value = "";
    buttonLabel.value = "Save";

    // Remove validation classes
    const form = getElement(".needs-validation");
    removeClass(form, "was-validated");
};

// Lifecycle Hooks
onMounted(() => {
    fetchHost();
    formValidation();
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
    padding-top: 2rem;
    gap: 1.5rem;
}

@media (min-width: 768px) and (max-width: 1440px) {
    #visitor-view {
        padding: 1rem 3rem 0 3rem;
    }
}
</style>
