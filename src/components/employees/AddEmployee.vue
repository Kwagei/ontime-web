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

        <div class="form-control input" style="margin: auto; padding: 3rem">
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
                            autocomplete="off"
                            required
                        />
                        <div
                            class="invalid-feedback"
                            :class="{ 'd-flex': msisdn && msisdnError }"
                        >
                            {{ msisdnError }}
                        </div>
                    </div>
                </div>

                <!-- GENDER -->
                <div class="col-md-6">
                    <label for="gender" class="form-label is-required">
                        Gender
                        <span class="visually-hidden"> (required)</span>
                    </label>
                    <div class="input-group has-validation">
                        <select
                            class="form-control form-select"
                            id="gender"
                            aria-describedby="inputGroupPrepend"
                            v-model="gender"
                            required
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <div class="invalid-feedback">Gender is required.</div>
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
                            <template v-for="room in roomsData">
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
                            autocomplete="off"
                        />
                        <div
                            class="invalid-feedback"
                            :class="{ 'd-flex': emailError }"
                        >
                            {{ emailError }}
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
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import BreadCrumbs from "@/components/BreadCrumbs.vue";
import Modal from "@/components/modals/AlertModal.vue";
import { getRooms, API_URL, API_KEY, getEmployees } from "@/assets/js/index.js";
import {
    emailValidation,
    formValidation,
    getElement,
    msisdnValidation,
    removeClass,
    showModal,
} from "@/util/util.js";
import router from "@/router";

// Route and State
const route = useRoute();
const firstName = ref("");
const lastName = ref("");
const gender = ref("");
const email = ref("");
const msisdn = ref("");
const address = ref("");
const position = ref("");
const roomValue = ref("");
const roomId = ref("");

const roomsData = ref([]);
const msisdnError = ref("");
const emailError = ref("");

const employeeId = ref("");
const employeeInfo = ref({});

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

// Functions
const onSubmit = async () => {
    if (loading.value) return;

    if (
        !firstName.value ||
        !lastName.value ||
        !msisdn.value ||
        !gender.value ||
        !position.value ||
        !roomId.value
    ) {
        return;
    }

    loading.value = true;

    const employee = {
        firstName: firstName.value,
        lastName: lastName.value,
        gender: gender.value,
        msisdn: msisdn.value,
        email: email.value || null,
        address: address.value || null,
        position: position.value,
        room_id: roomId.value,
    };

    const response = route.params.id
        ? await createEmployee(employee, route.params.id)
        : await createEmployee(employee);

    showModal();
    alert.value.status =
        response.status == 201 || response.status == 200 ? "success" : "danger";
    alert.value.message = response.message;

    loading.value = false;

    // Reset form if the response is successful
    if (response.status == 200 || response.status == 201) {
        resetForm();
        alert.value.pageLink = "/employees/" + employeeId.value;
    }
};

async function createEmployee(employee, id) {
    let createdEmployee;

    try {
        await $.ajax(`${API_URL}employees${id ? "/" + id : ""}`, {
            method: id ? "PUT" : "POST",
            data: employee,
            headers: {
                authorization: API_KEY,
            },
            success: (res) => {
                loading.value = false;

                createdEmployee = res;
                employeeId.value = res.data.id;
            },
        });

        return createdEmployee;
    } catch (err) {
        loading.value = false;

        console.error("error creating employee: ", err);
        createdEmployee = err.responseJSON;

        return createdEmployee;
    }
}

const fetchEmployeeToEdit = async () => {
    if (route.params.id) {
        buttonLabel.value = "Update";
        const id = route.params.id;
        employeeInfo.value = await getEmployees(id);

        // handle error fetching employee to edit
        if (!employeeInfo.value) {
            alert.value.message = "Unable to fetch employee to edit, try again";
            alert.value.status = "danger";
            showModal();

            return;
        }

        employeeInfo.value = employeeInfo.value.employees;

        firstName.value = employeeInfo.value.first_name;
        lastName.value = employeeInfo.value.last_name;
        msisdn.value = employeeInfo.value.msisdn;
        address.value = employeeInfo.value.address;
        email.value = employeeInfo.value.email;
        gender.value = employeeInfo.value.gender;
        position.value = employeeInfo.value.position;
        roomId.value = employeeInfo.value.room_id;
        roomValue.value = employeeInfo.value.room;
    }
};

const resetForm = () => {
    firstName.value = "";
    lastName.value = "";
    email.value = "";
    msisdn.value = "";
    address.value = "";
    roomValue.value = "";

    buttonLabel.value = "Save";

    // Remove validation classes
    // const form = ".needs-validation";
    // removeClass(form, "was-validated");
};

function updateRoomTerm(room) {
    roomId.value = room.id;
    roomValue.value = room.name;
}

// Lifecycle Hooks
onMounted(async () => {
    const { rooms } = await getRooms();
    roomsData.value = rooms;

    fetchEmployeeToEdit();

    formValidation();
});

// validate phone number
watch(
    () => msisdn.value,
    (n) => {
        if (!n)
            return (msisdnError.value = "Employee phone number is required");

        if (!msisdnValidation([msisdn.value]).valid)
            return (msisdnError.value = "Invalid phone number");

        msisdnError.value = "";
    }
);

// validate email
watch(
    () => email.value,
    (n) => {
        if (!n) return (emailError.value = "");

        if (!emailValidation(email.value).valid)
            return (emailError.value = "Invalid email address");

        emailError.value = "";
    }
);
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
