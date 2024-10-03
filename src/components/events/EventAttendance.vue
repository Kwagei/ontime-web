<template>
    <div id="eventAttendanceContainer" class="container">
        <div
            id="eventAttendanceHeaderWrapper"
            class="d-flex justify-content-between align-items-center gap-2 mt-3"
        >
            <div
                id="backArrowBreadCrumbsWrapper"
                class="d-flex align-items-center gap-4"
            >
                <BackArrow @click="$emit('switch', 'details')" />
                <BreadCrumbs
                    :breadCrumbs="['events', eventId, 'Today\'s Attendance']"
                />
            </div>
            <div id="optionsButtonWrapper" class="d-flex" style="gap: 0.521rem">
                <button class="reloadIcon" @click="reloadTable">
                    <Icons v-model:icon="reloadIcon" />
                </button>
                <button
                    class="btn btn-default border border-2"
                    @click="displayExportModay"
                >
                    Export
                </button>

                <router-link to="/check-in/purpose-event">
                    <button class="btn btn-secondary" style="min-width: 110px">
                        Check In
                    </button>
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

        <div class="container d-flex justify-content-center gap-3 mt-2">
            <div class="pt-2 w-100">
                <DataTable
                    class="display w-100 table"
                    :columns="columns"
                    :options="options"
                    :key="tableKey"
                    ref="table"
                    v-if="!showError"
                />
                <h3 class="mt-5 text-center fw-bold" v-if="showError">
                    Unable to load event participants, try again!
                </h3>
            </div>
        </div>
    </div>

    <ExportModal
        :exportFields="exportFields"
        v-model:exportTitle="exportTitle"
        @export="exportEventsAttendance"
    />
</template>

<script setup>
// Modules
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";
DataTable.use(DataTablesCore);

// Utility
import {
    capitalize,
    formatDateTime,
    formatDepartureTime,
    showModal,
} from "@/util/util";
import { API_KEY, API_URL, csvExport } from "@/assets/js";

// Components
import Icons from "../Icons.vue";
import BackArrow from "../BackArrow.vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import ExportModal from "../modals/ExportModal.vue";

const plusIcon = "add";
const props = defineProps({
    eventId: String,
});

const tableKey = ref(0);
const reloadIcon = ref("reload");

const eventId = ref(props.eventId);
const showError = ref(false);
const attendanceList = ref("");
const exportFields = ref([
    { name: "First name", selected: false },
    { name: "Last name", selected: false },
    { name: "Phone number", selected: false },
    { name: "Address", selected: false },
    { name: "Time in", selected: false },
    { name: "Time out", selected: false },
    { name: "Gender", selected: false },
    { name: "Session", selected: false },
    { name: "Items", selected: false },
]);

const exportTitle = defineModel("exportTitle");
exportTitle.value = "Event Attendance";

const columns = [
    { data: "first_name", title: "First Name", orderable: false },
    { data: "last_name", title: "Last Name", orderable: false },
    { data: "gender", title: "Gender", orderable: false },
    { data: "msisdn", title: "Contact", orderable: false },
    { data: "address", title: "Address", orderable: false },
    { data: "visit_date_time", title: "Time In", orderable: false },
    { data: "visit_departure_time", title: "Time Out", orderable: false },
    { data: "session", title: "Session", orderable: false },
];

const options = {
    responsive: true,
    select: true,
    serverSide: true,
    ajax: {
        url: `${API_URL}/events/${eventId.value}/attendance/`,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("authorization", API_KEY);
        },
        data: (query) => {
            return {
                start: query.start,
                limit: query.length,
                search: query.search.value,
                sort: "date_time",
                direction: query.order[0].dir,
            };
        },
        dataSrc: (json) => {
            showError.value = false;

            const { participants, totalLength } = json.data;

            // format each participant record
            participants.forEach((participant) => {
                participant.session = capitalize(participant.session);

                participant.msisdn = participant.msisdn
                    ? `0${participant.msisdn.slice(3)}`
                    : "";

                // capitalize first letter of gender
                participant.gender = capitalize(participant.gender);

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
                    const time = participant.visit_departure_time;
                    participant.visit_departure_time =
                        formatDepartureTime(time);
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

            json.recordsTotal = totalLength;
            json.recordsFiltered = totalLength;

            attendanceList.value = attendees;
            return attendees;
        },
        error: (error) => {
            console.log("Error fetching data:", error.responseJSON);
            showError.value = true;
        },
    },
    responsive: true,
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

onMounted(() => {
    const breadCrumbsOl = $("#breadCrumbsOl")[0];

    if (window.innerWidth <= 1070) {
        breadCrumbsOl.innerHTML = `
			<li>
				<span class="text fw-bold">
					Today's Attendance
				</span>
			</li>
		`;
    }
});

const displayExportModay = () => {
    showModal("#exportModal", "#modal-dialog");
};

const exportEventsAttendance = async (fields) => {
    const selectedAttendee = attendanceList.value.map((attendee) => {
        const data = {};

        for (const field of fields) {
            if (field === "phone_number") {
                data[field] = attendee.msisdn.startsWith("231")
                    ? `0${attendee.msisdn.slice(3)}`
                    : attendee.msisdn;
            } else if (field === "time_in") {
                data[field] = attendee.visit_date_time;
            } else if (field === "time_out") {
                data[field] = attendee.visit_departure_time;
            } else {
                data[field] = attendee[field];
            }
        }

        return data;
    });

    csvExport(selectedAttendee);
};

function reloadTable() {
    showError.value = false;
    tableKey.value += 1;
}
</script>

<style scoped>
@media (max-width: 1070px) {
    #breadCrumbsOl > li:nth-of-type(2) {
        display: none !important;
    }
}

@media (max-width: 580px) {
    #breadCrumbs {
        display: none;
    }
}

@media (max-width: 450px) {
    #optionsButtonWrapper {
        max-width: 17rem;
        overflow-x: scroll;
    }

    #breadCrumbs {
        display: inline-flex;
    }

    #backArrowBreadCrumbsWrapper {
        align-self: flex-start;
    }

    #eventAttendanceHeaderWrapper {
        flex-direction: column !important;
    }
}

svg {
    height: 20px !important;
    margin: 0 !important;
}

li {
    font-size: 1rem;
    font-weight: 600;
    padding: 0.75rem 1rem;
}

.reloadIcon {
    border: 2px solid black;
    width: 42.5px;
    border-radius: 5px;
}
.reloadIcon:hover {
    background-color: #fff;
}
</style>
