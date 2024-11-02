<template>
    <AlertModal :data="alert" />
    <div id="eventsWrapper" class="d-flex flex-column container">
        <div
            id="entitiesBreadCrumbsWrapper"
            class="d-flex justify-content-between mt-4"
        >
            <BreadCrumbs v-model:breadCrumbs="activeBreadCrumbs" />
        </div>

        <h3
            v-if="errorGettingEventToEdit"
            class="text-center mt-3 d-flex align-items-center flex-column text-danger"
            style="margin-bottom: -21px"
        >
            Error getting event to edit, please try again!
            <hr class="text-center w-75" />
        </h3>

        <div
            id="mobileFormWrapper"
            class="form-control input rounded"
            style="margin: auto; padding: 3rem"
        >
            <form
                class="row g-3 needs-validation"
                novalidate
                @submit.prevent="onSubmit"
            >
                <!-- TITLE -->
                <div class="col-md-6">
                    <label for="title" class="form-label is-required"
                        >Title<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="title"
                            aria-describedby="inputGroupPrepend"
                            v-model="title"
                            autofocus="true"
                            required
                        />

                        <div class="invalid-feedback">
                            Please provide a title.
                        </div>
                    </div>
                </div>

                <!-- FACILITATOR -->
                <div class="col-md-6">
                    <label for="facilitator" class="form-label is-required"
                        >Facilitator<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="facilitator"
                            aria-describedby="inputGroupPrepend"
                            v-model="facilitator"
                            required
                        />

                        <div class="invalid-feedback">
                            Please provide a facilitator.
                        </div>
                    </div>
                </div>

                <!-- START DATE -->
                <div class="col-md-6">
                    <label for="startDate" class="form-label is-required"
                        >Start Date<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <input
                            type="date"
                            class="form-control"
                            id="startDate"
                            aria-describedby="inputGroupPrepend"
                            v-model="startDate"
                            required
                        />

                        <div class="invalid-feedback">
                            Please provide a start date.
                        </div>
                    </div>
                </div>

                <!-- HOST -->
                <div class="dropdown col-md-6">
                    <label for="first_name" class="form-label is-required"
                        >Host<span class="visually-hidden">
                            (required)</span
                        ></label
                    >

                    <div class="input-group has-validation position-relative">
                        <input
                            type="text"
                            class="form-select"
                            id="facilitatorInput"
                            :id="hostID"
                            :value="hostValue"
                            v-model="hostValue"
                            aria-expanded="false"
                            data-bs-toggle="dropdown"
                            autocomplete="off"
                            required
                        />
                        <ul class="dropdown-menu w-100">
                            <template v-for="host in hostsData">
                                <li
                                    class="dropdown-item"
                                    :value="host.id"
                                    @click="updateHostTerm(host)"
                                >
                                    {{ host.name }}
                                </li>
                            </template>
                            <router-link
                                :to="{ name: 'new-host' }"
                                class="text-primary"
                            >
                                <li class="dropdown-item">Create new host</li>
                            </router-link>
                        </ul>

                        <div class="invalid-feedback">
                            Please provide a host.
                        </div>
                    </div>
                </div>

                <!-- END DATE -->
                <div class="col-md-6">
                    <label for="endDate" class="form-label is-required"
                        >End Date<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <input
                            type="date"
                            class="form-control"
                            id="endDate"
                            aria-describedby="inputGroupPrepend"
                            v-model="endDate"
                            required
                        />

                        <div class="invalid-feedback">
                            Please provide an end date.
                        </div>
                    </div>
                </div>

                <!-- ROOM -->
                <div class="dropdown col-md-6">
                    <label for="room" class="form-label is-required"
                        >Room<span class="visually-hidden">
                            (required)</span
                        ></label
                    >

                    <div class="input-group has-validation position-relative">
                        <input
                            type="text"
                            class="form-select"
                            id="facilitatorInput"
                            :id="roomID"
                            :value="roomValue"
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
                            Please provide a host.
                        </div>
                    </div>
                </div>

                <!-- DETAILS -->
                <div class="col-md-6">
                    <label for="detail" class="form-label">Details</label>
                    <div class="input-group">
                        <textarea
                            placeholder="Enter details..."
                            class="form-control"
                            id="detailsTextarea"
                            v-model="details"
                            rows="3"
                        ></textarea>

                        <div class="invalid-feedback">
                            Please enter event details.
                        </div>
                    </div>
                </div>

                <!-- TYPE -->
                <div class="col-md-6">
                    <label for="type" class="form-label is-required"
                        >Type<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation position-relative">
                        <input
                            type="text"
                            class="form-select"
                            id="facilitatorInput"
                            :value="type"
                            aria-expanded="false"
                            data-bs-toggle="dropdown"
                            autocomplete="off"
                            required
                        />

                        <ul class="dropdown-menu w-100">
                            <li
                                class="dropdown-item"
                                v-for="type in eventTypes"
                                :key="type"
                                @click="updateEventTerm(type)"
                            >
                                {{ type }}
                            </li>
                        </ul>

                        <div class="invalid-feedback">
                            Please select a type.
                        </div>
                    </div>
                </div>

                <div class="col-md-12 d-flex justify-content-end gap-2">
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
                        Save
                    </button>
                    <button
                        @click="router.back()"
                        class="btn btn-outline-secondary"
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
import $ from "jquery";

