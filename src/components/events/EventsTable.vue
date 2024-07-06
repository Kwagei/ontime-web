<template>
	<div
		class="table-responsive container p-0 d-flex flex-column"
		style="gap: 0.7rem"
	>
		<div>
			<DataTable
				id="eventssTable"
				class="display w-100 table"
				:columns="columns"
				:options="options"
				ref="table"
			/>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";
import { API_URL } from "@/assets/js";

DataTable.use(DataTablesCore);

const columns = [
	{ data: "title", title: "Title" },
	{ data: "host", title: "Host" },
	{ data: "start_date", title: "Start Date" },
	{ data: "end_date", title: "End Date" },
	{ data: "facilitator", title: "Facilitator" },
	{ data: "event_type", title: "Type" },
	{ data: "details", title: "Details" },
];

const options = {
	responsive: true,
	select: true,
	serverSide: true,
	ajax: {
		url: `${API_URL}events`,
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
			const { events, length } = json.data;

			json.recordsTotal = length;
			json.recordsFiltered = length;

			events.forEach((event) => {
				event.details = formatDetails(event.details);
				event.start_date = formatDate(event.start_date);
				event.end_date = formatDate(event.end_date);
			});

			return events;
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
	order: [[2, "desc"]],
	destroy: true,
};

const router = useRouter();
const MAX_DETAIL_LEN = 30;

const table = ref();

onMounted(() => {
	handleEventDetail();
});

const handleEventDetail = () => {
	const dt = table.value.dt;
	dt.on("click", "tr", function () {
		const { id } = dt.row(this).data();
		displayEventPage(id);
	});
};

const formatDate = (date) => {
	const rawDate = new Date(date);
	return rawDate.toString().split(" 0")[0];
};

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
.cursorPointer {
	cursor: pointer;
}

th,
td {
	padding: 0.9rem;
	font-size: 0.9rem;
}
</style>
