<template>
    <div
        class="table-responsive container p-0 d-flex flex-column"
        style="gap: 0.7rem"
    >
        <div>
            <DataTable
                class="display w-100 table"
                :key="tableKey"
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
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";

import { API_KEY, API_URL } from "@/assets/js";

const router = useRouter();
const eventId = router.currentRoute.value.params.id;
const totalEventParticipants = defineModel("totalEventParticipants");
const showError = ref(false);
const emit = defineEmits(["switch"]);

let allParticipants = [];

const refresh = defineModel("refresh");
const tableKey = ref(0);

DataTable.use(DataTablesCore);

const columns = [
    { data: "first_name", title: "First Name" },
    { data: "last_name", title: "Last Name" },
    { data: "gender", title: "Gender" },
    { data: "email", title: "Email" },
    { data: "msisdn", title: "Contact" },
    { data: "address", title: "Address" },
    { data: "occupation", title: "Occupation" },
    {
        data: null,
        title: "Today's Attendance",
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
        url: `${API_URL}/events/${eventId}/participants/`,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("authorization", API_KEY);
        },
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
            showError.value = false;
            refresh.value = false;

            const { participants, totalLength } = json.data;

            json.recordsTotal = totalLength;
            json.recordsFiltered = totalLength;
            totalEventParticipants.value = totalLength;

            participants.forEach((participant) => {
                participant.msisdn = participant.msisdn
                    ? `0${participant.msisdn.slice(3)}`
                    : "";

                participant.gender =
                    participant.gender.charAt(0).toUpperCase() +
                    participant.gender.slice(1);
            });

            allParticipants = participants;

            return participants;
        },
        error: (error) => {
            console.log("Error fetching data:", error.responseJSON);
            showError.value = true;
            refresh.value = false;
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
					<svg style="width: 1rem; height: 2rem;" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" d="M85 40H60V15a5 5 0 00-5-5H45a5 5 0 00-5 5v25H15a5 5 0 00-5 5v10a5 5 0 005 5h25v25a5 5 0 005 5h10a5 5 0 005-5V60h25a5 5 0 005-5V45a5 5 0 00-5-5"/></svg>
                    New
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

onMounted(() => {
    handleEventDetail();
});

const handleEventDetail = () => {
    // don't add click event listener on table rows
    // if there are no participants to show
    if (!allParticipants.length) return;

    const dt = table.value.dt;

    dt.on("click", "tr", function () {
        const { id } = dt.row(this).data();
        displayEventPage(id);
    });
};

function displayEventPage(eventId) {
    router.push({ name: "specific-event", params: { id: eventId } });
}

watch(
    () => refresh.value,
    () => {
        // update table Key to force data table to re render
        tableKey.value += 1;
    }
);
</script>

<style scoped>
.cursorPointer {
    cursor: pointer;
}

th,
td {
    padding: 0.9rem;
    font-size: 0.9rem;
}
</style>
