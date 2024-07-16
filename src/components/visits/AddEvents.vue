<template>
	<Modal :data="alert" />

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
					<form class="row g-3" @submit.prevent="checkParticipantIn">
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
					<button @click="checkParticipantIn" class="btn btn-primary">
						Check In
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- EVENT PARTICIPANTS TABLE -->
	<div id="visit-view" class="d-flex flex-column container">
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
				<div class="dropdown col-md-4">
					<label
						for="selectEventInput"
						class="form-label is-required"
					>
						Select Event:
					</label>

                    <div class="btn-group w-100">
                        <input
                            type="text"
                            class="border form-select dropdown-toggle dropdown-toggle-split"
                            id="selectEventInput"
                            :id="eventID"
                            :value="eventValue"
                            v-model="eventValue"
                            aria-expanded="false"
                            data-bs-toggle="dropdown"
                            autocomplete="off"
                            placeholder="Select Event..."
                        />

                        <ul class="dropdown-menu w-100">
                            <template v-for="event in events">
                                <li
                                    class="dropdown-item"
                                    :value="event.id"
                                    @click="updateEventTerm(event)"
                                >
                                    {{ event.title }}
                                </li>
                            </template>
                            <router-link to="/events/add-event">
                                <li
                                    class="dropdown-item"
                                    style="color: #ff7900"
                                    v-if="!events[index + 1]"
                                >
                                    Create new event
                                </li>
                            </router-link>
                        </ul>
                    </div>
                </div>
            </form>

            <!-- All Participants -->
            <div v-if="showTable" class="container">
                <DataTable
                    :key="dataTableKey"
                    id="eventParticipantsTable"
                    class="display w-100 table"
                    :columns="columns"
                    :options="dataTableOptions"
                    ref="table"
                    v-show="!showError"
                />
                <h3 class="mt-5 text-center fw-bold" v-if="showError">
                    Unable to load event participants, try again!
                </h3>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import Modal from "../Modal.vue";
import {
	registerVisit,
	getSingleVisitor,
	registerVisitor,
	getEvents,
	API_URL,
} from "@/assets/js/index.js";
import $ from "jquery";

import { showModal, removeDuplicateParticipants } from "@/assets/js/util.js";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";

DataTable.use(DataTablesCore);

const table = ref();
const dataTableKey = ref(0);
const showTable = ref(false);
const showError = ref(false);

const eventID = ref("");
const eventValue = ref("");
const eventTem = ref("");

// columns for Data Table
const columns = [
	{ data: "first_name", title: "First name" },
	{ data: "middle_name", title: "Middle name" },
	{ data: "last_name", title: "Last name" },
	{ data: "msisdn", title: "Phone number" },
	{ data: "email", title: "Email" },
	{ data: "address", title: "Address" },
	{
		data: null,
		title: "Visited Today",
		className: "text-center",
		render: (data) => {
			return data.participant_id
				? `<span class="text-success fw-bold">Yes</span>`
				: `<span class="text-danger fw-bold">No</span>`;
		},
	},
];

