<template>
    <Modal :data="{ title, message, status }" />

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
            <div class="modal-content">
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
                    <form class="row g-3" @submit.prevent="onSubmit">
                        <div class="">
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
                        <div class="">
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
                    </form>
                </div>
                <div class="modal-footer">
                    <button
                        type="submit"
                        @click="onSubmit"
                        class="btn btn-primary"
                    >
                        Check In
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- EVENT LIST -->
    <div
        id="visit-view"
        class="d-flex flex-column container"
        style="padding-top: 2rem"
    >
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
            style="margin-top: 0.3rem"
        >
            <BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
        </div>

        <div
            class="mt-4 p-0 d-flex flex-column"
            style="border: none; background-color: transparent; gap: 3rem"
        >
            <form class="row g-3">
                <div class="dropdown" style="width: 42.5%">
                    <label for="typeInput" class="form-label is-required">
                        Select Event:
                    </label>
                    <input
                        type="text"
                        class="form-control"
                        id="host"
                        :id="eventID"
                        :value="eventValue"
                        aria-expanded="false"
                        data-bs-toggle="dropdown"
                        autocomplete="off"
                    />
                    <ul class="dropdown-menu" style="width: 96.5%">
                        <template v-for="(option, index) in options">
                            <li
                                class="dropdown-item"
                                :value="option.id"
                                @click="updateEventTerm(option)"
                            >
                                {{ option.text }}
                            </li>
                        </template>
                        <router-link :to="{ name: 'add-event' }">
                            <li
                                class="dropdown-item"
                                style="color: #ff7900"
                                v-if="!options[index + 1]"
                            >
                                Create new event
                            </li>
                        </router-link>
                    </ul>
                </div>
            </form>

            <!-- All Participants -->
            <div class="container">
                <table
                    id="participantsTable"
                    class="table table-striped w-100"
                ></table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import Modal from "../Modal.vue";
import {
    registerVisit,
    getSingleVisitor,
    registerVisitor,
    getEvents,
    getParticipants,
} from "@/assets/js/index.js";
import { useRouter } from "vue-router";

import { showModal } from "@/assets/js/util";
import DataTables from "datatables.net-dt";
import "datatables.net-responsive-dt";

const msisdn = ref("");
const visitor = ref("");
const visitorId = ref("");
const events = ref(null);
const belongings = ref([]);
const temBelonging = ref("");
const options = ref([]);
const eventValue = ref("");
const eventID = ref("");
const host_id = ref("");
const room_id = ref("");
const room = ref("");
const institution = ref("");
const address = ref("");
const purpose = ref("");
const status = ref("");
const message = ref("");
const title = ref("");

const loader = ref(false);

const participants = ref([]);
const dataTable = ref(null);
const MAX_DETAIL_LEN = 30;

const activeBreadCrumbs = ref([]);
const router = useRouter();

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});

activeBreadCrumbs.value = [...props.breadCrumbs, "visit-checkin"];

onMounted(() => {
    (() => {
        "use strict";

        const forms = document.querySelectorAll(".needs-validation");

        Array.prototype.slice.call(forms).forEach((form) => {
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
    })();
});

const updateEventTerm = (host) => {
    eventValue.value = host.text;
    eventID.value = host.value;
    purpose.value = host.text;

    const selectedHost = events.value.find((val) => val.id === eventID.value);

    if (selectedHost) {
        room.value = selectedHost.room;
    }
};

// function for inserting each username in the select element
const getEventsOptions = async () => {
    try {
        events.value = await getEvents();

        options.value = events.value.map((event) => ({
            value: event.id,
            text: event.title,
        }));
    } catch (error) {
        console.error("Error retrieving users:", error);
    }
};

// function to validate form before it submit the form
const onSubmit = async (event) => {
    if (
        !msisdn.value ||
        !visitor.value ||
        !purpose.value ||
        !room.value ||
        !address.value ||
        event.type === "submit"
    ) {
        return;
    }

    document.body.removeAttribute("style");

    // require values for the submittion of the form
    const visitData = {
        visitor_id: visitorId.value,
        institution: institution.value,
        address: address.value,
        items: belongings.value,
        room_id: room_id.value,
        host_id: host_id.value,
        purpose: purpose.value,
    };

    const response = await registerVisit(visitData);

    showModal("#alertModal", "#alertModalBody");
    status.value = response.ok ? "success" : "danger";
    message.value = response.result.message;
    title.value = response.ok ? "Success" : "Error";

    // Reset form if the response is successful
    if (response.ok) {
        const visitModal = document.querySelector("#visitModal");
        visitModal.classList.remove("show");
        visitModal.style.display = "none";
        resetForm();
    }
};

const resetForm = () => {
    visitor.value = "";
    msisdn.value = "";
    address.value = "";
    eventValue.value = "";
    belongings.value = [];
    temBelonging.value = "";
    institution.value = "";
};

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

const participantDetail = async (id) => {
    showModal("#visitModal", "#modal-dialog");
    const event = events.value.find((val) => val.id === eventID.value);

    const participant = participants.value.find((val) => val.id === id);
    let visitorData = await getSingleVisitor({ msisdn: participant.msisdn });

    if (!visitorData) {
        const data = await registerVisitor({
            first_name: participant.first_name,
            middle_name: participant.middle_name,
            last_name: participant.last_name,
            email: participant.email,
            msisdn: participant.msisdn,
            address: participant.address,
        });
        visitorData = data.result.data[0];
    }

    visitorId.value = visitorData.id;
    visitor.value = `${visitorData.first_name} ${visitorData.last_name}`;
    msisdn.value = visitorData.msisdn;
    room_id.value = event.room_id;
    host_id.value = event.host_id;
    address.value = participant.address;
};

function formatAddress(address) {
    if (!address) {
        return "";
    }
    const addressLen = address.length;
    const newAddress =
        addressLen >= MAX_DETAIL_LEN
            ? `${address.slice(0, MAX_DETAIL_LEN)}...`
            : address;

    return newAddress;
}

const initializeDataTable = () => {
    dataTable.value = new DataTables("#participantsTable", {
        serverSide: true,
        ajax: {
            url: `http://localhost:3000/api/events/${id.value}/participants`,
            type: "GET",
            data: (query) => {
                return {
                    start: query.start,
                    limit: query.length,
                    search: query.search.value,
                    sort: query.columns[query.order[0].column].data,
                    direction: query.order[0].dir,
                };
            },
            dataSrc: (json) => {
                participants.value = json.data;
                participants.value.forEach((visitor) => {
                    visitor.address = formatAddress(visitor.address);
                });
                return participants.value;
            },
            error: (xhr, error, thrown) => {
                console.log("Error fetching data:", error);
            },
        },
        columns: [
            { data: "first_name", title: "First name" },
            { data: "middle_name", title: "Middle name" },
            { data: "last_name", title: "Last name" },
            { data: "msisdn", title: "Phone number" },
            { data: "email", title: "Email" },
            { data: "address", title: "Address" },
        ],
        responsive: true,
        lengthMenu: [10, 25, 50, 100],
        language: {
            searchPlaceholder: "Search ...",
            search: "",
        },
    });

    // Handle row click event
    dataTable.value.on("click", "tr", function () {
        const rowData = dataTable.value.row(this).data();
        if (rowData) {
            visitorDetail(rowData.id);
        }
    });
};

onMounted(() => {
    initializeDataTable();
});
</script>

<style scoped>
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
.form-select {
    padding: calc(1rem - 1px) 1rem calc(0.5rem + 1px);
}

.modal {
    background-color: #1616157a;
}
</style>
