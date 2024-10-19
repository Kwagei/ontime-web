<template>
    <AlertModal :data="alert" />

    <div
        class="table-responsive container p-0 d-flex flex-column"
        style="gap: 0.7rem"
    >
        <div class="mb-0" v-show="filterDates.from || filterDates.to">
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
                id="visitsTable"
                class="display w-100 table"
                :columns="columns"
                :options="options"
                ref="table"
            />

            <h3 class="mt-5 text-center fw-bold" v-if="showError">
                Unable to load visits, try again!
            </h3>
        </div>
    </div>
</template>

<script setup>
import { API_KEY, API_URL, updateDepartureTime } from "@/assets/js/index.js";
import { formatDateTime, formatVisitData, showModal } from "@/util/util.js";
import AlertModal from "../modals/AlertModal.vue";

import { ref, watch, computed, onMounted, getCurrentInstance } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";

DataTable.use(DataTablesCore);

const totalVisits = defineModel("totalVisits");
const refresh = defineModel("refresh");
const filterDates = defineModel("filterDates");
const tableKey = ref(0);
const showError = ref(false);
const dashboardTableData = defineModel("dtd");
dashboardTableData.value = {};

const alert = ref({
    message: "",
    status: "success",
    pageLink: "",
});

const selectedVisit = ref({});

// section loader flag
const $sectionIsLoading =
    getCurrentInstance().appContext.config.globalProperties.$sectionIsLoading;

const columns = [
    { data: "date_time", title: "Date", orderable: false },
    {
        data: null,
        render: (data) =>
            `<a href="/visitors/${data.visitor_id}">${data.visitor}</a>`,
        title: "Visitor",
        orderable: false,
    },
    { data: "departure_time", title: "Departure Time", orderable: false },
    { data: "purpose", title: "Purpose", orderable: false },
    { data: "items", title: "Items", orderable: false },
    {
        data: null,
        title: "Status",
        render: (data) => {
            return data.departure_time
                ? `<span class="text-default fw-bold">Checked Out</span>`
                : `<span class="text-success fw-bold">Checked In</span>`;
        },
        orderable: false,
    },
    {
        data: null,
        title: "Action",
        className: "text-center",
        render: (data) => {
            return `<button type="button" class="btn btn-secondary checkOutBtn"
                            style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: 0.70rem;" ${
                                data.departure_time ? "disabled" : ""
                            }>
                         Check Out
                      </button>`;
        },
        orderable: false,
    },
];

