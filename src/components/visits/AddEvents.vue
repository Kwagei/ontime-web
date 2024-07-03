<template>
    <Modal :data="{ title, message, status }" />
    <div id="visit-view" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto my-4"
        >
            <BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
        </div>

        <div class="mt-0 p-4 form-control input">
            <form
                class="row g-3 needs-validation"
                novalidate
                @submit.prevent="onSubmit"
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
                            @blur="getVisitor"
                            type="text"
                            class="form-control"
                            v-model="msisdn"
                            id="validationCustomVisitorNumber"
                            aria-describedby="inputGroupPrepend"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide a valid phone number.
                        </div>
                    </div>
                </div>

                <!-- VISITOR -->
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

                <!-- Host -->
                <div class="dropdown col-md-6">
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
                    <ul class="dropdown-menu" style="width: 97%">
                        <template v-for="(option, index) in options">
                            <li
                                class="dropdown-item"
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
                            class="form-control"
                            id="validationCustomRoom"
                            v-model="room"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide a room name.
                        </div>
                    </div>
                </div>

                <!-- Belonging -->
                <div class="col-md-6">
                    <label for="validationCustomBelonging" class="form-label">
                        Items
                    </label>
                    <div class="input-group">
                        <input
                            type="text"
                            class="form-control"
                            id="validationCustomBelonging"
                            v-model="belonging"
                        />
                    </div>
                </div>

                <!-- Institution -->
                <div class="col-md-6">
                    <label for="validationCustomInstitution" class="form-label">
                        Institution<span class="visually-hidden"
                            >(required)</span
                        >
                    </label>
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="validationCustomInstitution"
                            v-model="institution"
                        />
                    </div>
                </div>

                <!-- Address -->
                <div class="col-md-6">
                    <label
                        for="validationCustomAddress"
                        class="form-label is-required"
                    >
                        Address<span class="visually-hidden">(required)</span>
                    </label>
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="validationCustomAddress"
                            v-model="address"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide an address.
                        </div>
                    </div>
                </div>

                <!-- Submit and Cancel Buttons -->
                <div class="col-12 d-flex gap-3">
                    <button class="px-5 btn btn-primary" type="submit">
                        Save
                    </button>
                    <button
                        class="px-5 btn btn-secondary"
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
import { ref, watch, onMounted } from "vue";
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
    getEventsOptions();
});

const updateHostTerm = (host) => {
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

const initializeDataTable = (id) => {
	dataTable.value = new DataTables("#participantsTable", {
		serverSide: true,
		ajax: {
			url: `http://localhost:3000/api/events/${id}/participants`,
			type: "GET",
			data: (query) => {
				return {
					start: query.start,
					limit: query.length,
					search: query.search.value,
					sort: query.columns[query.order[0].column].data,
					order: query.order[0].dir,
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
			zeroRecords: `<div class="d-flex flex-column justify-content-center align-items-center gap-3 p-4" >
                    <svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M33.8 87.5V69.684A10.02 10.02 0 0126.3 60V48.75a18.7 18.7 0 011.763-7.943 16.64 16.64 0 01-10.72-4.533A15.29 15.29 0 008.8 50v11.912C8.8 65.81 12.001 69 15.9 69v18.5a4.965 4.965 0 004.959 5h14.857a7.47 7.47 0 01-1.916-5m48.958-51.226a16.64 16.64 0 01-10.72 4.533A18.7 18.7 0 0173.8 48.75V60a10.02 10.02 0 01-7.5 9.684V87.5a7.47 7.47 0 01-1.916 5h14.857a4.965 4.965 0 004.959-5V69c3.899 0 7.1-3.19 7.1-7.088V50a15.29 15.29 0 00-8.542-13.726M71.3 12.5a12.44 12.44 0 00-6.538 1.845q.135.286.26.579a16.24 16.24 0 01-2.416 16.644l.723.356a18.8 18.8 0 016.668 5.509A12.5 12.5 0 1071.3 12.5m-7.5 8.75A13.75 13.75 0 1150.05 7.5 13.75 13.75 0 0163.8 21.25m-1.576 12.916a17.747 17.747 0 01-24.348 0A16.25 16.25 0 0028.8 48.75V60a7.5 7.5 0 007.5 7.5v20a5 5 0 005 5h17.5a5 5 0 005-5v-20a7.5 7.5 0 007.5-7.5V48.75a16.25 16.25 0 00-9.076-14.584m-32.12 3.266a18.8 18.8 0 016.667-5.508l.723-.357a16.27 16.27 0 01-2.416-16.643q.125-.292.26-.58A12.5 12.5 0 1028.8 37.5a13 13 0 001.304-.067Z"/></svg>
                    No participants for this event
                </div>`,
		},
		destroy: true,
		order: [[0, "desc"]],
	});

	// Handle row click event
	dataTable.value.on("click", "tr", function () {
		const rowData = dataTable.value.row(this).data();
		if (rowData) {
			participantDetail(rowData.id);
		}
	});
};

onMounted(async () => {
	await getEventsOptions();
});

watch(
	() => eventID.value,
	(n) => {
		console.log({ n });

		initializeDataTable(n);
	}
);
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
