<template>
    <AlertModal :data="alert" />

    <div
        class="d-flex flex-column container gap-3"
        style="padding: 0 !important"
    >
        <div id="workspaceBreadcrumbsWrapper" class="mt-4 mb-2">
            <BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
        </div>

        <form @submit.prevent v-show="stage == 0" class="row g-3">
            <div class="dropdown mt-2" id="selectEventWrapper">
                <label for="selectVisitorInput" class="form-label is-required">
                    Find Visitor by Phone Number or Name
                </label>

                <div class="input-group has-validation">
                    <input
                        @input="searchVisitors"
                        type="text"
                        class="form-select dropdown-toggle dropdown-toggle-split"
                        v-model="msisdn"
                        id="selectVisitorInput"
                        aria-describedby="inputGroupPrepend"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        autofocus="true"
                        autocomplete="off"
                        required
                        placeholder="Enter Phone Number or Name"
                    />
                    <ul class="dropdown-menu w-100">
                        <li class="dropdown-item" v-if="noMatch">No Match</li>
                        <li v-if="loading" class="dropdown-item">Loading...</li>
                        <li v-if="errorSearchingVisitors" class="dropdown-item">
                            <span class="text-danger">
                                Unable to search visitors, try again!
                            </span>
                        </li>
                        <template v-for="visitor in visitors">
                            <li
                                @click="visitorSelected(visitor)"
                                class="dropdown-item"
                                :value="visitor.id"
                            >
                                {{ visitor.name }}
                                <span class="lightText">
                                    ({{ visitor.msisdn }})
                                </span>
                            </li>
                        </template>
                        <router-link
                            :to="{ name: 'add-visitor' }"
                            class="text-primary"
                        >
                            <li class="dropdown-item text-decoration-none">
                                Create new visitor
                            </li>
                        </router-link>
                    </ul>
                </div>
            </div>
        </form>

        <div
            class="form-control input"
            id="mobileFormWrapper"
            style="padding: 3rem"
            v-if="stage == 1"
        >
            <form
                class="row g-3 needs-validation"
                novalidate
                @submit.prevent="checkParticipantIn"
            >
                <!-- PHONE NUMBER -->
                <div class="col-md-6">
                    <label
                        for="validationCustomVisitorNumber"
                        class="form-label is-required"
                    >
                        Phone number<span class="visually-hidden"
                            >(required)</span
                        >
                    </label>
                    <div class="input-group has-validation">
                        <input
                            @input="searchVisitors"
                            type="text"
                            class="form-select dropdown-toggle dropdown-toggle-split"
                            v-model="msisdn"
                            id="selectVisitorInput"
                            aria-describedby="inputGroupPrepend"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            autocomplete="off"
                            required
                            placeholder="Enter Phone Number or Name"
                            :class="{ inputOutline: msisdnError }"
                        />
                        <div
                            :class="{ 'd-flex': msisdnError }"
                            class="invalid-feedback"
                        >
                            Please provide a visitor phone number.
                        </div>
                        <ul class="dropdown-menu w-100">
                            <li class="dropdown-item" v-if="noMatch">
                                No Match
                            </li>
                            <li v-if="loading" class="dropdown-item">
                                Loading...
                            </li>
                            <li
                                v-if="errorSearchingVisitors"
                                class="dropdown-item"
                            >
                                <span class="text-danger">
                                    Unable to search visitors, try again!
                                </span>
                            </li>
                            <template v-for="visitor in visitors">
                                <li
                                    @click="visitorSelected(visitor)"
                                    class="dropdown-item"
                                    :value="visitor.id"
                                >
                                    {{ visitor.name }}
                                    <span class="lightText">
                                        ({{ visitor.msisdn }})
                                    </span>
                                </li>
                            </template>
                            <router-link
                                :to="{ name: 'add-visitor' }"
                                class="text-primary"
                            >
                                <li class="dropdown-item text-decoration-none">
                                    Create new visitor
                                </li>
                            </router-link>
                        </ul>
                    </div>
                </div>

                <!-- NEW VISITOR -->
                <div class="col-md-6">
                    <label
                        for="validationCustomNewVisitor"
                        class="form-label is-required"
                    >
                        Visitor<span class="visually-hidden">(required)</span>
                    </label>
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="validationCustomNewVisitor"
                            aria-describedby="inputGroupPrepend"
                            v-model="visitor"
                            required
                            disabled
                            :class="{ inputOutline: nameError }"
                        />
                        <div
                            :class="{ 'd-flex': nameError }"
                            class="invalid-feedback"
                        >
                            Please provide a visitor name.
                        </div>
                    </div>
                </div>

                <!-- Employee -->
                <div class="col-md-6">
                    <label
                        for="validationCustomEmployeeNumber"
                        class="form-label is-required"
                    >
                        Visiting
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <div class="input-group has-validation">
                        <input
                            @input="searchEmployees"
                            type="text"
                            class="form-select dropdown-toggle dropdown-toggle-split"
                            v-model="employeeQuery"
                            id="selectVisitorInput"
                            aria-describedby="inputGroupPrepend"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            autocomplete="off"
                            required
                            :class="{ inputOutline: employeeError }"
                        />
                        <div
                            :class="{ 'd-flex': employeeError }"
                            class="invalid-feedback"
                        >
                            Please select who you are visiting.
                        </div>
                        <ul class="dropdown-menu w-100">
                            <li class="dropdown-item" v-if="noEmployeeMatch">
                                No Match
                            </li>
                            <li v-if="loadingEmployee" class="dropdown-item">
                                Loading...
                            </li>
                            <li
                                v-if="errorSearchingEmployees"
                                class="dropdown-item"
                            >
                                <span class="text-danger">
                                    Unable to search employees, try again!
                                </span>
                            </li>
                            <template v-for="employee in employees">
                                <li
                                    @click="employeeSelected(employee)"
                                    class="dropdown-item"
                                    :value="employee.id"
                                >
                                    {{ employee.name }}
                                    <span class="lightText">
                                        ({{ employee.msisdn }})
                                    </span>
                                </li>
                            </template>
                            <router-link
                                :to="{ name: 'add-employee' }"
                                class="text-primary"
                            >
                                <li class="dropdown-item text-decoration-none">
                                    Create new employee
                                </li>
                            </router-link>
                        </ul>
                    </div>
                </div>

                <!-- BELONGINGS -->
                <div class="col-md-6">
                    <label for="belongings" class="form-label">
                        Belongings
                    </label>
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            autofocus="true"
                            id="belongings"
                            aria-describedby="inputGroupPrepend"
                            v-model="temBelonging"
                            @keyup.prevent="addBelongings"
                            @keydown.enter.prevent
                        />
                    </div>
                    <div
                        v-for="belonging in belongings"
                        :key="belonging"
                        @click="deleteBelongings(belonging)"
                        class="belonging"
                    >
                        {{ belonging }}
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="col-12 d-flex gap-2">
                    <button
                        class="btn btn-primary"
                        style="margin-left: auto"
                        type="submit"
                        :disabled="submitting"
                    >
                        <div
                            class="spinner-border submitBtnLoader"
                            role="status"
                            v-if="submitting"
                        >
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        Check In
                    </button>
                    <button class="btn btn-secondary" @click="router.back()">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import AlertModal from "../modals/AlertModal.vue";
