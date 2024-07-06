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
    No Visitor to show!
    <svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M33.8 87.5V69.684A10.02 10.02 0 0126.3 60V48.75a18.7 18.7 0 011.763-7.943 16.64 16.64 0 01-10.72-4.533A15.29 15.29 0 008.8 50v11.912C8.8 65.81 12.001 69 15.9 69v18.5a4.965 4.965 0 004.959 5h14.857a7.47 7.47 0 01-1.916-5m48.958-51.226a16.64 16.64 0 01-10.72 4.533A18.7 18.7 0 0173.8 48.75V60a10.02 10.02 0 01-7.5 9.684V87.5a7.47 7.47 0 01-1.916 5h14.857a4.965 4.965 0 004.959-5V69c3.899 0 7.1-3.19 7.1-7.088V50a15.29 15.29 0 00-8.542-13.726M71.3 12.5a12.44 12.44 0 00-6.538 1.845q.135.286.26.579a16.24 16.24 0 01-2.416 16.644l.723.356a18.8 18.8 0 016.668 5.509A12.5 12.5 0 1071.3 12.5m-7.5 8.75A13.75 13.75 0 1150.05 7.5 13.75 13.75 0 0163.8 21.25m-1.576 12.916a17.747 17.747 0 01-24.348 0A16.25 16.25 0 0028.8 48.75V60a7.5 7.5 0 007.5 7.5v20a5 5 0 005 5h17.5a5 5 0 005-5v-20a7.5 7.5 0 007.5-7.5V48.75a16.25 16.25 0 00-9.076-14.584m-32.12 3.266a18.8 18.8 0 016.667-5.508l.723-.357a16.27 16.27 0 01-2.416-16.643q.125-.292.26-.58A12.5 12.5 0 1028.8 37.5a13 13 0 001.304-.067Z"/></svg>
    Please click the add visitor button to create new visitor.
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
