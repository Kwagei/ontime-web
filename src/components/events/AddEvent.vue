<template>
    <Modal :data="alert" />
    <div id="eventsWrapper" class="d-flex flex-column container">
        <div class="d-flex justify-content-between">
            <div>
                <BreadCrumbs v-model:breadCrumbs="activeBreadCrumbs" />
            </div>
        </div>

        <h3
            v-if="errorGettingEventToEdit"
            class="text-center mt-3 d-flex align-items-center flex-column text-danger"
            style="margin-bottom: -21px"
        >
            Error getting event to edit, please try again!
            <hr class="text-center w-75" />
        </h3>

        <div class="form-control input" style="margin: auto; padding: 3rem">
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

                <div class="col-md-12 d-flex gap-3">
                    <button
                        type="submit"
                        class="btn btn-primary px-5"
                        style="margin-left: auto"
                    >
                        Save
                    </button>
                    <button
                        @click="router.back()"
                        class="btn btn-secondary px-5"
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

import { API_URL, getHosts, getRooms } from "../../assets/js/index.js";

import BreadCrumbs from "../BreadCrumbs.vue";
import Modal from "../Modal.vue";
import { useRouter } from "vue-router";
import { showModal } from "@/assets/js/util.js";

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
const hostsTem = ref("");

// Event types
const eventTypes = ["Course", "Conference", "Workshop", "Hackathon"];

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

const updateRoomTerm = (room) => {
    roomValue.value = room.name;
    roomID.value = room.id;
};

const updateEventTerm = (et) => {
    type.value = et;
};

// Local search for host
watch(
    () => hostValue.value,
    (n) => {
        hostsData.value = n
            ? hostsTem.value.filter((host) =>
                  host.name.toLocaleLowerCase().includes(n.toLocaleLowerCase())
              )
            : hostsTem.value;
    }
);

/**
 * Commented because it's causing the list of rooms
 * not to show when editing an Event
 */
// Local search for rooms
// watch(
//     () => roomValue.value,
//     (n) => {
//         roomsData.value = n
//             ? roomTem.value.filter((room) =>
//                   room.name.toLocaleLowerCase().includes(n.toLocaleLowerCase())
//               )
//             : roomTem.value;
//     }
// );

const onSubmit = async () => {
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
        success: (data) => {
            showModal("#alertModal", "#alertModalBody");

            alert.value.status = "success";
            alert.value.message = data.message;
            alert.value.pageLink = `/events/${
                data.data.length ? data.data[0].id : data.data.id
            }`;

            resetForm();
        },
        error: (error) => {
            showModal("#alertModal", "#alertModalBody");
            alert.value.status = "danger";
            alert.value.message = error.responseJSON.message;
        },
    });
};

function resetForm() {
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
    const form = document.querySelector(".needs-validation");
    form.classList.remove("was-validated");
}

// Lifecycle Hooks
onMounted(async () => {
    // get event to edit if we're trying to edit

    const { hosts } = await getHosts();
    hostsData.value = hosts;
    hostsTem.value = hosts;

    const { rooms } = await getRooms();
    roomsData.value = rooms;
    console.log("roomsData: ", roomsData.value);
    roomTem.value = rooms;

    if (mode == "edit") await getEventToEdit();

    ("use strict");

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

function setMode() {
    return eventId.value ? "edit" : "add";
}

async function getEventToEdit() {
    try {
        $.get(API_URL + `events/${eventId.value}/`, (data) => {
            const retrievedEvent = data.data[0];

            title.value = retrievedEvent.title;
            type.value = retrievedEvent.type;
            facilitator.value = retrievedEvent.facilitator;
            details.value = retrievedEvent.details;
            hostValue.value = retrievedEvent.host;
            hostID.value = retrievedEvent.host_id;
            roomValue.value = retrievedEvent.room;
            roomID.value = retrievedEvent.room_id;

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
        console.log("Error getting event to edit: ", error.responseJSON);
        errorGettingEventToEdit.value = true;
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
    gap: 1.5rem;
}
</style>
