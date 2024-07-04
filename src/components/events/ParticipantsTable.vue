<template>
    <div>
        <table id="participantsTable" class="table table-striped w-100"></table>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import DataTables from "datatables.net-dt";
import "datatables.net-responsive-dt";

const dataTable = ref(null);
const MAX_DETAIL_LEN = 30;

const props = defineProps({
    participants: {
        type: Array,
        required: true,
    },
});

function formatAddress(address) {
    if (!address) {
        return "";
    }
    const addressLen = address.length;
    const newAddress =
        addressLen >= MAX_DETAIL_LEN
            ? `${address.slice(0, MAX_DETAIL_LEN)}...`
            : address;

    return newAddress;
}

const initializeDataTable = () => {
    dataTable.value = new DataTables("#participantsTable", {
        serverSide: true,
        ajax: {
            url: `http://localhost:3000/api/events/${id}/participants`,
            type: "GET",
            data: (query) => {
                return {
                    start: query.start,
                    limit: query.length,
                    search: query.search.value,
                    sort: query.columns[query.order[0].column].data,
                    direction: query.order[0].dir,
                };
            },
            dataSrc: (json) => {
                visitors.value = json.data;
                visitors.value.forEach((visitor) => {
                    visitor.address = formatAddress(visitor.address);
                });
                return formatDateTime(visitors.value);
            },
            error: (xhr, error, thrown) => {
                console.log("Error fetching data:", error);
            },
        },
        columns: [
            { data: "created_at", title: "Created At" },
            { data: "first_name", title: "First name" },
            { data: "middle_name", title: "Middle name" },
            { data: "last_name", title: "Last name" },
            { data: "msisdn", title: "Phone number" },
            { data: "email", title: "Email" },
            { data: "address", title: "Address" },
        ],
        responsive: true,
        lengthMenu: [10, 25, 50, 100],
        language: {
            searchPlaceholder: "Search ...",
            search: "",
        },
    });

    // Handle row click event
    dataTable.value.on("click", "tr", function () {
        const rowData = dataTable.value.row(this).data();
        if (rowData) {
            visitorDetail(rowData.id);
        }
    });
};

onMounted(() => {
    initializeDataTable();
});

const emit = defineEmits([
    "addParticipant",
    "newSortTerm",
    "ascend",
    "descend",
]);
</script>

<style scoped>
/* code... */
</style>
