<template>
    <Modal
        :data="{
            title: successModalData.title,
            message: successModalData.message,
            status: successModalData.status,
            pageLink: successModalData.pageLink,
        }"
    />
    <div id="eventsWrapper" class="d-flex flex-column container">
        <div class="d-flex justify-content-between">
            <BreadCrumbs v-model:breadCrumbs="activeBreadCrumbs" />
        </div>

        <h3
            v-if="errorGettingEventToEdit"
            class="text-center mt-3 d-flex align-items-center flex-column text-danger"
            style="margin-bottom: -21px"
        >
            Unable to get event to edit, please try again!
            <hr class="text-center w-75" />
        </h3>

        <div class="form-control input" style="margin: auto; padding: 3rem">
            <form
                @submit.prevent="mode == 'add' ? postEvent() : putEvent()"
                id="eventsFormWrapper"
                novalidate
                class="row g-3 needs-validation"
            >
                <!-- Title -->
                <div>
                    <label for="titleInput" class="form-label is-required">
                        Title
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <input
                        type="text"
                        class="form-control"
                        :class="{
                            border: titleError,
                            'border-danger': titleError,
                        }"
                        id="titleInput"
                        placeholder="Title"
                        v-model="title"
                        required
                    />

                    <Alert :title="titleError" />
                </div>

                <!-- Facilitator -->
                <div>
                    <label
                        for="facilitatorInput"
                        class="form-label is-required"
                    >
                        Facilitator
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <input
                        type="text"
                        class="form-control"
                        id="facilitatorInput"
                        :class="{
                            border: facilitatorError,
                            'border-danger': facilitatorError,
                        }"
                        placeholder="Facilitator"
                        v-model="facilitator"
                        required
                    />

                    <Alert :title="facilitatorError" />
                </div>

                <!-- Start Date -->
                <div>
                    <label for="startDateInput" class="form-label is-required">
                        Start Date
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <input
                        type="date"
                        class="form-control"
                        id="startDateInput"
                        :class="{
                            border: startDateError,
                            'border-danger': startDateError,
                        }"
                        placeholder="Start Date"
                        v-model="startDate"
                        required
                    />

                    <Alert :title="startDateError" />
                </div>

                <!-- Host -->
                <div class="dropdown">
                    <label for="typeInput" class="form-label is-required">
                        Host
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <input
                        type="text"
                        class="form-control"
                        id="hostInput"
                        :class="{
                            'border border-danger': hostError,
                        }"
                        :id="hostID"
                        :value="hostValue"
                        aria-expanded="false"
                        data-bs-toggle="dropdown"
                        autocomplete="off"
                        required
                    />
                    <ul class="dropdown-menu" style="width: 96.75%">
                        <template v-for="host in hosts">
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
                            <li
                                class="dropdown-item"
                                v-if="!hosts || !hosts[index + 1]"
                            >
                                create new host
                            </li>
                        </router-link>
                    </ul>

                    <Alert :title="hostError" />
                </div>

                <!-- End Date -->
                <div>
                    <label for="endDateInput" class="form-label is-required">
                        End Date
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <input
                        type="date"
                        class="form-control"
                        id="endDateInput"
                        :class="{
                            border: endDateError,
                            'border-danger': endDateError,
                        }"
                        placeholder="End Date"
                        v-model="endDate"
                        required
                    />

                    <Alert :title="endDateError" />
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
                            rows="2"
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
                        <option v-for="room in rooms" :value="room.name">
                            {{ room.name }}
                        </option>
                    </select>

                    <Alert :title="roomError" />
                </div>

                <div class="col-md-12 d-flex gap-3">
                    <button
                        @click="mode == 'add' ? postEvent() : putEvent()"
                        class="btn btn-primary px-5 py-2"
                        type="submit"
                        style="margin-left: auto"
                        class="btn btn-primary px-5"
                    >
                        Save
                    </button>
                    <button
                        class="btn btn-secondary px-5"
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
import $ from "jquery";

import {
    visuallyHideModalBackdrop,
    API_URL,
    getHosts,
} from "../../assets/js/index.js";

import BreadCrumbs from "../BreadCrumbs.vue";
import Modal from "../Modal.vue";
import Alert from "../Alert.vue";
import { useRouter } from "vue-router";
import { showModal } from "@/assets/js/util.js";

// Event Creation Data
const title = ref("");
const facilitator = ref("");
const startDate = ref("");
const endDate = ref("");
const hostValue = ref("");
const hostID = ref("");
const hosts = ref("");
const roomValue = ref("");
const roomID = ref("");
const rooms = ref("");
const type = ref("");
const details = ref("");
const buttonLabel = ref("Save");

const rooms = ref([]);

// Modal Data
const successModalData = ref({
    title: "",
    status: "",
    message: "",
    pageLink: "",
});

// Error Alert Data
const titleError = ref("");
const facilitatorError = ref("");
const startDateError = ref("");
const endDateError = ref("");
const typeError = ref("");
const hostError = ref("");
const roomError = ref("");
const detailsError = ref("");

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});

const router = useRouter();
const eventId = ref(router.currentRoute.value.params.id);
const mode = setMode();
const errorGettingEventToEdit = ref("");

