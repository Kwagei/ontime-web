<template>
	<div
		class="table-responsive container p-0 d-flex flex-column"
		style="gap: 0.7rem"
	>
		<div>
			<table id="visitorsTable" class="table table-striped w-100"></table>
		</div>
		<div
			id="spinner"
			v-if="loader"
			class="d-flex justify-content-center p-4"
		>
			<div class="spinner-border" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from "vue";
import DataTables from "datatables.net-dt";
import "datatables.net-responsive-dt";

import { useRouter } from "vue-router";

const router = useRouter();

const visitors = ref([]);
const dataTable = ref(null);
const loader = ref(false);
const MAX_DETAIL_LEN = 30;

const refresh = defineModel("refresh");

watch(
	() => refresh.value,
	async () => {
		visitors.value = [];
		loader.value = true;
		await fetchVisitors();
		refresh.value = false;
	}
);

const visitorDetail = (id) => {
	router.push({ name: "visitorDetail", params: { id } });
};

const fetchVisitors = async () => {
	loader.value = false;
	nextTick(() => {
		// Reinitialize DataTables with updated data
		if (dataTable.value) {
			dataTable.value.destroy();
		}
		initializeDataTable();
	});
};

const formatDateTime = (visitors) => {
	return visitors.map((visitor) => {
		const [date] = visitor.created_at.split("T");
		visitor.created_at = date;
		return visitor;
	});
};

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
	dataTable.value = new DataTables("#visitorsTable", {
		serverSide: true,
		ajax: {
			url: "http://localhost:3000/api/visitors",
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
