<template>
    <Modal :data="{ title, message, status }" />
    <div id="visit-view" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto my-4"
        >
            <BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
        </div>

        <div
            class="mt-4 p-0 d-flex flex-column"
            style="border: none; background-color: transparent; gap: 3rem"
        >
            <form @submit.prevent class="row g-3">
                <div class="dropdown" style="width: 42.5%">
                    <label for="typeInput" class="form-label is-required">
                        Event
                        <span class="visually-hidden">(required)</span>
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
                        required
                    />
                    <ul class="dropdown-menu" style="width: 96.5%">
                        <template v-for="option in options">
                            <li
                                class="dropdown-item"
                                style="cursor: pointer"
                                :value="option.id"
                                @click="updateHostTerm(option)"
                            >
                                {{ option.text }}
                            </li>
                            <router-link :to="{ name: 'add-event' }">
                                <li
                                    class="dropdown-item"
                                    v-if="!options[index + 1]"
                                >
                                    Create new event
                                </li>
                            </router-link>
                        </template>
                    </ul>
                </div>

            <!-- All Participants -->
            <div
                v-show="Array.isArray(participants) && participants.length"
                class="container"
            >
                <table
                    id="participantsTable"
                    class="table table-striped w-100"
                ></table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import Modal from "../Modal.vue";
import {
    registerVisit,
    getSingleVisitor,
    getEvents,
} from "@/assets/js/index.js";
import { useRouter } from "vue-router";

import { showModal } from "@/assets/js/util";
import DataTables from "datatables.net-dt";
import "datatables.net-responsive-dt";

const router = useRouter();

const msisdn = ref("");
const visitor = ref("");
const visitorId = ref("");
const events = ref(null);
const belongings = ref([]);
const temBelonging = ref("");
const options = ref([]);
const eventValue = ref("");
const eventID = ref(router.currentRoute.value.params.id);
const host_id = ref("");
const room_id = ref("");
const room = ref("");
const institution = ref("");
const address = ref("");
const purpose = ref("");
const status = ref("");
const message = ref("");
const title = ref("");

const participants = ref([]);
const dataTable = ref(null);
const MAX_DETAIL_LEN = 30;

const activeBreadCrumbs = ref([]);

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});

activeBreadCrumbs.value = [...props.breadCrumbs, "visit-checkin"];

onMounted(async () => {
    await getEventsOptions();

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
    getEventsOptions();
});

const updateEventTerm = (eventNameAndId) => {
    console.log({ eventNameAndId });
    eventValue.value = eventNameAndId.text;
    eventID.value = eventNameAndId.value;
    purpose.value = eventNameAndId.text;

    const selectedHost = events.value.find((val) => val.id === eventID.value);

    if (selectedHost) {
        room.value = selectedHost.room;
    }

    eventID.value = eventNameAndId.value;
    initializeDataTable();
    console.log({ eventID });
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

// function to get visitor bt MSISDN
const getVisitor = async () => {
    try {
        const visitorData = await getSingleVisitor({ msisdn: msisdn.value });
        if (!visitorData) {
            visitor.value = "";
            return;
        }
        visitor.value = `${visitorData.first_name} ${visitorData.last_name}`;
        visitorId.value = visitorData.id;
    } catch (error) {
        console.error("Error retrieving visitor:", error);
    }
};

// watching selected host name to update host ID
watch(purpose, (title) => {
    const selectedEvent = events.value.find((event) => event.title === title);
    if (selectedEvent) {
        host_id.value = selectedEvent.host_id;
        room_id.value = selectedEvent.room_id;
        room.value = selectedEvent.room;
    }
});

// function to validate form before it submit the form
const onSubmit = async () => {
    if (
        !msisdn.value ||
        !visitor.value ||
        !purpose.value ||
        !room.value ||
        !address.value
    ) {
        return;
    }

    // plitting text into array by using command as the deleminator
    const items = belonging.value.split(",").map((item) => item.trim());

    // require values for the submittion of the form
    const visitData = {
        visitor_id: visitorId.value,
        institution: institution.value,
        address: address.value,
        items,
        room_id: room_id.value,
        host_id: host_id.value,
        purpose: purpose.value,
    };

    const response = await registerVisit(visitData);

    const myModal = new boosted.Modal("#exampleModal", { backdrop: true });
    myModal.show(document.querySelector("#toggleMyModal"));
    status.value = response.ok ? "success" : "danger";
    message.value = response.result.message;
    title.value = response.ok ? "Success" : "Error";

    visuallyHideModalBackdrop();

    // Reset form if the response is successful
    if (response.ok) {
        resetForm();
    }
};

function visuallyHideModalBackdrop() {
    const modalsBackdrops = document.querySelectorAll(".modal-backdrop");

    if (modalsBackdrops.length) {
        modalsBackdrops.forEach((modal) =>
            modal.classList.add("visually-hidden")
        );
    }
}

const resetForm = () => {
    visitor.value = "";
    purpose.value = "";
    room.value = "";
    msisdn.value = "";
    address.value = "";
    eventValue.value = "";
    belonging.value = "";
    institution.value = "";

    // Remove validation classes
    const form = document.querySelector(".needs-validation");
    form.classList.remove("was-validated");
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
		});
		visitorData = data.result.data[0];
	}

	visitorId.value = visitorData.id;
	visitor.value = `${visitorData.first_name} ${visitorData.last_name}`;
	msisdn.value = visitorData.msisdn;
	room_id.value = event.room_id;
	host_id.value = event.host_id;
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
    console.log({ eventID });
    dataTable.value = new DataTables("#participantsTable", {
        serverSide: true,
        ajax: {
            url: `http://localhost:3000/api/events/${eventID.value}/participants`,
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
            error: (error) => {
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
            participantDetail(rowData.id);
        }
    });
};
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