// Set breadcrumbs for editing of adding new event
const activeBreadCrumbs = ref(
    eventId.value
        ? [...props.breadCrumbs, eventId.value, "edit-event"]
        : [...props.breadCrumbs, "add-event"]
);

const updateHostTerm = (host) => {
    hostValue.value = host.name;
    hostID.value = host.id;
};

async function postEvent() {
    const body = {
        title: title.value,
        facilitator: facilitator.value,
        start_date: startDate.value,
        end_date: endDate.value,
        type: type.value,
        host: hostValue.value,
        room: room.value,
        details: details.value,
    };

    try {
        await $.post(API_URL + "events/", body, (data) => {
            const modal = new boosted.Modal("#exampleModal");
            modal.show($("#toggleMyModal")[0]);

            // set modal data
            successModalData.value.message = data.message;
            successModalData.value.status = "success";
            successModalData.value.title = "Event Created";
            successModalData.value.pageLink = `/events/${data.data.id}`;

            visuallyHideModalBackdrop();
        });

        clearInputs();
        clearErrors();
    } catch (error) {
        console.log("Unable to get event: ", error.responseJSON);
        clearErrors();
        displayErrorMessage(error.responseJSON.message);
    }
}

async function putEvent() {
    const body = {
        title: title.value,
        facilitator: facilitator.value,
        start_date: startDate.value,
        end_date: endDate.value,
        type: type.value,
        details: details.value,
    };

    // PUT request to Edit the Event with the given
    // data from the form

    $.ajax({
        url: API_URL + `events/${eventId.value}`,
        type: "PUT",
        data: body,
        success: () => {
            clearInputs();
            clearErrors();

            // redirect the user to the edited event page
            // so they can see the updates
            router.push({
                name: "specific-event",
                params: { id: eventId.value },
            });
        },
        error: (err) => {
            clearErrors();
            displayErrorMessage(err.responseJSON.message);
        },
    });
}

function displayErrorMessage(msg) {
    const tmpMsg = msg.toLowerCase();

    if (tmpMsg.includes("title")) titleError.value = msg;
    else if (tmpMsg.includes("facilitator")) facilitatorError.value = msg;
    else if (tmpMsg.includes("start date")) startDateError.value = msg;
    else if (tmpMsg.includes("end date")) endDateError.value = msg;
    else if (tmpMsg.includes("type")) typeError.value = msg;
    else if (tmpMsg.includes("host")) hostError.value = msg;
    else if (tmpMsg.includes("room")) roomError.value = msg;
    else if (tmpMsg.includes("details")) detailsError.value = msg;
}

function clearInputs() {
    // clear inputs
    title.value = "";
    facilitator.value = "";
    startDate.value = "";
    endDate.value = "";
    type.value = "";
    hosts.value = "";
    room.value = "";
    details.value = "";

    document
        .querySelector(".needs-validation")
        .classList.remove("was-validated");
}

function clearErrors() {
    // clear errors
    titleError.value = "";
    facilitatorError.value = "";
    startDateError.value = "";
    endDateError.value = "";
    typeError.value = "";
    detailsError.value = "";
}

// Lifecycle Hooks
onMounted(async () => {
    // get event to edit if we're trying to edit
    if (mode == "edit") await getEventToEdit();

    ("use strict");

    $(".needs-validation").on(
        "submit",
        (event) => {
            if (!form[0].checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            this.addClass("was-validated");
        },
        false
    );

    hosts.value = await getHosts();
    getRooms();
});

function setMode() {
    return eventId.value ? "edit" : "add";
}

async function getEventToEdit() {
    try {
        $.get(API_URL + `events/${eventId.value}/`, async (data) => {
            const retrievedEvent = data.data[0];

            title.value = retrievedEvent.title;
            type.value = retrievedEvent.type;
            facilitator.value = retrievedEvent.facilitator;
            details.value = retrievedEvent.details;

            // initialize host to edit
            const thisHost = await getHosts(retrievedEvent.host_id);
            hostValue.value = thisHost[0].name;
            hostID.value = thisHost[0].id;

            // initialize room to edit
            getRoomToEdit(retrievedEvent.room_id);

            // format date before setting it as the value
            // start date input field in the form
            startDate.value = new Date(retrievedEvent.start_date)
                .toISOString()
                .split("T")[0];

            // format date before setting it as the value
            // end date input field in the form
            endDate.value = new Date(retrievedEvent.end_date)
                .toISOString()
                .split("T")[0];

            errorGettingEventToEdit.value = false;
        }).fail((error) => {
            console.log("Unable to get event to edit: ", error.responseJSON);
            errorGettingEventToEdit.value = true;
        });
    } catch (error) {
        console.log("Unable to get event to edit: ", error.responseJSON);
        errorGettingEventToEdit.value = true;
    }
}

async function getRoomToEdit(id) {
    try {
        await $.get(
            API_URL + `rooms/${id}`,
            (res) => (room.value = res.data.name)
        );
    } catch (error) {
        console.error(error.responseJSON.message);
    }
}

async function getRooms() {
    try {
        await $.get(API_URL + `rooms`, (res) => (rooms.value = res.data));
    } catch (error) {
        console.error(error.responseJSON.message);
    }
}
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
    padding-top: 2rem;
    gap: 1.5rem;
}

#eventsFormWrapper {
    display: grid;
    grid-template-columns: repeat(2, 0.5fr);
}
</style>
