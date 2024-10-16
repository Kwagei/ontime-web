<template>
    <AlertModal :data="alert" />

    <!-- BELONGING MODAL -->
    <BelongingModal @done="checkParticipantIn" />

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
                        />
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
import { ref, onMounted, getCurrentInstance } from "vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import AlertModal from "../modals/AlertModal.vue";
import BelongingModal from "../modals/BelongingModal.vue";
import {
    API_URL,
    API_KEY,
    registerVisit,
    visitorCheckInStatus,
} from "@/assets/js/index.js";
import { useRouter } from "vue-router";
import {
    formValidation,
    showModal,
    getElement,
    removeClass,
} from "@/util/util";

const msisdn = ref("");
const visitor = ref("");
const visitorId = ref("");

const activeBreadCrumbs = ref([]);

// section loader flag
const $sectionIsLoading =
    getCurrentInstance().appContext.config.globalProperties.$sectionIsLoading;

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

activeBreadCrumbs.value = [...props.breadCrumbs, "workspace"];

onMounted(async () => {
    formValidation();

    fetchRooms();
});

// function to get visitor by NAME or MSISDN
async function searchVisitors() {
    try {
        let url = `${API_URL}visitors?search=${
            msisdn.value.startsWith("0")
                ? "231" + msisdn.value.slice(1)
                : msisdn.value
        }&limit=15`;

        loading.value = true;
        visitors.value = [];

        let searchedVisitor = await fetch(url, {
            headers: {
                authorization: API_KEY,
            },
        });

        loading.value = false;

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
const checkParticipantIn = async (belongingsAndInstitution) => {
    $sectionIsLoading.value = true;

    const checkInStatus = await visitorCheckInStatus(visitorId.value);

    // handle error getting check in status
    if (!checkInStatus.ok) {
        alert.value.message = "Unable to get check in status";
        alert.value.status = "danger";

        showModal();
        $sectionIsLoading.value = false;
        return;
    }

    // indicate visitor is still checked in
    else if (checkInStatus.result.data.stillCheckedIn) {
        alert.value.message = "Visitor is Still Checked In";
        alert.value.status = "warning";

        $sectionIsLoading.value = false;

        showModal();
        return;
    }

    // require values for the submittion of the form
    const visitData = {
        visitor_id: visitorId.value,
        institution: belongingsAndInstitution.institution,
        items: belongingsAndInstitution.belongings,
        room_id: room.value.id,
        purpose: "Workspace",
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

    // hide belongings and institution modal
    const visitModal = getElement("#visitModal");
    removeClass(visitModal, "show");
    visitModal.style.display = "none";

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

    setTimeout(() => showModal("#visitModal", "#modal-dialog"), 500);
}

function resetForm() {
    msisdn.value = "";
    visitor.value = "";
    visitorId.value = "";
    room.value.id = "";
    room.value.name = "";
}
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