const options = {
    responsive: true,
    serverSide: true,
    ajax: {
        url: `${API_URL}visits`,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("authorization", API_KEY);
        },
        data: () => {
            return {
                start: 0,
                limit: 5,
                sort: "date_time",
                order: "desc",
            };
        },
        dataSrc: (json) => {
            showError.value = false;
            refresh.value = false;

            const { visits, totalLength } = json.data;

            json.recordsTotal = totalLength;
            json.recordsFiltered = totalLength;
            totalVisits.value = totalLength;

            return formatVisitData(visits);
        },
        error: (error) => {
            console.log("Error fetching data:", error);
            showError.value = true;
            refresh.value = false;
        },
    },
    lengthMenu: [5],
    bLengthChange: false,
    recordsFiltered: 0,
    bInfo: false,
    paging: true,
    searching: false,
    language: {
        searchPlaceholder: "Search ...",
        search: "",
        emptyTable: `
				<div class="d-flex flex-column justify-content-center align-items-center gap-3 p-4">
					No Visits to show!
					<svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M82.5 37.5V35l-15-15H60v-3.75A1.25 1.25 0 0058.75 15h-2.5A1.25 1.25 0 0055 16.25V20H40v-3.75A1.25 1.25 0 0038.75 15h-2.5A1.25 1.25 0 0035 16.25V20h-7.5l-15 15v2.5h5V85H15v2.5h65V85h-2.5V37.5zM35 77.5H25V70a5 5 0 015-5 5 5 0 015 5zm0-25H25V45a5 5 0 015-5 5 5 0 015 5zM52.5 85h-10V70a5 5 0 015-5 5 5 0 015 5zm0-32.5h-10V45a5 5 0 015-5 5 5 0 015 5zm17.5 25H60V70a5 5 0 015-5 5 5 0 015 5zm0-25H60V45a5 5 0 015-5 5 5 0 015 5z"/></svg>
					<button class="btn btn-secondary"
                        data-bs-toggle="offcanvas"
						data-bs-target="#offcanvasExample"
						aria-controls="offcanvasExample">
					   <svg style="width: 1rem; height: 2rem;" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" d="M85 40H60V15a5 5 0 00-5-5H45a5 5 0 00-5 5v25H15a5 5 0 00-5 5v10a5 5 0 005 5h25v25a5 5 0 005 5h10a5 5 0 005-5V60h25a5 5 0 005-5V45a5 5 0 00-5-5"/></svg>
						New
					</button>
				</div>
			`,
        zeroRecords: `
				<div class="d-flex gap-3 my-3 flex-column align-items-center">
					No match found!
					<svg xmlns="http://www.w3.org/2000/svg" style="width: 80px; height: 80px" fill="currentColor" class="solaris-icon si-house" viewBox="0 0 1000 1000">
						<path d="M825 375v-25L675 200h-75v-37.5a12.5 12.5 0 0 0-12.5-12.5h-25a12.5 12.5 0 0 0-12.5 12.5V200H400v-37.5a12.5 12.5 0 0 0-12.5-12.5h-25a12.5 12.5 0 0 0-12.5 12.5V200h-75L125 350v25h50v475h-25v25h650v-25h-25V375zM350 775H250v-75a50 50 0 0 1 50-50 50 50 0 0 1 50 50zm0-250H250v-75a50 50 0 0 1 50-50 50 50 0 0 1 50 50zm175 325H425V700a50 50 0 0 1 50-50 50 50 0 0 1 50 50zm0-325H425v-75a50 50 0 0 1 50-50 50 50 0 0 1 50 50zm175 250H600v-75a50 50 0 0 1 50-50 50 50 0 0 1 50 50zm0-250H600v-75a50 50 0 0 1 50-50 50 50 0 0 1 50 50z" style="fill-rule:evenodd"/>
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
    order: [[0, "desc"]],
    createdRow: (row, data) => {
        $(row).on("click", () => (selectedVisit.value = data));
    },
};

onMounted(() => {
    $(document).on("click", ".checkOutBtn", () => {
        setTimeout(() => checkOutBtnClicked(), 250);
    });
});

const filterInfo = computed(() => {
    return `Showing Visits ${
        filterDates.value.from
            ? "from " + formatDateTime(filterDates.value.from, { date: true })
            : ""
    } ${
        filterDates.value.to
            ? "up to " + formatDateTime(filterDates.value.to, { date: true })
            : ""
    } `;
});

// function to update departure time
const handleCheckout = async (visit) => {
    // indicate visitor already checked out
    if (visit.departure_time) {
        alert.value.message = "Visitor Already Checked Out";
        alert.value.status = "warning";

        showModal();
        return;
    }

    $sectionIsLoading.value = true;
    const updatedDepartureTime = await updateDepartureTime(visit.id);
    $sectionIsLoading.value = false;

    if (updatedDepartureTime.ok) {
        alert.value.message = "Visitor Checked Out";
        alert.value.status = "success";

        showModal();

        // refresh visits table
        tableKey.value += 1;
    } else {
        alert.value.message = "Unable to check visitor out, try again";
        alert.value.status = "danger";
        showModal();
    }
};

const checkOutBtnClicked = () => {
    handleCheckout(selectedVisit.value);
};

watch(
    () => refresh.value,
    () => {
        tableKey.value++;
    }
);

// retrieve events in date range
watch(
    // watch for change on the from or to dates
    () => [filterDates.value.from, filterDates.value.to],
    ([newFrom, newTo]) => {
        // update the date from and to dates for the request query
        filterDates.value.from = newFrom;
        filterDates.value.to = newTo;

        // update the table key and force the table to reload
        tableKey.value += 1;
    }
);

const clearFilter = () => {
    filterDates.value.from = "";
    filterDates.value.to = "";
    tableKey.value += 1;
};
</script>

<style scoped>
.show-feedback {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: larger;
    padding: 4rem;
}
table {
    margin: 0;
}
th,
td {
    padding: 0.9rem;
    font-size: 0.9rem;
}

svg {
    color: #228722;
}

.fw-bold {
    font-weight: 700;
}

@media (min-width: 768px) and (max-width: 1440px) {
    th,
    td {
        padding: 0.7rem;
    }
}
</style>