import { API_URL, API_KEY, registerVisit } from "@/assets/js/index.js";
import { useRouter } from "vue-router";
import { formValidation, showModal, formatMsisdn } from "@/util/util";

const msisdn = ref("");
const visitor = ref("");
const visitorId = ref("");

const visitors = ref([]);
const employees = ref([]);
const employee = ref({
    id: "",
    name: "",
    room_id: "",
});
const loadingEmployee = ref(false);
const employeeQuery = ref("");
const errorSearchingEmployees = ref(false);
const noEmployeeMatch = ref(false);

const activeBreadCrumbs = ref([]);

// section loader flag
const $sectionIsLoading =
    getCurrentInstance().appContext.config.globalProperties.$sectionIsLoading;

// Belongings Data
const temBelonging = ref("");
const belongings = ref([]);

const submitting = ref(false);
const msisdnError = ref(false);
const nameError = ref(false);

// visitors searching flags
const loading = ref(true);
const noMatch = ref(false);
const errorSearchingVisitors = ref(false);

const router = useRouter();

const alert = ref({
    message: "",
    status: "success",
    pageLink: "",
});

/*
 * Stage of Workspace Check In
 * 0 => Enter Contact to Search for Visitor
 * 1 => Enter Check In Details
 * 2 => Check In
 */