import {
    API_KEY,
    API_URL,
    getEvents,
    getHosts,
    getRooms,
} from "../../assets/js/index.js";

import BreadCrumbs from "../BreadCrumbs.vue";
import AlertModal from "../modals/AlertModal.vue";
import { useRoute, useRouter } from "vue-router";
import {
    capitalize,
    formValidation,
    getElement,
    removeClass,
    showModal,
} from "@/util/util.js";

// Event Creation Data
const title = ref("");
const facilitator = ref("");
const startDate = ref("");
const endDate = ref("");
const type = ref("");
const details = ref("");

// Rooms Data
const roomValue = ref("");
const roomID = ref("");
const roomsData = ref("");
const roomTem = ref("");

// Hosts Data
const hostValue = ref("");
const hostID = ref("");
const hostsData = ref("");
const hostsTerm = ref("");

// Event types
const eventTypes = [
    "Course",
    "Conference",
    "Workshop",
    "Hackathon",
    "Program",
    "Excursion",
];

// Modal Data
const alert = ref({
    title: "",
    status: "",
    message: "",
    pageLink: "",
});

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});

const loading = ref(false);

const route = useRoute();
const router = useRouter();

const eventId = ref(router.currentRoute.value.params.id);
const mode = setMode();
const errorGettingEventToEdit = ref("");

// Set breadcrumbs for editing of adding new event
const activeBreadCrumbs = ref(
    eventId.value
        ? ["events", eventId.value, "edit-event"]
        : ["events", "add-event"]
);

const updateHostTerm = (host) => {
    hostValue.value = host.name;
    hostID.value = host.id;
};

const updateRoomTerm = (room) => {
    roomValue.value = room.name;
    roomID.value = room.id;
};

const updateEventTerm = (et) => {
    type.value = et;
};

watch([startDate, endDate], ([newStart, newEnd]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // show error only if it's a new event is being added
    if (mode == "add") {
        // ensure the event start date is not before today
        if (newStart && new Date(newStart) < today) {
            alert.value.message = "START DATE can not be before today";
            alert.value.status = "warning";

            startDate.value = "";

            showModal();
        }

        // ensure the event end date is not before today
        if (newEnd && new Date(newEnd) < today) {
            alert.value.message = "END DATE can not be before today";
            alert.value.status = "warning";

            startDate.value = "";

            showModal();
        }
    }

    // ensure start date is on or before end date
    if (newStart && newEnd && new Date(newStart) > new Date(newEnd)) {
        alert.value.message = "START DATE must be on or before END DATE";
        alert.value.status = "warning";

        endDate.value = "";
        showModal();
    }
});

