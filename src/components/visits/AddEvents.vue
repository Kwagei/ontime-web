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

					<div class="w-100 position-relative">
						<input
							type="text"
							class="form-select dropdown-toggle dropdown-toggle-split"
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

import { showModal } from "@/assets/js/util";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";

DataTable.use(DataTablesCore);

const table = ref();
const showTable = ref(false);
const showError = ref(false);
const dataTableKey = ref(0);

// Events Data
const events = ref([]);
const eventID = ref("");
const eventValue = ref("");
const eventTem = ref("");

// columns for Data Table
const columns = [
	{ data: "created_at", visible: false },
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

			json.recordsTotal = json.data.length;
			json.recordsFiltered = json.data.length;

			participants.value = json.data.participants;

			participants.value.forEach((visitor) => {
				visitor.address = formatAddress(visitor.address);
			});

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
			<div class="d-flex flex-column justify-content-center align-items-center gap-3 p-4" >
				<svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M33.8 87.5V69.684A10.02 10.02 0 0126.3 60V48.75a18.7 18.7 0 011.763-7.943 16.64 16.64 0 01-10.72-4.533A15.29 15.29 0 008.8 50v11.912C8.8 65.81 12.001 69 15.9 69v18.5a4.965 4.965 0 004.959 5h14.857a7.47 7.47 0 01-1.916-5m48.958-51.226a16.64 16.64 0 01-10.72 4.533A18.7 18.7 0 0173.8 48.75V60a10.02 10.02 0 01-7.5 9.684V87.5a7.47 7.47 0 01-1.916 5h14.857a4.965 4.965 0 004.959-5V69c3.899 0 7.1-3.19 7.1-7.088V50a15.29 15.29 0 00-8.542-13.726M71.3 12.5a12.44 12.44 0 00-6.538 1.845q.135.286.26.579a16.24 16.24 0 01-2.416 16.644l.723.356a18.8 18.8 0 016.668 5.509A12.5 12.5 0 1071.3 12.5m-7.5 8.75A13.75 13.75 0 1150.05 7.5 13.75 13.75 0 0163.8 21.25m-1.576 12.916a17.747 17.747 0 01-24.348 0A16.25 16.25 0 0028.8 48.75V60a7.5 7.5 0 007.5 7.5v20a5 5 0 005 5h17.5a5 5 0 005-5v-20a7.5 7.5 0 007.5-7.5V48.75a16.25 16.25 0 00-9.076-14.584m-32.12 3.266a18.8 18.8 0 016.667-5.508l.723-.357a16.27 16.27 0 01-2.416-16.643q.125-.292.26-.58A12.5 12.5 0 1028.8 37.5a13 13 0 001.304-.067Z"/></svg>
				No participants for this event
			</div>
		`,
		zeroRecords: `
			<div class="d-flex flex-column justify-content-center align-items-center gap-3 p-4" >
				<svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M33.8 87.5V69.684A10.02 10.02 0 0126.3 60V48.75a18.7 18.7 0 011.763-7.943 16.64 16.64 0 01-10.72-4.533A15.29 15.29 0 008.8 50v11.912C8.8 65.81 12.001 69 15.9 69v18.5a4.965 4.965 0 004.959 5h14.857a7.47 7.47 0 01-1.916-5m48.958-51.226a16.64 16.64 0 01-10.72 4.533A18.7 18.7 0 0173.8 48.75V60a10.02 10.02 0 01-7.5 9.684V87.5a7.47 7.47 0 01-1.916 5h14.857a4.965 4.965 0 004.959-5V69c3.899 0 7.1-3.19 7.1-7.088V50a15.29 15.29 0 00-8.542-13.726M71.3 12.5a12.44 12.44 0 00-6.538 1.845q.135.286.26.579a16.24 16.24 0 01-2.416 16.644l.723.356a18.8 18.8 0 016.668 5.509A12.5 12.5 0 1071.3 12.5m-7.5 8.75A13.75 13.75 0 1150.05 7.5 13.75 13.75 0 0163.8 21.25m-1.576 12.916a17.747 17.747 0 01-24.348 0A16.25 16.25 0 0028.8 48.75V60a7.5 7.5 0 007.5 7.5v20a5 5 0 005 5h17.5a5 5 0 005-5v-20a7.5 7.5 0 007.5-7.5V48.75a16.25 16.25 0 00-9.076-14.584m-32.12 3.266a18.8 18.8 0 016.667-5.508l.723-.357a16.27 16.27 0 01-2.416-16.643q.125-.292.26-.58A12.5 12.5 0 1028.8 37.5a13 13 0 001.304-.067Z"/></svg>
				No participants for this event
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
		$(row).on("click", () => {
			if (data && data.participant_id && !data.visit_departure_time) {
				// inform user visitor is still checked in
				showModal("#alertModal", "#alertModalBody");

				alert.value.status = "warning";
				alert.value.message = `Visitor ${data.first_name} ${data.last_name} is still checked in`;
				alert.value.pageLink = `/visits`;
			} else {
				// otherwise check visitor in
				participantDetail(data.id);

				participant.value = row;
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
			host_id: event.host_id,
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

	// Required values for checking a visitor in
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

	// Reload data table to update the departure time of the participant that was just checked in
	dataTableKey.value += 1;

	showModal("#alertModal", "#alertModalBody");
	alert.value.status = response.ok ? "success" : "danger";
	alert.value.message = response.result.message;
	alert.value.pageLink = `/visits`;

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

	// Find the specific participant being checked in
	const participant = participants.value.find((val) => val.id === id);

	// Assign participant id for visit checking in
	participant_id.value = participant.id;

	// Check if the visitor exists
	let visitorData = await getSingleVisitor({ msisdn: participant.msisdn });

	// Create visitor if this participant is not already a visitor.
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

	visitorData = visitorData.result.data[0];

	// Add first name, add middle name if the visitor has one, and add last name
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