const stage = ref(0);

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});

activeBreadCrumbs.value = ["check-in", "meeting"];

onMounted(async () => {
    formValidation();

    fetchTop10Visitors();

    fetchEmployees();
});

async function fetchTop10Visitors() {
    $.ajax(`${API_URL}visitors/top-visitors?notIn=1`, {
        method: "GET",
        headers: {
            authorization: API_KEY.value,
        },
        success: (res) => {
            const tmpVisitors = res.data;

            for (const visitor of tmpVisitors) {
                visitor.name = `${visitor.first_name} ${
                    visitor.middle_name || ""
                } ${visitor.last_name}`;
            }

            loading.value = false;

            visitors.value = tmpVisitors;
        },
        error: (err) => {
            console.error("error retrieving top ten visitors: ", err);
        },
    });
}

async function fetchEmployees() {
    $.ajax(`${API_URL}employees?limit=10`, {
        method: "GET",
        headers: {
            authorization: API_KEY.value,
        },
        success: (res) => {
            const tmpEmployees = res.data.employees;

            for (const employee of tmpEmployees) {
                employee.name = `${employee.first_name} ${
                    employee.middle_name || ""
                } ${employee.last_name}`;
            }

            employees.value = tmpEmployees;
        },
        error: (err) => {
            console.error("error retrieving employees: ", err);
        },
    });
}

// function to search visitors
async function searchVisitors() {
    setTimeout(async () => {
        try {
            const searchValue = Number(msisdn.value)
                ? formatMsisdn(msisdn.value)
                : msisdn.value;

            let url = `${API_URL}visitors?search=${searchValue}&limit=10`;

            let searchedVisitor = await fetch(url, {
                headers: {
                    authorization: API_KEY.value,
                },
            });

            if (searchedVisitor.ok) {
                const res = await searchedVisitor.json();

                let tmpVisitors = res.data.data;

                if (!tmpVisitors.length) {
                    noMatch.value = true;
                    errorSearchingVisitors.value = false;
                    visitors.value = [];
                    return;
                }

                for (const visitor of tmpVisitors) {
                    visitor.name = `${visitor.first_name} ${
                        visitor.middle_name || ""
                    } ${visitor.last_name}`;
                }

                noMatch.value = false;
                errorSearchingVisitors.value = false;
                visitors.value = tmpVisitors;
            } else {
                visitors.value = [];
                errorSearchingVisitors.value = true;
                noMatch.value = true;
            }
        } catch (error) {
            visitors.value = [];
            errorSearchingVisitors.value = true;
            noMatch.value = false;
            loading.value = false;
        }
    }, 750);
}

// function to get employee by NAME or MSISDN
async function searchEmployees() {
    setTimeout(async () => {
        try {
            const searchValue = Number(employeeQuery.value)
                ? formatMsisdn(employeeQuery.value)
                : employeeQuery.value;

            let url = `${API_URL}employees?search=${searchValue}&limit=10`;

            let searchedEmployee = await fetch(url, {
                headers: {
                    authorization: API_KEY.value,
                },
            });

            if (searchedEmployee.ok) {
                const res = await searchedEmployee.json();

                let tmpEmployees = res.data.employees;

                if (!tmpEmployees.length) {
                    noEmployeeMatch.value = true;
                    errorSearchingEmployees.value = false;
                    employees.value = [];
                    return;
                }

                for (const employee of tmpEmployees) {
                    employee.name = `${employee.first_name} ${employee.last_name}`;
                }

                noEmployeeMatch.value = false;
                errorSearchingEmployees.value = false;
                employees.value = tmpEmployees;
            } else {
                console.error("error searching employees: ", error);

                employees.value = [];
                errorSearchingVisitors.value = true;
                noEmployeeMatch.value = false;
            }
        } catch (error) {
            console.error("error searching employees: ", error);

            employees.value = [];
            errorSearchingEmployees.value = true;
            noMatch.value = false;
            loading.value = false;
        }
    }, 750);
}

