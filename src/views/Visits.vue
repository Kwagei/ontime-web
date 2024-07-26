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
					<ul class="dropdown-menu">
						<li id="export" class="dropdown-item">Export</li>
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

		<VisitList v-model:refresh="refresh" />
		<RouterView />
	</div>
</template>

<script setup>
import { onMounted } from "vue";

import BreadCrumbs from "../components/BreadCrumbs.vue";
import VisitList from "../components/visits/VisitList.vue";
import RefreshList from "../components/RefreshList.vue";
import Options from "../components/Options.vue";
import Icons from "../components/Icons.vue";
const add = "add";

import { RouterLink, RouterView } from "vue-router";
import { csvExport, getVisits } from "../assets/js/index.js";

const breadCrumbs = defineModel("breadCrumbs");
const refresh = defineModel("refresh");

const totalVisits = defineModel("totalVisits");

const exportVisits = async () => {
	const { visits } = await getVisits({
		limit: totalVisits.value,
	});

	csvExport(
		visits.map((visit) => {
			visit.items = formatItems(visit.items);
			delete visit.room_id;
			delete visit.host_id;
			delete visit.participant_id;
			return visit;
		})
	);
};

const formatItems = (belonging) => {
	const items = belonging.join(", ");
	return items.length > 30 ? `${items.slice(0, 30)}...` : items;
};

onMounted(() => {
	const exportBtn = document.querySelector("#export");
	exportBtn.addEventListener("click", exportVisits);
});
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

/* @media (min-width: 768px) and (max-width: 1440px) {
	#visit-view {
		padding: 1rem 3rem 0 3rem;
	}
} */
</style>