// Local search for host
watch(
    () => hostValue.value,
    (n) => {
        hostsData.value = n
            ? hostsTerm.value.filter((host) =>
                  host.name.toLocaleLowerCase().includes(n.toLocaleLowerCase())
              )
            : hostsTerm.value;
    }
);

// Local search for rooms
watch(
    () => roomValue.value,
    (n) => {
        roomsData.value = n
            ? roomTem.value.filter((room) =>
                  room.name.toLocaleLowerCase().includes(n.toLocaleLowerCase())
              )
            : roomTem.value;
    }
);

const onSubmit = async () => {
    if (loading.value) return;

    if (
        !title.value ||
        !facilitator.value ||
        !startDate.value ||
        !endDate.value ||
        !type.value ||
        !hostValue.value ||
        !roomValue.value
    ) {
        return;
    }

    loading.value = true;

    const body = {
        title: title.value,
        facilitator: facilitator.value,
        start_date: startDate.value,
        end_date: endDate.value,
        type: type.value,
        host: hostID.value,
        room: roomID.value,
        details: details.value,
    };

    const options =
        setMode() === "edit"
            ? { url: API_URL + `/events/${eventId.value}`, type: "PUT" }
            : { url: API_URL + "/events/", type: "POST" };

    $.ajax({
        url: options.url,
        type: options.type,
        data: body,
        headers: {
            authorization: API_KEY,
        },
        success: (data) => {
            showModal();

            alert.value.status = "success";
            alert.value.message = data.message;
            alert.value.pageLink = `/events/${
                data.data.length ? data.data[0].id : data.data.id
            }`;

            resetForm();

            loading.value = false;
        },
        error: (error) => {
            showModal();
            alert.value.status = "danger";
            alert.value.message = error.responseJSON.message;

            loading.value = false;
        },
    });
};

function resetForm() {
    if (route.params.id) router.push("/events/" + route.params.id);

    // clear inputs
    title.value = "";
    facilitator.value = "";
    startDate.value = "";
    endDate.value = "";
    type.value = "";
    hostValue.value = "";
    roomValue.value = "";
    details.value = "";

    // Remove validation classes
    const form = getElement(".needs-validation");
    removeClass(form, "was-validated");
}

// Lifecycle Hooks
onMounted(async () => {
    // get event to edit if we're trying to edit

    const { hosts } = await getHosts();
    hostsData.value = hosts;
    hostsTerm.value = hosts;

    const { rooms } = await getRooms(null, "class");
    roomsData.value = rooms;
    roomTem.value = rooms;

    if (mode == "edit") await getEventToEdit();

    formValidation();

    $("#breadCrumbs").css({
        display: "block",
    });

    if (window.innerWidth <= 1070) {
        $("#breadCrumbsOl")[0].innerHTML = `
			<li style="margin: 10px">
				<span class="text fw-bold">
					${capitalize(mode)} Event
				</span>
			</li>
		`;
    }
});

function setMode() {
    // claim the event is being edited if there's an event ID
    // otherwise assume it's a new event that's being added
    return eventId.value ? "edit" : "add";
}

async function getEventToEdit() {
    try {
        const [event] = await getEvents(eventId.value);

        title.value = event.title;
        type.value = event.type;
        facilitator.value = event.facilitator;
        details.value = event.details;
        hostValue.value = event.host;
        hostID.value = event.host_id;
        roomValue.value = event.room;
        roomID.value = event.room_id;
        startDate.value = formatEventDates(event.start_date);
        endDate.value = formatEventDates(event.end_date);
    } catch (error) {
        console.log("Error getting event to edit: ", error.responseJSON);
        errorGettingEventToEdit.value = true;
    }
}

// format date back to ISOString before setting it as the value in start and end date fields
const formatEventDates = (date) => new Date(date).toISOString().split("T")[0];
</script>

<style scoped>
.form-select {
    padding: calc(1rem - 1px) 1rem calc(0.5rem + 1px);
}

.dropdown-item {
    cursor: pointer;
}

a {
    text-decoration: none;
}

a:hover {
    color: #ff7900 !important;
}

#eventsWrapper {
    gap: 1.5rem;
}
</style>
