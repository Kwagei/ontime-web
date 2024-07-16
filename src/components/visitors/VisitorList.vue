<template>
    <div
        class="table-responsive container p-0 d-flex flex-column"
        style="gap: 0.7rem"
    >
        <div>
            <DataTable
                id="visitorsTable"
                :key="tableKey"
                class="display w-100 table nowrap"
                :columns="columns"
                :options="options"
                ref="table"
                v-show="!showError"
            />
            <h3 class="mt-5 text-center fw-bold" v-if="showError">
                Unable to load visitors, try again!
            </h3>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";
import { useRouter } from "vue-router";

import { API_URL } from "@/assets/js/index.js";
import { formatDateTime } from "@/assets/js/util.js";

DataTable.use(DataTablesCore);

const columns = [
	{ data: "first_name", title: "First name" },
	{ data: "middle_name", title: "Middle name" },
	{ data: "last_name", title: "Last name" },
	{ data: "msisdn", title: "Phone number" },
	{ data: "email", title: "Email" },
	{ data: "address", title: "Address" },
	{ data: "created_at", title: "Created At" },
];

const options = {
    responsive: true,
    select: true,
    serverSide: true,
    ajax: {
        url: `${API_URL}visitors`,
        type: "GET",
        data: (query) => {
            return {
                start: query.start,
                limit: query.length,
                search: query.search.value,
                sort: query.columns[query.order[0].column].data,
                order: query.order[0].dir,
            };
        },
        dataSrc: (json) => {
            showError.value = false;

            const { data, length } = json.data;

            json.recordsTotal = length;
            json.recordsFiltered = length;

            formatCreatedAt(data);

            visitors.value = data;
            return visitors.value;
        },
        error: (error) => {
            console.log("Error fetching data:", error);
        },
    },
    responsive: true,
    lengthMenu: [10, 25, 50, 100],
    language: {
        searchPlaceholder: "Search ...",
        search: "",
        emptyTable: `
			<div class="d-flex gap-3 my-3 flex-column align-items-center">
				No Visitor to show!
				<svg xmlns="http://www.w3.org/2000/svg" style="width: 80px; height: 80px" fill="currentColor" class="solaris-icon si-group" viewBox="0 0 1000 1000">
					<path d="M338 875V696.837A100.18 100.18 0 0 1 263 600V487.5a187.2 187.2 0 0 1 17.626-79.433 166.44 166.44 0 0 1-107.2-45.325A152.94 152.94 0 0 0 88 500v119.118C88 658.1 120.015 690 159 690v185a49.65 49.65 0 0 0 49.588 50h148.57A74.7 74.7 0 0 1 338 875m489.576-512.258a166.44 166.44 0 0 1-107.2 45.325A187.2 187.2 0 0 1 738 487.5V600a100.18 100.18 0 0 1-75 96.837V875a74.7 74.7 0 0 1-19.158 50h148.57A49.65 49.65 0 0 0 842 875V690c38.985 0 71-31.9 71-70.882V500a152.94 152.94 0 0 0-85.424-137.258M713 125a124.4 124.4 0 0 0-65.376 18.446c.9 1.913 1.769 3.84 2.6 5.794a162.38 162.38 0 0 1-24.162 166.435l7.231 3.564a187.9 187.9 0 0 1 66.676 55.086A125 125 0 1 0 713 125m-75 87.5A137.5 137.5 0 1 1 500.5 75 137.5 137.5 0 0 1 638 212.5m-15.763 129.164a177.47 177.47 0 0 1-243.474 0A162.5 162.5 0 0 0 288 487.5V600a75 75 0 0 0 75 75v200a50 50 0 0 0 50 50h175a50 50 0 0 0 50-50V675a75 75 0 0 0 75-75V487.5a162.5 162.5 0 0 0-90.763-145.836m-321.2 32.661a187.9 187.9 0 0 1 66.676-55.086l7.231-3.564A162.7 162.7 0 0 1 350.78 149.24c.827-1.954 1.7-3.881 2.6-5.794A125 125 0 1 0 288 375a126 126 0 0 0 13.035-.675Z" style="fill-rule:evenodd"/>
				</svg>
				<button
					class="btn btn-secondary"
					onclick="document.getElementById('addVisitorBtn').click()"
				>
					Add Visitor
				</button>
			</div>
        `,
        zeroRecords: `
			<div class="d-flex gap-3 my-3 flex-column align-items-center">
				No match found!
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
    order: [[6, "desc"]],
    destroy: true,
};

const table = ref();
const tableKey = ref(0);
const showError = ref(false);

const router = useRouter();
const refresh = defineModel("refresh");
const visitors = ref();

watch(
    () => refresh.value,
    () => {
        // update table Key to force data table to re render
        tableKey.value += 1;
    }
);

const visitorDetail = (id) => {
	router.push({ name: "visitorDetail", params: { id } });
};

const handleVisitorDetail = () => {
	const dt = table.value.dt;
	dt.on("click", "tr", function (event) {
		if (event.target.dataset.empty) addVisitor();

		const visitorData = dt.row(this).data();

		if (visitorData) {
			visitorDetail(visitorData.id);
		}
	});
};

// formatted by reference
const formatCreatedAt = (visitors) => {
    for (const visitor of visitors) {
        visitor.created_at = formatDateTime(visitor.created_at);
    }
};

onMounted(() => {
	handleVisitorDetail();
});
</script>

<style scoped>
table {
	margin: 0;
}

table input {
	background-color: red !important;
}

tr {
	cursor: pointer;
}

th,
td {
	padding: 0.9rem;
	font-size: 0.9rem;
}

@media (min-width: 768px) and (max-width: 1440px) {
	th,
	td {
		padding: 0.7rem;
	}
}

svg.solaris-icon {
	width: 1.2rem;
	height: 1.2rem;
}
</style>