function visitorSelected(selectedVisitor) {
    msisdn.value = selectedVisitor.msisdn;
    visitor.value = selectedVisitor.name;
    visitorId.value = selectedVisitor.id;

    stage.value = 1;
}

function employeeSelected(selectedEmployee) {
    employeeQuery.value = selectedEmployee.name;

    employee.value.name = selectedEmployee.name;
    employee.value.id = selectedEmployee.id;
    employee.value.room_id = selectedEmployee.room_id;
}

// function to validate form before it submit the form
const checkParticipantIn = async () => {
    msisdnError.value = false;
    nameError.value = false;

    // ensure msisdn was given
    if (!msisdn.value) {
        msisdnError.value = true;
        return;
    }

    // ensure msisdn was given
    if (!visitor.value) {
        nameError.value = true;
        return;
    }

    // ensure employee was selected
    if (!employee.value.id) {
        alert.value.message = "Employee is required";
        alert.value.status = "danger";

        showModal();
        return;
    }

    $sectionIsLoading.value = true;
    submitting.value = true;

    // require values for the submittion of the form
    const visitData = {
        visitor_id: visitorId.value,
        items: belongings.value,
        employee_id: employee.value.id,
        room_id: employee.value.room_id,
        purpose: "Meeting with " + employee.value.name,
        type: "Meeting",
    };

    const response = await registerVisit(visitData);

    // successful check in
    if (response.result.status == 201) {
        alert.value.message = "Visitor Checked In";
        alert.value.status = "success";
        alert.value.pageLink = "/visits";

        resetForm();
    } else {
        alert.value.message = response.result.message;
        alert.value.status = "danger";
    }

    $sectionIsLoading.value = false;
    submitting.value = false;

    showModal();
};

function resetForm() {
    msisdn.value = "";
    visitor.value = "";
    visitorId.value = "";
    employee.value.id = "";
    employee.value.room_id = "";
    employee.value.name = "";
    belongings.value = [];
}

const addBelongings = (event) => {
    const { key } = event;

    if (key === "Enter" && temBelonging.value) {
        if (!belongings.value.includes(temBelonging.value)) {
            belongings.value.push(temBelonging.value);
        }
        temBelonging.value = "";
    }
};

const deleteBelongings = (item) => {
    belongings.value = belongings.value.filter((val) => val !== item);
};
</script>

<style scoped>
.input {
    border: 0.0125rem solid #ccc;
    border-radius: 0.25rem !important;
}

.belonging {
    text-transform: capitalize;
    display: inline-block;
    margin: 20px 10px 0 0;
    padding: 6px 12px;
    background-color: #eee;
    border-radius: 20px;
    font-size: 12px;
    letter-spacing: 1px;
    font-weight: bold;
    color: #777;
    cursor: pointer;
}

.inputOutline {
    outline: 2px solid red outset;
}

a {
    text-decoration: none;
}

@media (max-width: 1250px) {
    #eventCheckInWrapper {
        gap: 0.75rem !important;
    }

    #selectEventWrapper {
        margin-top: 0 !important;
        max-width: 95%;
        margin-left: auto;
        margin-right: auto;
    }

    #workspaceBreadcrumbsWrapper {
        margin-left: 2.6%;
        margin-top: 0.7rem;
        margin-bottom: 0.7rem;
    }

    #mobileFormWrapper {
        margin: 0 auto;
        max-width: 95%;
    }
}
</style>
