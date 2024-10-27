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
                    Find Visitor by Contact or Name
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

                <!-- Room -->
                <div class="col-md-6">
                    <label
                        for="validationCustomRoom"
                        class="form-label is-required"
                    >
                        Room<span class="visually-hidden">(required)</span>
                    </label>
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control form-select"
                            id="validationCustomRoom"
                            v-model="room.name"
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
                                    @click="updateRoom(room)"
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
                            Please provide a room name.
                        </div>
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
import {
    API_URL,
    API_KEY,
    registerVisit,
    visitorCheckInStatus,
} from "@/assets/js/index.js";
import { useRouter } from "vue-router";
import { formValidation, showModal, formatMsisdn } from "@/util/util";

const msisdn = ref("");
const visitor = ref("");
const visitorId = ref("");

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
const loading = ref(false);
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

const visitors = ref([]);
const rooms = ref([]);
const room = ref({
    id: "",
    name: "",
});

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});

activeBreadCrumbs.value = ["check-in", "workspace"];

onMounted(async () => {
    formValidation();

    fetchTop10Visitors();

    fetchRooms();
});

async function fetchTop10Visitors() {
    $.ajax(`${API_URL}visitors/top-visitors?notIn=1`, {
        method: "GET",
        headers: {
            authorization: API_KEY,
        },
        success: (res) => {
            const tmpVisitors = res.data;

            for (const visitor of tmpVisitors) {
                visitor.name = `${visitor.first_name} ${
                    visitor.middle_name || ""
                } ${visitor.last_name}`;
            }

            visitors.value = tmpVisitors;
        },
        error: (err) => {
            console.error("error retrieving top ten visitors: ", err);
        },
    });
}

// function to get visitor by NAME or MSISDN
async function searchVisitors() {
    setTimeout(async () => {
        try {
            const searchValue = Number(msisdn.value)
                ? formatMsisdn(msisdn.value)
                : msisdn.value;

            let url = `${API_URL}visitors?search=${searchValue}&limit=15`;

            let searchedVisitor = await fetch(url, {
                headers: {
                    authorization: API_KEY,
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

function visitorSelected(selectedVisitor) {
    msisdn.value = selectedVisitor.msisdn;
    visitor.value = selectedVisitor.name;
    visitorId.value = selectedVisitor.id;

    stage.value = 1;
}

async function fetchRooms() {
    let fetchedRooms = await fetch(`${API_URL}rooms`, {
        method: "GET",
        headers: {
            authorization: API_KEY,
        },
    });

    if (!fetchedRooms.ok) {
        alert.value.message = "Unable to fetch rooms, try again";
        alert.value.status = "danger";

        showModal();
        return [];
    }

    fetchedRooms = await fetchedRooms.json();
    rooms.value = fetchedRooms.data.rooms;
}

function updateRoom(selectedRoom) {
    room.value.name = selectedRoom.name;
    room.value.id = selectedRoom.id;
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

    // ensure room was selected
    if (!room.value.id) {
        alert.value.message = "Room is required";
        alert.value.status = "danger";

        showModal();
        return;
    }

    $sectionIsLoading.value = true;
    submitting.value = true;

    const checkInStatus = await visitorCheckInStatus(visitorId.value);

    // handle error getting check in status
    if (!checkInStatus.ok) {
        alert.value.message = "Unable to get check in status";
        alert.value.status = "danger";

        showModal();
        $sectionIsLoading.value = false;
        submitting.value = false;
        return;
    }

    // indicate visitor is still checked in
    else if (checkInStatus.result.data.stillCheckedIn) {
        alert.value.message = "Visitor is Still Checked In";
        alert.value.status = "warning";

        $sectionIsLoading.value = false;
        submitting.value = false;

        showModal();
        return;
    }

    // require values for the submittion of the form
    const visitData = {
        visitor_id: visitorId.value,
        items: belongings.value,
        room_id: room.value.id,
        purpose: "Workspace",
        type: "Workspace",
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
    room.value.id = "";
    room.value.name = "";
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
