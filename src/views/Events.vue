<template>
	<div id="eventsWrapper" class="d-flex flex-column container">
		<div
			class="d-flex justify-content-between align-items-center container p-0 mx-auto"
		>
			<BreadCrumbs :breadCrumbs="breadCrumbs" />
			<div class="d-flex" style="gap: 0.521rem">
				<RefreshList @click="refreshEvents" />
				<Options />
				<router-link :to="{ name: 'add-event' }">
					<button
						style="height: 45px !important; width: 150px !important"
						class="btn btn-primary"
					>
						Add Event
					</button>
				</router-link>
			</div>
		</div>
		<div class="d-flex justify-content-between my-4">
			<Search v-model:search="searchQuery" />
			<Filter />
			<Sort
				:sortTerms="sortTerms"
				v-model:term="sort"
				v-model:direction="direction"
			/>
		</div>
		<EventsTable
			:searchQuery="searchQuery"
			:refresh="refresh"
			:term="term"
			:direction="direction"
			@refreshComplete="stopEventsRefresh"
		/>
	</div>
</template>

<script setup>
import RefreshList from "../components/RefreshList.vue";
import BreadCrumbs from "../components/BreadCrumbs.vue";
import Options from "../components/Options.vue";
import Search from "../components/Search.vue";
import Filter from "../components/Filter.vue";
import Sort from "../components/Sort.vue";
import EventsTable from "../components/events/EventsTable.vue";

import { ref } from "vue";
import $ from "jquery";

const props = defineProps({
	breadCrumbs: {
		type: Array,
		required: true,
	},
});

const sortTerms = ref([
	{ type: "Created At", term: "created_at" },
	{ type: "Title", term: "title" },
	{ type: "Start Date", term: "start_date" },
	{ type: "End Date", term: "end_date" },
	{ type: "Type", term: "type" },
	{ type: "Facilitator", term: "facilitator" },
]);
const term = ref("created_at");
const direction = ref("asc");

const searchQuery = ref("");

const refresh = ref(false);

function refreshEvents() {
	refresh.value = true;
	$(".refresh").css("pointer-events", "none");
}

function stopEventsRefresh() {
	// refresh and then set refresh back to false
	refresh.value = false;
	$(".refresh").css("pointer-events", "auto");
}
</script>

<style scoped>
svg {
	height: 20px !important;
	margin: 0 !important;
}

#new-visitor:hover {
	color: white !important;
}

#eventsWrapper {
	gap: 1.5rem;
	padding-top: 2rem;
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

@media (min-width: 768px) and (max-width: 1440px) {
	#eventsWrapper {
		padding: 1rem 3rem 0 3rem;
	}
}
</style>
