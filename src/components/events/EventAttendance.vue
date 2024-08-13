<template>
	<div class="d-flex justify-content-between align-items-center gap-5 mt-3">
		<div class="d-flex align-items-center gap-4">
			<BackArrow @click="$emit('switch', 'details')" />
			<BreadCrumbs
				:breadCrumbs="['events', eventId, 'Today\'s Attendance']"
			/>
		</div>
		<div class="d-flex" style="gap: 0.521rem">
			<div class="dropdown">
				<Options />
				<ul class="dropdown-menu boxShadow rounded">
					<li
						@click="exportEventsAttendance"
						id="export"
						class="dropdown-item"
					>
						Export
					</li>
				</ul>
			</div>

			<router-link to="/visits/purpose-event">
				<button class="btn btn-secondary">Check In</button>
			</router-link>

			<button
				class="btn btn-primary"
				id="addParticipantBtn"
				@click="$emit('switch', 'addParticipant')"
			>
				<Icons v-model:icon="plusIcon" />
				New
			</button>
		</div>
	</div>

	<div class="d-flex justify-content-center gap-3 mt-2">
		<div class="pt-2 w-100">
			<DataTable
				class="display w-100 table"
				:columns="columns"
				:options="options"
				ref="table"
				v-if="!showError"
			/>
			<h3 class="mt-5 text-center fw-bold" v-if="showError">
				Unable to load event participants, try again!
			</h3>
		</div>
	</div>
</template>

<script setup>
import BackArrow from "../BackArrow.vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import { API_URL, csvExport } from "@/assets/js";

import { ref } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";
import { formatDateTime } from "@/assets/js/util";
import { RouterLink } from "vue-router";
import Options from "../Options.vue";
import Icons from "../Icons.vue";
const plusIcon = "add";

const props = defineProps({
	eventId: String,
});

const eventId = ref(props.eventId);
const showError = ref(false);
const attendanceList = ref("");

DataTable.use(DataTablesCore);

const columns = [
	{ data: "first_name", title: "First Name" },
	{ data: "last_name", title: "Last Name" },
	{ data: "msisdn", title: "Contact" },
	{ data: "address", title: "Address" },
	{ data: "visit_date_time", title: "Time In" },
	{ data: "visit_departure_time", title: "Time Out" },
	{ data: "items", title: "Items" },
];

const options = {
	responsive: true,
	select: true,
	serverSide: true,
	ajax: {
		url: `${API_URL}events/${eventId.value}/participants/`,
		type: "GET",
		data: (query) => {
			const order =
				query.columns[query.order[0].column].data === "date"
					? "date_time"
					: query.columns[query.order[0].column].data;

			return {
				start: query.start,
				limit: query.length,
				search: query.search.value,
				sort: order,
				direction: query.order[0].dir,
			};
		},
		dataSrc: (json) => {
			const { participants } = json.data;

			// format each participant record
			participants.forEach((participant) => {
				participant.msisdn = participant.msisdn
					? `0${participant.msisdn.slice(3)}`
					: "";

				// format visit date time or arrival time if any
				if (participant.visit_date_time) {
					participant.visit_date_time = formatDateTime(
						participant.visit_date_time,
						{
							time: true,
						}
					);
				}

				// format departure time if any
				if (participant.visit_departure_time) {
					// Destructuring the hour, minutes and seconds from the departure time.
					const [hour, minutes, seconds] =
						participant.visit_departure_time.split(":");

					// Create a custom date and add the departure time to be able to format the date time to get only time format
					const departure_time = new Date();
					departure_time.setHours(hour, minutes, seconds);

					participant.visit_departure_time = formatDateTime(
						departure_time,
						{
							time: true,
						}
					);
				}

				// format items if any
				participant.items = participant.items
					? participant.items.join(", ")
					: "";
			});

			// filter by participant_id from visits table to only display
			// participants who have visited today
			const attendees = participants.filter(
				(participant) => participant.participant_id
			);

			json.recordsTotal = attendees.length;
			json.recordsFiltered = attendees.length;

			attendanceList.value = attendees;
			return attendees;
		},
		error: (error) => {
			console.log("Error fetching data:", error.responseJSON);
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
				<button
					class="btn btn-secondary"
					onclick="document.getElementById('addParticipantBtn').click()"
				>
					Add Participant
				</button>
			</div>
        `,
		zeroRecords: `
			<div class="d-flex flex-column justify-content-center align-items-center gap-3 p-4">
				No Attendees for Today!
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
	order: [[2, "desc"]],
	destroy: true,
};

const table = ref();

const exportEventsAttendance = () => {
	csvExport(
		attendanceList.value.map((attendee) => {
			const { visit_date_time: time_in, visit_departure_time: time_out } =
				attendee;

			const date = formatDateTime(attendee.date_time, { date: true });

			delete attendee.created_at;
			delete attendee.participant_id;
			delete attendee.event_id;
			delete attendee.visit_date_time;
			delete attendee.date_time;
			delete attendee.visit_departure_time;
			return { ...attendee, time_in, time_out, date };
		})
	);
};
</script>

<style scoped>
svg {
	height: 20px !important;
	margin: 0 !important;
}

li {
	font-size: 1rem;
	font-weight: 600;
	padding: 0.75rem 1rem;
}
</style>