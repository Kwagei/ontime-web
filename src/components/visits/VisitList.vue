<template>
    <div
        class="table-responsive container p-0 d-flex flex-column"
        style="gap: 0.9rem"
    >
        <table id="visitsTable" class="table table-striped w-100"></table>

        <div>
            <div
                id="spinner"
                v-if="loader"
                class="d-flex justify-content-center p-4"
            >
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div
                v-if="fetchError"
                class="invalid-feedback show-feedback m-auto"
            >
                {{ errorMessage }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { updateDepartureTime } from "@/assets/js/index";
import Icons from "../Icons.vue";
import DataTables from "datatables.net-dt";
import "datatables.net-responsive-dt";

import { ref, watch, onMounted } from "vue";

const check = "tick-confirmation";

const visits = ref([]);
const loader = ref(true);
const dataTable = ref(null);
const MAX_ITEMS_LEN = 30;

const fetchError = ref(false);
const errorMessage = ref("Error Loading Visits, Try Again!");

const refresh = defineModel("refresh");

watch(
    () => refresh.value,
    async () => {
        visits.value = [];
        loader.value = true;
        await fetchVisits();
        refresh.value = false;
    }
);

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

const handleCheckout = async (id, target) => {
    try {
        const time = await checkout(id);
        const tr = $(target).children("td");
        const checkStatus = $(tr[6]);
        checkStatus.html(`<span class="text-center">
							<svg data-v-61ae8e47="" class="solaris-icon" aria-hidden="true" focusable="false"><use href="/src/assets/svg/solaris-icons-sprite.svg#tick-confirmation"></use></svg>
						</span>`);
        const departure_time = $(tr[3]);
        departure_time.text(time);
    } catch (error) {
        console.error("Error updating departure time:", error);
    }
};

const formatDateTime = (visits) => {
    return visits.map((visit) => {
        let date, arrival_time;

        if (visit.date_time) {
            [date, arrival_time] = visit.date_time.split("T");
            arrival_time = arrival_time.split(".")[0];
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
            date,
            arrival_time,
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

const initializeDataTable = () => {
    dataTable.value = new DataTables("#visitsTable", {
        serverSide: true,
        ajax: {
            url: `http://localhost:3000/api/visits`,
            type: "GET",
            data: (query) => {
                console.log("Order: ", query);

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
                visits.value = formatDateTime(json.data);
                loader.value = false;
                return visits.value;
            },
            error: (xhr, error, thrown) => {
                console.log("Error fetching data:", error);
            },
        },
        columns: [
            { data: "date", title: "Date" },
            { data: "visitor", title: "Visitor" },
            { data: "arrival_time", title: "Arrival Time" },
            { data: "departure_time", title: "Departure Time" },
            { data: "purpose", title: "Purpose" },
            { data: "items", title: "Items" },
            {
                title: "Check Out",
                data: null,
                className: "text-center",
                render: (data, type, row) => {
                    return data.departure_time
                        ? `<span class="text-center">
							<svg data-v-61ae8e47="" class="solaris-icon" 
                            aria-hidden="true" focusable="false">
                                <use href="/src/assets/svg/solaris-icons-sprite.svg#tick-confirmation"></use>
                            </svg>
						</span>`
                        : `<button type="button" class="btn btn-secondary"
                            style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
                            Check Out
                        </button>`;
                },
            },
        ],
        responsive: true,
        lengthMenu: [10, 25, 50, 100],
        language: {
            searchPlaceholder: "Search ...",
            search: "",
        },
    });

    // Handle row click event
    dataTable.value.on("click", "button", function (event) {
        const target = $(event.target).closest("tr");
        const rowData = dataTable.value.row(target).data();
        if (rowData) {
            handleCheckout(rowData.id, target);
        }
    });
};

onMounted(async () => {
    initializeDataTable();
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

@media (min-width: 768px) and (max-width: 1440px) {
    th,
    td {
        padding: 0.7rem;
    }
}
</style>
