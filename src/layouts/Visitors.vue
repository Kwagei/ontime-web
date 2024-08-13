<template>
	<div id="visitor-view" class="d-flex flex-column container">
		<div
			class="d-flex justify-content-between align-items-center container p-0 mx-auto"
		>
			<BreadCrumbs :breadCrumbs="breadCrumbs" />

			<div class="d-flex" style="gap: 0.521rem">
				<RefreshList @click="refresh = true" />
				<div class="dropdown">
					<Options />
					<ul class="dropdown-menu">
						<li
							@click="exportVisitors"
							id="export"
							class="dropdown-item"
						>
							Export visitors
						</li>
						<li
							@click="exportVisitors"
							id="filter-visitors"
							class="dropdown-item"
						>
							Filter Visitors
						</li>
					</ul>
				</div>

				<router-link :to="{ name: 'add-visitor' }">
					<button
						id="addVisitorBtn"
						type="button"
						class="btn btn-primary px-5"
					>
						<Icons v-model:icon="add" />
						New
					</button>
				</router-link>
			</div>
		</div>

		<VisitorList
			v-model:refresh="refresh"
			v-model:totalVisitors="totalVisitors"
		/>
		<RouterView :breadCrumbs="breadCrumbs" />
	</div>
</template>

<script setup>
import { onMounted } from "vue";

import BreadCrumbs from "../components/BreadCrumbs.vue";
import VisitorList from "../components/visitors/VisitorList.vue";
import RefreshList from "../components/RefreshList.vue";
import Options from "../components/Options.vue";
import Icons from "../components/Icons.vue";
const add = "add";

import { RouterLink, RouterView } from "vue-router";
import { csvExport, getVisitors } from "../assets/js/index.js";

const totalVisitors = defineModel("totalVisitors");
const breadCrumbs = defineModel("breadCrumbs");
const refresh = defineModel("refresh");

const exportVisitors = async () => {
	const { data: visitors } = await getVisitors({
		limit: totalVisitors.value,
	});

	csvExport(visitors);
};
</script>

<style scoped>
svg {
	height: 20px !important;
	margin: 0 !important;
}

#new-visitor:hover {
	color: white !important;
}

#visitor-view {
	gap: 1.5rem;
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

/* @media (min-width: 768px) and (max-width: 1440px) {
	#visitor-view {
		padding: 1rem 3rem 0 3rem;
	}
} */
</style>
