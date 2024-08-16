<template>
	<div id="visit-view" class="d-flex flex-column container">
		<div
			class="d-flex justify-content-between align-items-center container p-0 mx-auto"
		>
			<BreadCrumbs :breadCrumbs="breadCrumbs" />

			<div class="d-flex" style="gap: 0.521rem">
				<RefreshList @click="refresh = true" />

				<div class="dropdown">
					<Options />
					<ul class="dropdown-menu boxShadow rounded">
						<li
							@click="displayExportModay"
							id="export"
							class="dropdown-item"
						>
							Export
						</li>
						<li
							@click="displayFilterModal"
							id="filter-visits"
							class="dropdown-item"
						>
							Filter Visits
						</li>
					</ul>
				</div>

				<button
					data-bs-toggle="offcanvas"
					data-bs-target="#offcanvasExample"
					aria-controls="offcanvasExample"
					type="button"
					id="addVisitBtn"
					class="btn btn-primary"
				>
					<Icons v-model:icon="add" />
					New
				</button>

				<div
					class="offcanvas offcanvas-start"
					tabindex="-1"
					id="offcanvasExample"
					aria-labelledby="offcanvasExampleLabel"
				>
					<div class="offcanvas-header">
						<h5 class="offcanvas-title" id="offcanvasExampleLabel">
							Purpose
						</h5>
						<button
							type="button"
							class="btn-close"
							data-bs-dismiss="offcanvas"
							data-bs-toggle="tooltip"
							data-bs-placement="bottom"
							data-bs-title="Close"
						>
							<span class="visually-hidden">Close</span>
						</button>
					</div>
					<div class="m-3">
						<router-link :to="{ name: 'visits-event' }">
							<button
								type="button"
								class="btn btn-primary"
								id=""
								style="padding: 0.5rem 1.5rem; font-weight: 600"
							>
								Events
							</button>
						</router-link>

						<router-link>
							<button
								type="button"
								class="btn btn-primary"
								id=""
								style="padding: 0.5rem 1.5rem; font-weight: 600"
							>
								Meeting
							</button>
						</router-link>

						<router-link>
							<button
								type="button"
								class="btn btn-primary"
								id=""
								style="padding: 0.5rem 1.5rem; font-weight: 600"
								disabled
							>
								Workspace
							</button>
						</router-link>
					</div>
				</div>
			</div>
		</div>

		<VisitList
			v-model:refresh="refresh"
			v-model:filterDates="filterDates"
			v-model:totalVisits="totalVisits"
		/>

		<FilterModal @done="filterCompleted" />
		<ExportModal
			:exportFields="exportFields"
			v-model:exportTitle="exportTitle"
			@export="exportVisits"
		/>
		<RouterView />
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import BreadCrumbs from "../components/BreadCrumbs.vue";
import VisitList from "../components/visits/VisitList.vue";
import RefreshList from "../components/RefreshList.vue";
import Options from "../components/Options.vue";
import Icons from "../components/Icons.vue";
const add = "add";

import { RouterLink, RouterView } from "vue-router";
import { csvExport, getVisits } from "../assets/js/index.js";
import FilterModal from "@/components/modals/FilterModal.vue";
import ExportModal from "@/components/modals/ExportModal.vue";
import {
	formatDepartureTime,
	formatVisitData,
	showModal,
} from "@/assets/js/util";

const breadCrumbs = defineModel("breadCrumbs");
const refresh = defineModel("refresh");
const totalVisits = defineModel("totalVisits");
const exportTitle = defineModel("exportTitle");

const exportFields = ref([
	{ name: "Date time", selected: false },
	{ name: "Visitor", selected: false },
	{ name: "Purpose", selected: false },
	{ name: "Items", selected: false },
	{ name: "Gender", selected: false },
	{ name: "Room name", selected: false },
	{ name: "Host name", selected: false },
	{ name: "Phone number", selected: false },
	{ name: "Departure time", selected: false },
]);

exportTitle.value = "Visits";

const exportVisits = async (fields) => {
	const { visits } = await getVisits({
		limit: totalVisits.value,
	});

	const formattedVisitData = formatVisitData(visits);

	const selectedVisits = formattedVisitData.map((visit) => {
		const data = {};
		for (const field of fields) {
			if (field === "phone_number") {
				data[field] = `0${visit.msisdn.slice(3)}`;
			} else if (field === "items") {
				data[field] = visit[field].join(", ");
			} else {
				data[field] = visit[field];
			}
		}

		return data;
	});

	csvExport(selectedVisits);
};

const filterDates = ref({
	from: "",
	to: "",
});

function displayFilterModal() {
	showModal("#filterModal", "#modal-dialog");
}

const displayExportModay = () => {
	showModal("#exportModal", "#modal-dialog");
};

// update date ranges, then it will be caught by watchers in visits table
function filterCompleted(newDates) {
	filterDates.value = newDates;
}
</script>

<style scoped>
#visit-view {
	gap: 1.5rem;
}

svg {
	height: 20px !important;
	margin: 0 !important;
}

.btn {
	padding: 0.5rem !important;
}
.btn:hover {
	border: 0.125rem solid black !important;
}

.btn:hover g {
	fill: white;
}
.list-options svg {
	height: 20px !important;
	margin: 0 !important;
}
.m-3 {
	display: flex;
	height: 300px;
	align-items: center;
	flex-direction: column;
	/* background-color: aquamarine; */
	padding: 0.5rem;
	justify-content: space-between;
}

.m-3 button {
	width: 250px;
	padding: 0.5rem;
}
.offcanvas {
	position: fixed;
	z-index: 9999;
}

li {
	font-size: 1rem;
	font-weight: 600;
	padding: 0.75rem 1rem;
}
</style>
