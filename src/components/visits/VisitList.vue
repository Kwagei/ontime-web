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
                id="visitsTable"
                class="display w-100 table"
                :columns="columns"
                :options="options"
                :key="tableKey"
                ref="table"
            />
            <h3 class="mt-5 text-center fw-bold" v-if="showError">
                Unable to load visits, try again!
            </h3>
        </div>
    </div>
</template>

<script setup>
import { API_URL, updateDepartureTime } from "@/assets/js/index.js";
import { computed, onMounted, ref, watch } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";
import { formatDateTime } from "@/assets/js/util";

DataTable.use(DataTablesCore);

const table = ref();
const tableKey = ref(0);
const refresh = defineModel("refresh");
const dateRangeDates = defineModel("dateRangeDates");
const showError = ref(false);

const columns = [
    { data: "date_time", title: "Date" },
    { data: "visitor", title: "Visitor" },
    { data: "departure_time", title: "Departure Time" },
    { data: "purpose", title: "Purpose" },
    { data: "items", title: "Items" },
    {
        data: null,
        title: "Status",
        render: (data) => {
            return data.departure_time
                ? `<span class="text-default fw-bold">Checked Out</span>`
                : `<span class="text-success fw-bold">Checked In</span>`;
        },
    },
    {
        data: null,
        title: "Action",
        className: "text-center",
        render: (data) => {
            return `<button type="button" class="btn btn-secondary"
                            style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; width: 5rem; --bs-btn-font-size: .75rem;" ${
                                data.departure_time ? "disabled" : ""
                            }>
                         Check Out
                      </button>`;
        },
    },
];

const options = {
    responsive: true,
    select: true,
    serverSide: true,
    ajax: {
        url: `${API_URL}visits`,
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
                from: dateRangeDates.value.from || undefined,
                to: dateRangeDates.value.to || undefined,
                order: query.order[0].dir,
            };
        },
        dataSrc: (json) => {
            const { visits, totalLength } = json.data;

            json.recordsTotal = totalLength;
            json.recordsFiltered = totalLength;

            showError.value = false;

            refresh.value = false;

            return formatVisit(visits);
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
				No Visits to show!
				<svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M82.5 37.5V35l-15-15H60v-3.75A1.25 1.25 0 0058.75 15h-2.5A1.25 1.25 0 0055 16.25V20H40v-3.75A1.25 1.25 0 0038.75 15h-2.5A1.25 1.25 0 0035 16.25V20h-7.5l-15 15v2.5h5V85H15v2.5h65V85h-2.5V37.5zM35 77.5H25V70a5 5 0 015-5 5 5 0 015 5zm0-25H25V45a5 5 0 015-5 5 5 0 015 5zM52.5 85h-10V70a5 5 0 015-5 5 5 0 015 5zm0-32.5h-10V45a5 5 0 015-5 5 5 0 015 5zm17.5 25H60V70a5 5 0 015-5 5 5 0 015 5zm0-25H60V45a5 5 0 015-5 5 5 0 015 5z"/></svg>
                <button class="btn btn-secondary"
                        data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasExample"
                    aria-controls="offcanvasExample">
                    Add Visit
                </button>
			</div>
		`,
        emptyTable: `
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
};

const dateRangeInfo = computed(() => {
    return `Showing Visits ${
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

const MAX_ITEMS_LEN = 30;

// function to update departure time
const checkout = async (id) => {
    try {
        const visit_checkout = await updateDepartureTime(id);
        if (visit_checkout.ok) {
            return visit_checkout.result.data[0].departure_time;
        }
    } catch (error) {
        console.error("Error updating departure time:", error);
    }
};

const handleCheckout = async (id, tr) => {
    try {
        const time = await checkout(id);
        const td = $(tr).children("td");

        const checkStatus = $(td[6]).children("button")[0];
        checkStatus.setAttribute("disabled", "disabled");

        const status = $(td[5]);
        status.html(`<span class="text-default fw-bold">Checked Out</span>`);

        const departure_time = $(td[2]);
        departure_time.text(formatDateTime(time, { time: true }));
    } catch (error) {
        console.error("Error updating departure time:", error);
    }
};

// reload visits table
watch(
    () => refresh.value,
    () => (tableKey.value += 1)
);

// retrieve events in date range
watch(
    // watch for change on the from or to dates
    () => [dateRangeDates.value.from, dateRangeDates.value.to],
    ([newFrom, newTo]) => {
        // update the date from and to dates for the request query
        dateRangeDates.value.from = newFrom;
        dateRangeDates.value.to = newTo;

        // update the table key and force the table to reload
        tableKey.value += 1;
    }
);

const handleCheckoutDetail = () => {
    const dt = table.value.dt;

    dt.on("click", "button", function (event) {
        const checkOutBtn = event.target;

        const tr = $(checkOutBtn).closest("tr");
        const visitData = dt.row(tr).data();

        if (visitData) {
            handleCheckout(visitData.id, tr);
        }
    });
};

const formatVisit = (visits) => {
    return visits.map((visit) => {
        // format visit date time if any
        if (visit.date_time) {
            visit.date_time = formatDateTime(visit.date_time);
        }

        // format departure time if any
        if (visit.departure_time) {
            visit.departure_time = formatDateTime(visit.departure_time, {
                time: true,
            });
        }

        if (Array.isArray(visit.items)) {
            visit.items = formatItems(visit.items);
        }

        if (visit.purpose) {
            const purpose = visit.purpose.split(" ");
            visit.purpose =
                purpose.length > MAX_ITEMS_LEN
                    ? `${purpose.slice(0, MAX_ITEMS_LEN).join(" ")}...`
                    : visit.purpose;
        }

        return {
            ...visit,
            visitor: `${visit.first_name} ${visit.last_name}`,
        };
    });
};

const formatItems = (belonging) => {
    const items = belonging.join(", ");
    return items.length > MAX_ITEMS_LEN
        ? `${items.slice(0, MAX_ITEMS_LEN)}...`
        : items;
};

onMounted(async () => {
    handleCheckoutDetail();
});
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
