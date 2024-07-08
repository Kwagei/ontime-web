<template>
	<div
		class="table-responsive container p-0 d-flex flex-column"
		style="gap: 0.7rem"
	>
		<div>
			<DataTable
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
import { API_URL, updateDepartureTime } from "@/assets/js/index";
import { onMounted, ref, watch } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";

DataTable.use(DataTablesCore);

const columns = [
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
				order: query.order[0].dir,
			};
		},
		dataSrc: (json) => {
			const { visits, length } = json.data;

			json.recordsTotal = length;
			json.recordsFiltered = length;
			return [];
			return formatDateTime(visits);
		},

		error: (xhr, error, thrown) => {
			console.log("Error fetching data:", error);
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
            Please click the add visit button to create new visits.
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

const table = ref();

const handleVisitorDetail = () => {
	const dt = table.value.dt;

	dt.on("click", "tr", function (event) {
		const target = $(event.target).closest("tr");
		const { id } = dt.row(this).data();
		handleCheckout(id, target);
	});
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

onMounted(async () => {
	handleVisitorDetail();
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
