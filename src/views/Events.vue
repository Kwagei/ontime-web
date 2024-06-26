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
						type="button"
						class="btn btn-primary"
						id="new-visitor"
						style="
							padding: 0.7rem 2rem !important;
							font-weight: 600;
						"
					>
						Add Event
					</button>
				</router-link>
			</div>
		</div>
		<!-- <div class="d-flex justify-content-between my-4">
			<div>
				<BreadCrumbs :breadCrumbs="breadCrumbs" />
			</div>
			<div>
				<RefreshList @click="refreshEvents" />
				<Options class="mx-2" />
				<router-link :to="{ name: 'add-event' }">
					<button
						style="
							padding: 0.7rem 2rem !important;
							font-weight: 600;
						"
						class="btn btn-primary"
					>
						Add Event
					</button>
				</router-link>
			</div>
		</div> -->
		<div class="d-flex justify-content-between my-4">
			<Search v-model:search="searchQuery" />
			<Filter />
			<Sort :sortTerms="sortTerms" />
		</div>
		<EventsList
			:searchQuery="searchQuery"
			:refresh="refresh"
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
import EventsList from "../components/events/EventsList.vue";

import { ref } from "vue";
import $ from "jquery";

const props = defineProps({
	breadCrumbs: {
		type: Array,
		required: true,
	},
});

const sortTerms = ref([
	{ type: "Title", term: "title" },
	{ type: "Start Date", term: "start_date" },
	{ type: "End Date", term: "end_date" },
	{ type: "Type", term: "type" },
	{ type: "Facilitator", term: "facilitator" },
]);
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
