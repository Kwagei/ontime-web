<template>
    <div
        class="table-responsive container p-0 d-flex flex-column"
        style="gap: 0.9rem"
    >
        <table id="eventTable" class="table table-striped w-100"></table>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import DataTables from "datatables.net-dt";
import "datatables.net-responsive-dt";

const events = ref([]);
const router = useRouter();
const MAX_DETAIL_LEN = 30;
const dataTable = ref(null);
const loader = ref(false);

const props = defineProps({
    refresh: Boolean,
});

const emit = defineEmits(["refreshComplete"]);

// Watch Refresh Prop to refresh events accordingly
watch(
    () => props.refresh,
    () => emit("refreshComplete")
);

const initializeDataTable = () => {
    dataTable.value = new DataTables("#eventTable", {
        serverSide: true,
        ajax: {
            url: `http://localhost:3000/api/events`,
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
                json.data.forEach((event) => {
                    event.details = formatDetails(event.details);
                    event.start_date = formatDate(event.start_date);
                    event.end_date = formatDate(event.end_date);
                });

                events.value = json.data;
                loader.value = false;
                return events.value;
            },
            error: (xhr, error, thrown) => {
                console.log("Error fetching data:", error);
            },
        },
        columns: [
            { data: "title", title: "Title" },
            { data: "host", title: "Host" },
            { data: "start_date", title: "Start Date" },
            { data: "end_date", title: "End Date" },
            { data: "facilitator", title: "Facilitator" },
            { data: "event_type", title: "Type" },
            { data: "details", title: "Details" },
        ],
        responsive: true,
        lengthMenu: [10, 25, 50, 100],
        language: {
            searchPlaceholder: "Search ...",
            search: "",
        },
    });

    dataTable.value.on("click", "tr", function () {
        const rowData = dataTable.value.row(this).data();
        if (rowData) {
            console.log(rowData.id);
            displayEventPage(rowData.id);
        }
    });
};

const formatDate = (date) => {
    const rawDate = new Date(date);

    return rawDate.toString().split(" 0")[0];
};

onMounted(async () => {
    initializeDataTable();
});

const formatDetails = (detail) => {
    return detail.length > MAX_DETAIL_LEN
        ? `${detail.slice(0, MAX_DETAIL_LEN)}...`
        : detail;
};

function displayEventPage(eventId) {
    router.push({ name: "specific-event", params: { id: eventId } });
}
</script>

<style scoped>
th,
td {
    padding: 0.9rem;
    font-size: 0.9rem;
}
</style>
