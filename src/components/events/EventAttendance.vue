<template>
    <div class="d-flex justify-content-between align-items-center gap-5 mt-3">
        <div class="d-flex align-items-center gap-4">
            <BackArrow @click="$emit('switch', 'details')" />
            <BreadCrumbs
                :breadCrumbs="['events', eventId, 'Today\'s Attendance']"
            />
        </div>
        <div class="d-flex gap-3">
            <router-link to="/visits/purpose-event">
                <button class="btn btn-secondary">Check In</button>
            </router-link>
            <button
                class="btn btn-primary"
                id="addParticipantBtn"
                @click="$emit('switch', 'addParticipant')"
            >
                Add Participant
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
import { API_URL } from "@/assets/js";

import { ref } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";
import { formatDateTime } from "@/assets/js/util";
import { RouterLink } from "vue-router";

const props = defineProps({
    eventId: String,
});

const eventId = ref(props.eventId);
const showError = ref(false);

DataTable.use(DataTablesCore);

const columns = [
    { data: "first_name", title: "First Name" },
    { data: "last_name", title: "Last Name" },
    { data: "msisdn", title: "Contact" },
    { data: "visit_date_time", title: "Time In" },
    { data: "visit_departure_time", title: "Time Out" },
    { data: "items", title: "Items" },
    {
        data: null,
        title: "Status",
        render: (data) => {
            return data.participant_id
                ? `<span class="text-success fw-bold">Attended</span>`
                : `<span class="text-danger fw-bold">Not Attended</span>`;
        },
    },
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
            const participants = json.data.participants;

            // fix stop data table from showing NAN error
            // in pagination and number of records
            json.recordsTotal = json.data.totalLength;
            json.recordsFiltered = json.data.totalLength;

            // format each participant record
            participants.forEach((participant) => {
                participant.msisdn = `0${participant.msisdn.slice(3)}`;

                console.log("dpt: ", participant.visit_date_time);
                // format visit date time or arrival time if any
                participant.visit_date_time = participant.visit_date_time
                    ? formatDateTime(participant.visit_date_time, {
                          time: true,
                      })
                    : null;
                console.log("after dpt: ", participant.visit_date_time);

                // format departure time if any
                participant.visit_departure_time =
                    participant.visit_departure_time
                        ? formatDateTime(participant.visit_departure_time, {
                              time: true,
                          })
                        : null;

                // format items if any
                participant.items = participant.items
                    ? participant.items.join(", ")
                    : "";
            });

            return participants;
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
				<svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M80 17.5H70v-3.8c0-2.071-1.679-3.7-3.75-3.7a3.75 3.75 0 00-3.75 3.75v3.75H35.001L35 13.75a3.75 3.75 0 00-7.5 0v3.75H10V80a7.5 7.5 0 007.5 7.5h70V25a7.5 7.5 0 00-7.5-7.5m2.5 65H18.75A3.75 3.75 0 0115 78.75V40h63.75a3.75 3.75 0 013.75 3.75zM25 26.25a6.24 6.24 0 012.5-5v5a3.75 3.75 0 007.5 0V25h.001v-3.75a6.25 6.25 0 11-10.001 5m35 0a6.24 6.24 0 012.5-5v5a3.75 3.75 0 007.5 0L69.999 25H70v-3.7a6.15 6.15 0 012.5 4.95 6.25 6.25 0 01-12.5 0M23.75 45a3.75 3.75 0 103.75 3.75A3.75 3.75 0 0023.75 45m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55M23.75 57.5a3.75 3.75 0 103.75 3.75 3.75 3.75 0 00-3.75-3.75m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55M23.75 70a3.75 3.75 0 103.75 3.75A3.75 3.75 0 0023.75 70m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55"/></svg>
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
				No match found!
				<svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M80 17.5H70v-3.8c0-2.071-1.679-3.7-3.75-3.7a3.75 3.75 0 00-3.75 3.75v3.75H35.001L35 13.75a3.75 3.75 0 00-7.5 0v3.75H10V80a7.5 7.5 0 007.5 7.5h70V25a7.5 7.5 0 00-7.5-7.5m2.5 65H18.75A3.75 3.75 0 0115 78.75V40h63.75a3.75 3.75 0 013.75 3.75zM25 26.25a6.24 6.24 0 012.5-5v5a3.75 3.75 0 007.5 0V25h.001v-3.75a6.25 6.25 0 11-10.001 5m35 0a6.24 6.24 0 012.5-5v5a3.75 3.75 0 007.5 0L69.999 25H70v-3.7a6.15 6.15 0 012.5 4.95 6.25 6.25 0 01-12.5 0M23.75 45a3.75 3.75 0 103.75 3.75A3.75 3.75 0 0023.75 45m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55M23.75 57.5a3.75 3.75 0 103.75 3.75 3.75 3.75 0 00-3.75-3.75m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55M23.75 70a3.75 3.75 0 103.75 3.75A3.75 3.75 0 0023.75 70m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55"/></svg>
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
</script>

<style scoped>
/* code... */
</style>