// Options for Data Table
const dataTableOptions = ref({
    select: true,
    serverSide: true,
    ajax: {
        url: `${API_URL}events/${eventID.value}/participants`,
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
            showError.value = false;

            participants.value = removeDuplicateParticipants(
                json.data.participants
            );

            // fix stop data table from showing NAN error
            json.recordsTotal = json.data.length;
            json.recordsFiltered = json.data.length;

			participants.value = json.data.participants;

            return participants.value;
        },
        error: (error) => {
            console.log("Error fetching data:", error);
            showError.value = true;
        },
    },
    responsive: true,
    lengthMenu: [10, 25, 50, 100],
    language: {
        searchPlaceholder: "Search ...",
        search: "",
        emptyTable: `
			<div class="d-flex flex-column justify-content-center align-items-center gap-3 p-4">
				No Event Participants to show!
				<svg xmlns="http://www.w3.org/2000/svg" style="width: 80px; height: 80px" fill="currentColor" class="solaris-icon si-group" viewBox="0 0 1000 1000">
					<path d="M338 875V696.837A100.18 100.18 0 0 1 263 600V487.5a187.2 187.2 0 0 1 17.626-79.433 166.44 166.44 0 0 1-107.2-45.325A152.94 152.94 0 0 0 88 500v119.118C88 658.1 120.015 690 159 690v185a49.65 49.65 0 0 0 49.588 50h148.57A74.7 74.7 0 0 1 338 875m489.576-512.258a166.44 166.44 0 0 1-107.2 45.325A187.2 187.2 0 0 1 738 487.5V600a100.18 100.18 0 0 1-75 96.837V875a74.7 74.7 0 0 1-19.158 50h148.57A49.65 49.65 0 0 0 842 875V690c38.985 0 71-31.9 71-70.882V500a152.94 152.94 0 0 0-85.424-137.258M713 125a124.4 124.4 0 0 0-65.376 18.446c.9 1.913 1.769 3.84 2.6 5.794a162.38 162.38 0 0 1-24.162 166.435l7.231 3.564a187.9 187.9 0 0 1 66.676 55.086A125 125 0 1 0 713 125m-75 87.5A137.5 137.5 0 1 1 500.5 75 137.5 137.5 0 0 1 638 212.5m-15.763 129.164a177.47 177.47 0 0 1-243.474 0A162.5 162.5 0 0 0 288 487.5V600a75 75 0 0 0 75 75v200a50 50 0 0 0 50 50h175a50 50 0 0 0 50-50V675a75 75 0 0 0 75-75V487.5a162.5 162.5 0 0 0-90.763-145.836m-321.2 32.661a187.9 187.9 0 0 1 66.676-55.086l7.231-3.564A162.7 162.7 0 0 1 350.78 149.24c.827-1.954 1.7-3.881 2.6-5.794A125 125 0 1 0 288 375a126 126 0 0 0 13.035-.675Z" style="fill-rule:evenodd"/>
				</svg>
			</div>
		`,
        zeroRecords: `
			<div class="d-flex flex-column justify-content-center align-items-center gap-3 p-4">
				No match found!
				<svg xmlns="http://www.w3.org/2000/svg" style="width: 80px; height: 80px" fill="currentColor" class="solaris-icon si-group" viewBox="0 0 1000 1000">
					<path d="M338 875V696.837A100.18 100.18 0 0 1 263 600V487.5a187.2 187.2 0 0 1 17.626-79.433 166.44 166.44 0 0 1-107.2-45.325A152.94 152.94 0 0 0 88 500v119.118C88 658.1 120.015 690 159 690v185a49.65 49.65 0 0 0 49.588 50h148.57A74.7 74.7 0 0 1 338 875m489.576-512.258a166.44 166.44 0 0 1-107.2 45.325A187.2 187.2 0 0 1 738 487.5V600a100.18 100.18 0 0 1-75 96.837V875a74.7 74.7 0 0 1-19.158 50h148.57A49.65 49.65 0 0 0 842 875V690c38.985 0 71-31.9 71-70.882V500a152.94 152.94 0 0 0-85.424-137.258M713 125a124.4 124.4 0 0 0-65.376 18.446c.9 1.913 1.769 3.84 2.6 5.794a162.38 162.38 0 0 1-24.162 166.435l7.231 3.564a187.9 187.9 0 0 1 66.676 55.086A125 125 0 1 0 713 125m-75 87.5A137.5 137.5 0 1 1 500.5 75 137.5 137.5 0 0 1 638 212.5m-15.763 129.164a177.47 177.47 0 0 1-243.474 0A162.5 162.5 0 0 0 288 487.5V600a75 75 0 0 0 75 75v200a50 50 0 0 0 50 50h175a50 50 0 0 0 50-50V675a75 75 0 0 0 75-75V487.5a162.5 162.5 0 0 0-90.763-145.836m-321.2 32.661a187.9 187.9 0 0 1 66.676-55.086l7.231-3.564A162.7 162.7 0 0 1 350.78 149.24c.827-1.954 1.7-3.881 2.6-5.794A125 125 0 1 0 288 375a126 126 0 0 0 13.035-.675Z" style="fill-rule:evenodd"/>
				</svg>
			</div>
		`,
		loadingRecords: `
			<div class="d-flex justify-content-center p-4">
				<div class="spinner-border" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		`,
    },
    createdRow: (row, data) => {
        // add event listener on each row
        $(row).on("click", () => {
            // only check the participant in if they don't have
            // a departure_time, meaning they either haven't checked in
            // or they have checked out already
            // in this case, if they checked in earlier and checked out for some
            // reason, they can still check back in, but not if they weren't checked out
            if (data && data.participant_id && !data.visit_departure_time) {
                // inform user visitor is still checked in
                showModal();

                pageLink.value = "/visits";
                title.value = "Visitor is still checked in";
                status.value = "warning";
            } else {
                // otherwise check visitor in
                participantDetail(data.id);
            }
        });
    },
    destroy: true,
    order: [[0, "desc"]],
});

