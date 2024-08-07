<template>
    <div
        class="table-responsive container p-0 d-flex flex-column"
        style="gap: 0.7rem"
    >
        <h4 class="mb-0" v-show="dateRangeDates.from || dateRangeDates.to">
            {{ dateRangeInfo }}
        </h4>
        <div>
            <DataTable
                v-show="!showError"
                id="eventsTable"
                class="display w-100 table"
                :key="tableKey"
                :columns="columns"
                :options="options"
                ref="table"
            />
            <h3 class="mt-5 text-center fw-bold" v-if="showError">
                Unable to load events, try again!
            </h3>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";
import { API_URL } from "@/assets/js";

DataTable.use(DataTablesCore);
import dayjs from "dayjs";
import { formatDateTime } from "@/assets/js/util";

const refresh = defineModel("refresh");
const dateRangeDates = defineModel("dateRangeDates");
const showError = ref(false);

const columns = [
    { data: "title", title: "Title" },
    { data: "host", title: "Host" },
    { data: "start_date", title: "Start Date" },
    { data: "end_date", title: "End Date" },
    { data: "facilitator", title: "Facilitator" },
    { data: "type", title: "Type" },
    { data: "details", title: "Details" },
];

const options = {
    select: true,
    serverSide: true,
    ajax: {
        url: `${API_URL}events`,
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
                from: dateRangeDates.value.from || undefined,
                to: dateRangeDates.value.to || undefined,
                sort: order,
                direction: query.order[0].dir,
            };
        },
        dataSrc: (json) => {
            const { events, totalLength } = json.data;

            json.recordsTotal = totalLength;
            json.recordsFiltered = totalLength;

            showError.value = false;
            refresh.value = false;

            events.forEach((event) => {
                event.details = formatDetails(event.details);
                event.start_date = formatDate(event.start_date);
                event.end_date = formatDate(event.end_date);
            });

            // add click event listeners on each row
            handleEventDetail();

            return events;
        },
        error: (error) => {
            console.log("Error fetching data:", error);
            showError.value = true;
            refresh.value = false;
        },
    },
    responsive: true,
    lengthMenu: [10, 25, 50, 100],
    language: {
        searchPlaceholder: "Search ...",
        search: "",
        zeroRecords: `
			 <div class="d-flex flex-column justify-content-center align-items-center gap-3 p-4">
				No Events to show!
				<svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M80 17.5H70v-3.8c0-2.071-1.679-3.7-3.75-3.7a3.75 3.75 0 00-3.75 3.75v3.75H35.001L35 13.75a3.75 3.75 0 00-7.5 0v3.75H10V80a7.5 7.5 0 007.5 7.5h70V25a7.5 7.5 0 00-7.5-7.5m2.5 65H18.75A3.75 3.75 0 0115 78.75V40h63.75a3.75 3.75 0 013.75 3.75zM25 26.25a6.24 6.24 0 012.5-5v5a3.75 3.75 0 007.5 0V25h.001v-3.75a6.25 6.25 0 11-10.001 5m35 0a6.24 6.24 0 012.5-5v5a3.75 3.75 0 007.5 0L69.999 25H70v-3.7a6.15 6.15 0 012.5 4.95 6.25 6.25 0 01-12.5 0M23.75 45a3.75 3.75 0 103.75 3.75A3.75 3.75 0 0023.75 45m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55M23.75 57.5a3.75 3.75 0 103.75 3.75 3.75 3.75 0 00-3.75-3.75m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55M23.75 70a3.75 3.75 0 103.75 3.75A3.75 3.75 0 0023.75 70m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55"/></svg>
                <button class="btn btn-secondary" data-empty="true" >Add Event</button>
            </div>
        `,
        emptyTable: `
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

const dateRangeInfo = computed(() => {
    return `Showing Events ${
        dateRangeDates.value.from
            ? "from " +
              formatDateTime(dateRangeDates.value.from, { date: true })
            : ""
    } ${
        dateRangeDates.value.to
            ? "up to " + formatDateTime(dateRangeDates.value.to, { date: true })
            : ""
    }`;
});

const router = useRouter();
const MAX_DETAIL_LEN = 30;

const table = ref();
const tableKey = ref(0);

// refresh table
watch(
    () => refresh.value,
    () => {
        // increase table key to force table to automatically refresh
        tableKey.value += 1;
    }
);

// retrieve events in date range
watch(
    // watch for change on from or to dates
    () => [dateRangeDates.value.from, dateRangeDates.value.to],
    ([newFrom, newTo]) => {
        // update the date from and to dates for the request query
        dateRangeDates.value.from = newFrom;
        dateRangeDates.value.to = newTo;

        // updatee table key and force table to reload
        tableKey.value += 1;
    }
);

const handleEventDetail = () => {
    const dt = table.value.dt;

    dt.on("click", "tr", function (event) {
        // Add event from the add event button in the table if it's empty
        if (event.target.dataset.empty) addEvent();

        const eventData = dt.row(this).data();

        if (eventData) displayEventPage(eventData.id);
    });
};

const formatDate = (date) => {
    return dayjs(date).format("dddd, MMMM D, YYYY");
};

const formatDetails = (detail) => {
    return detail.length > MAX_DETAIL_LEN
        ? `${detail.slice(0, MAX_DETAIL_LEN)}...`
        : detail;
};

function displayEventPage(eventId) {
    router.push({ name: "specific-event", params: { id: eventId } });
}

const addEvent = () => {
    router.push({ name: "add-event" });
};
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
