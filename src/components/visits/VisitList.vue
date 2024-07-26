<template>
	<div
		class="table-responsive container p-0 d-flex flex-column"
		style="gap: 0.7rem"
	>
		<div>
			<DataTable
				:key="tableKey"
				id="visitsTable"
				class="display w-100 table"
				:columns="columns"
				:options="options"
				ref="table"
			/>
		</div>
	</div>
</template>

<script setup>
import { API_URL, updateDepartureTime } from "@/assets/js/index.js";
import dayjs from "dayjs";
import { onMounted, ref, watch } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";

DataTable.use(DataTablesCore);

const totalVisits = defineModel("totalVisits");
const refresh = defineModel("refresh");
const tableKey = ref(0);

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
                            style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" ${
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
		url: `${API_URL}/visits`,
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
				order: query.order[0].dir,
			};
		},
		dataSrc: (json) => {
			const { visits, length } = json.data;

			totalVisits.value = length;

			json.recordsTotal = length;
			json.recordsFiltered = length;
			return formatDateTime(visits);
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
};

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
		departure_time.text(time);
	} catch (error) {
		console.error("Error updating departure time:", error);
	}
};

const table = ref();

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

const formatDateTime = (visits) => {
	return visits.map((visit) => {
		const now = dayjs(visit.date_time);

		if (visit.date_time) {
			visit.date_time =
				now.format("dddd, MMMM D, YYYY") + " " + now.format("HH:mm:ss");
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

watch(
	() => refresh.value,
	() => {
		// update table Key to force data table to re render
		tableKey.value += 1;
	}
);

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
