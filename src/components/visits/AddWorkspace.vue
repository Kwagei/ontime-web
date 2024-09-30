<template>
    <AlertModal :data="alert" />

    <!-- BELONGING MODAL -->
    <div
        class="modal fade"
        id="visitModal"
        tabindex="-1"
        aria-hidden="true"
        aria-labelledby="visitModalLabel"
        style="z-index: 2000"
    >
        <div
            class="modal-dialog modal-lg modal-dialog-centered"
            id="modal-dialog"
        >
            <div class="modal-content rounded">
                <div class="modal-header">
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
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="belongings" class="form-label"
                            >Belongings</label
                        >
                        <div class="input-group has-validation">
                            <input
                                type="text"
                                class="form-control"
                                id="belongings"
                                aria-describedby="inputGroupPrepend"
                                v-model="temBelonging"
                                @keyup.prevent="addBelongings"
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
                    <div>
                        <label for="institution" class="form-label"
                            >Institution</label
                        >
                        <div class="input-group">
                            <input
                                type="text"
                                class="form-control"
                                id="institution"
                                aria-describedby="inputGroupPrepend"
                                v-model="institution"
                            />
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="checkParticipantIn" class="btn btn-primary">
                        Check In
                    </button>

                    <button
                        type="button"
                        class="btn btn-outline-secondary"
                        data-bs-dismiss="modal"
                        @click="resetForm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div
        class="d-flex flex-column container gap-3"
        style="padding: 0 !important"
    >
        <div id="workspaceBreadcrumbsWrapper" class="mt-4 mb-2">
            <BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
        </div>

        <form @submit.prevent v-show="stage == 0" class="row g-3">
            <div class="dropdown mt-2" id="selectEventWrapper">
                <label for="selectEventInput" class="form-label is-required">
                    Find Visitor by Contact
                </label>

                <div>
                    <input
                        @input="getVisitor"
                        type="text"
                        class="form-control form-select"
                        v-model="msisdn"
                        id="validationCustomVisitorNumber"
                        aria-describedby="inputGroupPrepend"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        autocomplete="off"
                        required
                        placeholder="Visitor's Phone Number"
                    />
                    <ul class="dropdown-menu w-100">
                        <li
                            class="dropdown-item"
                            v-if="msisdn && !visitors.length"
                        >
                            No Match
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
                @submit.prevent="getInstitutionAndBelongings"
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
                            @input="getVisitor"
                            type="text"
                            class="form-control form-select"
                            v-model="msisdn"
                            id="validationCustomVisitorNumber"
                            aria-describedby="inputGroupPrepend"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            autocomplete="off"
                            required
                            placeholder="Visitor Phone Number"
                        />
                        <ul class="dropdown-menu w-100">
                            <li
                                class="dropdown-item"
                                v-if="msisdn && !visitors.length"
                            >
                                No Match
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
                        <div class="invalid-feedback">
                            Please provide a valid phone number.
                        </div>
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
                        />
                        <div class="invalid-feedback">
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

                <!-- Purpose -->
                <div class="col-md-6">
                    <label
                        for="validationCustomPurpose"
                        class="form-label is-required"
                    >
                        Purpose<span class="visually-hidden">(required)</span>
                    </label>
                    <div class="input-group has-validation">
                        <textarea
                            class="form-control w-auto"
                            id="validationCustomPurpose"
                            required
                            v-model="purpose"
                        ></textarea>
                        <div class="invalid-feedback">
                            Please provide a purpose.
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="col-12 d-flex gap-2">
                    <button
                        class="btn btn-primary"
                        style="margin-left: auto"
                        type="submit"
                    >
                        Save
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
import { ref, onMounted } from "vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import AlertModal from "../modals/AlertModal.vue";
import {
    registerVisit,
    API_URL,
    API_KEY,
    visitorCheckInStatus,
} from "@/assets/js/index.js";
import { useRouter } from "vue-router";
import { formValidation, showModal } from "@/util/util";

const msisdn = ref("");
const visitor = ref("");
const visitorId = ref("");
const purpose = ref("");

const temBelonging = ref("");
const belongings = ref([]);
const institution = ref("");

const activeBreadCrumbs = ref([]);

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

activeBreadCrumbs.value = [...props.breadCrumbs, "visit-checkin"];

onMounted(async () => {
    formValidation();

    fetchRooms();
});

// function to get visitor bt MSISDN
const getVisitor = async () => {
    try {
        const visitorData = await searchVisitors();
        visitors.value = visitorData.data.data;

        for (const visitor of visitors.value) {
            visitor.name = `${visitor.first_name} ${
                visitor.middle_name || ""
            } ${visitor.last_name}`;
        }
    } catch (error) {
        console.error("Error retrieving visitor:", error);
    }
};

async function searchVisitors() {
    let url = `${API_URL}visitors?search=${
        msisdn.value.startsWith("0")
            ? "231" + msisdn.value.slice(1)
            : msisdn.value
    }&limit=12`;

    let searchedVisitor = await fetch(url, {
        headers: {
            authorization: API_KEY,
        },
    });

    if (!searchedVisitor.ok) {
        alert.value.message = "Unable to search visitors, try again";
        alert.value.status = "danger";

        showModal();
        return [];
    }

    return await searchedVisitor.json();
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
    const checkInStatus = await visitorCheckInStatus(visitorId.value);

    // handle error getting check in status
    if (!checkInStatus.ok) {
        alert.value.message = "Unable to get check in status";
        alert.value.status = "danger";

        showModal();
        return;
    }
    // indicate visitor is still checked in
    else if (checkInStatus.result.data.stillCheckedIn) {
        alert.value.message = "Visitor is Still Checked In";
        alert.value.status = "warning";

        showModal();
        return;
    }

    // require values for the submittion of the form
    const visitData = {
        visitor_id: visitorId.value,
        institution: institution.value,
        items: belongings.value,
        room_id: room.value.id,
        purpose: `Just Using Workspace${
            purpose.value ? " - " + purpose.value : ""
        }`,
    };

    const response = await registerVisit(visitData);

    // successful check in
    if (response.result.status == 201) {
        alert.value.message = "Visitor Checked In";
        alert.value.status = "success";
        alert.value.pageLink = "/visits";
    } else {
        alert.value.message = response.result.message;
        alert.value.status = "danger";
    }

    showModal();
};

// complete check in with institution and belongings
function getInstitutionAndBelongings() {
    // ensure room was selected
    if (!room.value.id) {
        alert.value.message = "Room is required";
        alert.value.status = "danger";

        showModal();
        return;
    }

    showModal("#visitModal", "#modal-dialog");
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