// visit creation data
const participant_id = ref("");
const msisdn = ref("");
const visitorId = ref("");
const host_id = ref("");
const room_id = ref("");
const institution = ref("");
const address = ref("");
const purpose = ref("");
const belongings = ref([]);
const room = ref("");

// Modal Data
const alert = ref({
	status: "",
	title: "",
	message: "",
	pageLink: "",
});

// others
const visitor = ref("");
const participants = ref([]);
const participant = ref("");
const temBelonging = ref("");
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

	await getEventsOptions();
});

const updateEventTerm = (event) => {
	purpose.value = event.title;
	eventValue.value = event.title;
	eventID.value = event.id;

	// destroy table
	$("eventParticipantsTable").DataTable().destroy();

	// update api url in options object
	dataTableOptions.value.ajax.url = `${API_URL}/events/${eventID.value}/participants`;

    // reload the table with the new url
    dataTableKey.value += 1;

	const selectedHost = events.value.find((val) => val.id === eventID.value);

	if (selectedHost) {
		room.value = selectedHost.room;
	}

    // display data table if it's not already displayed
    if (showTable.value == false) showTable.value = true;
};

// function for inserting each username in the select element
const getEventsOptions = async () => {
	try {
		events.value = await getEvents();

		events.value = events.value.events.map((event) => ({
			id: event.id,
			title: event.title,
			room_id: event.room_id,
		}));

		eventTem.value = events.value;
	} catch (error) {
		console.error("Error retrieving users:", error);
	}
};

// function to validate form before it submit the form
const checkParticipantIn = async () => {
	if (!msisdn.value || !visitor.value || !purpose.value || !room_id.value) {
		return;
	}

	document.body.removeAttribute("style");

	// require values for the submittion of the form
	const visitData = {
		visitor_id: visitorId.value,
		institution: institution.value,
		items: belongings.value,
		room_id: room_id.value,
		host_id: host_id.value,
		purpose: purpose.value,
		participant_id: participant_id.value,
	};

	const response = await registerVisit(visitData);

    // reload data table to update the departure time of the
    // participant that was just checked in
    dataTableKey.value += 1;

    showModal("#alertModal", "#alertModalBody");
    status.value = response.ok ? "success" : "danger";
    title.value = response.result.message;
    pageLink.value = `/visits`;

	if (response.ok) {
		const visitModal = document.querySelector("#visitModal");
		visitModal.classList.remove("show");
		visitModal.style.display = "none";

		// Update visitor status for last visit
		updateVisitorVisit();

		// Reset form if the response is successful
		resetForm();
	}
};

const resetForm = () => {
	visitor.value = "";
	msisdn.value = "";
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

	// find the specific participant being checked in
	const participant = participants.value.find((val) => val.id === id);

	// assign participant id for visit checking in
	participant_id.value = participant.id;

	// check if the visitor exists
	let visitorData = await getSingleVisitor({ msisdn: participant.msisdn });

	// create visitor if this participant is not already a participant
	if (!visitorData) {
		visitorData = await registerVisitor({
			first_name: participant.first_name,
			middle_name: participant.middle_name,
			last_name: participant.last_name,
			email: participant.email,
			msisdn: participant.msisdn,
			address: address.value,
		});
	}

	// add first name, add middle name if the visitor has one, and add last name
	visitor.value = `${visitorData.first_name}${
		visitorData.middle_name ? visitorData.middle_name + " " : ""
	} ${visitorData.last_name}`;

	visitorId.value = visitorData.id;
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

function setEventListenerOnParticipantRows() {
	const dt = table.value.dt;

    // Handle row click event
    dt.on("click", "tr", function () {});
}

const updateVisitorVisit = () => {
	const tr = participant.value;
	if (!tr) return;

	const visitedToday = $(tr).children("td")[6];
	$(visitedToday).html(`<span class="text-success fw-bold">Yes</span>`);

	// Reset for new participant.
	participant.value = "";
};

watch(
	() => eventValue.value,
	(n) => {
		events.value = n
			? eventTem.value.filter((event) =>
					event.title
						.toLocaleLowerCase()
						.includes(n.toLocaleLowerCase())
			  )
			: eventTem.value;
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
