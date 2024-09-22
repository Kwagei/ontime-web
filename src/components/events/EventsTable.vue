<template>
    <div
        class="table-responsive container p-0 d-flex flex-column"
        style="gap: 0.7rem"
    >
        <div
            style="font-weight: 400; font-size: 1rem"
            class="mb-0 d-flex align-items-center"
            v-if="filterDates.from || filterDates.to"
        >
            {{ filterInfo }}

            <button
                type="button"
                class="btn btn-primary mx-2"
                style="
                    --bs-btn-padding-y: 0.25rem;
                    --bs-btn-padding-x: 0.5rem;
                    --bs-btn-font-size: 0.75rem;
                "
                @click="clearFilter"
            >
                Clear
            </button>
        </div>

        <div>
            <DataTable
                v-show="!showError"
                :key="tableKey"
                id="eventsTable"
                class="display w-100 table"
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
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";
import { API_KEY, API_URL } from "@/assets/js";

DataTable.use(DataTablesCore);
import { formatDateTime, formatDetails } from "@/util/util";

const totalEvents = defineModel("totalEvents");
const refresh = defineModel("refresh");
const tableKey = ref(0);
const showError = ref(false);
const filterDates = defineModel("filterDates");

const columns = [
    { data: "title", title: "Title" },
    { data: "host", title: "Host" },
    { data: "start_date", title: "Start Date" },
    { data: "end_date", title: "End Date" },
    { data: "facilitator", title: "Facilitator" },
    { data: "type", title: "Type" },
    { data: "details", title: "Details" },
    { data: "created_at", title: "Creation Date" },
];

const options = {
    select: true,
    serverSide: true,
    ajax: {
        url: `${API_URL}/events`,
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
                from: filterDates.value.from || undefined,
                to: filterDates.value.to || undefined,
                order: query.order[0].dir,
            };
        },
        dataSrc: (json) => {
            const { events, totalLength } = json.data;

            json.recordsTotal = totalLength;
            json.recordsFiltered = totalLength;
            totalEvents.value = totalLength;

            showError.value = false;
            refresh.value = false;

            events.forEach((event) => {
                event.details = formatDetails(event.details);
                event.start_date = formatDateTime(event.start_date, {
                    date: true,
                });
                event.end_date = formatDateTime(event.end_date, { date: true });
                event.created_at = formatDateTime(event.created_at, {
                    date: true,
                });
            });

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
                <button class="btn btn-secondary" data-empty="true" onclick="document.getElementById('addEventBtn').click()">
                    <svg style="width: 1rem; height: 2rem;" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" d="M85 40H60V15a5 5 0 00-5-5H45a5 5 0 00-5 5v25H15a5 5 0 00-5 5v10a5 5 0 005 5h25v25a5 5 0 005 5h10a5 5 0 005-5V60h25a5 5 0 005-5V45a5 5 0 00-5-5"/></svg>    
                    New    
                </button>
                
            </div>
        `,
        emptyTable: `
			<div class="d-flex flex-column justify-content-center align-items-center gap-3 p-4">
				No Visits to show!
				<svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M80 17.5H70v-3.8c0-2.071-1.679-3.7-3.75-3.7a3.75 3.75 0 00-3.75 3.75v3.75H35.001L35 13.75a3.75 3.75 0 00-7.5 0v3.75H10V80a7.5 7.5 0 007.5 7.5h70V25a7.5 7.5 0 00-7.5-7.5m2.5 65H18.75A3.75 3.75 0 0115 78.75V40h63.75a3.75 3.75 0 013.75 3.75zM25 26.25a6.24 6.24 0 012.5-5v5a3.75 3.75 0 007.5 0V25h.001v-3.75a6.25 6.25 0 11-10.001 5m35 0a6.24 6.24 0 012.5-5v5a3.75 3.75 0 007.5 0L69.999 25H70v-3.7a6.15 6.15 0 012.5 4.95 6.25 6.25 0 01-12.5 0M23.75 45a3.75 3.75 0 103.75 3.75A3.75 3.75 0 0023.75 45m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55M23.75 57.5a3.75 3.75 0 103.75 3.75 3.75 3.75 0 00-3.75-3.75m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55M23.75 70a3.75 3.75 0 103.75 3.75A3.75 3.75 0 0023.75 70m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55"/></svg>
                <button class="btn btn-secondary" data-empty="true" onclick="document.getElementById('addEventBtn').click()">
                    <svg style="width: 1rem; height: 2rem;" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" d="M85 40H60V15a5 5 0 00-5-5H45a5 5 0 00-5 5v25H15a5 5 0 00-5 5v10a5 5 0 005 5h25v25a5 5 0 005 5h10a5 5 0 005-5V60h25a5 5 0 005-5V45a5 5 0 00-5-5"/></svg>    
                    New    
                </button>
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
    order: [[7, "desc"]],
    destroy: true,
    createdRow: (row, data) => {
        $(row).on("click", (event) => {
            if (event.target.dataset.empty) addEvent();

            const eventData = data;

            if (eventData) displayEventPage(eventData.id);
        });
    },
};

const filterInfo = computed(() => {
    return `Showing Events ${
        filterDates.value.from
            ? "from " + formatDateTime(filterDates.value.from, { date: true })
            : ""
    } ${
        filterDates.value.to
            ? "up to " + formatDateTime(filterDates.value.to, { date: true })
            : ""
    }`;
});

const router = useRouter();

const table = ref();

function displayEventPage(eventId) {
    router.push({ name: "specific-event", params: { id: eventId } });
}

const addEvent = () => {
    router.push({ name: "add-event" });
};

watch(
    () => refresh.value,
    () => {
        // update table Key to force data table to re render
        tableKey.value += 1;
    }
);

// retrieve events in date range
watch(
    // watch for change on from or to dates
    () => [filterDates.value.from, filterDates.value.to],
    ([newFrom, newTo]) => {
        // update the date from and to dates for the request query
        filterDates.value.from = newFrom;
        filterDates.value.to = newTo;

        // updatee table key and force table to reload
        tableKey.value += 1;
    }
);

const clearFilter = () => {
    filterDates.value.from = "";
    filterDates.value.to = "";
    tableKey.value++;
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
