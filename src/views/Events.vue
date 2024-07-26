<template>
	<div id="eventsWrapper" class="d-flex flex-column container">
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
							@click="exportEvents"
							id="export"
							class="dropdown-item"
						>
							Export
						</li>
					</ul>
				</div>

				<router-link :to="{ name: 'add-event' }">
					<button
						id="addEventBtn"
						type="button"
						class="btn btn-primary"
					>
						<Icons v-model:icon="add" />
						New
					</button>
				</router-link>
			</div>
		</div>
		<EventsTable v-model:refresh="refresh" />
	</div>
</template>

<script setup>
import RefreshList from "../components/RefreshList.vue";
import BreadCrumbs from "../components/BreadCrumbs.vue";
import EventsTable from "../components/events/EventsTable.vue";
import Options from "../components/Options.vue";
import Icons from "../components/Icons.vue";
const add = "add";

import { ref, onMounted } from "vue";
import { csvExport, getEvents } from "../assets/js/index.js";

const props = defineProps({
	breadCrumbs: {
		type: Array,
		required: true,
	},
});

const refresh = ref(false);
const totalEvents = defineModel("totalEvents");

const exportEvents = async () => {
	const { events } = await getEvents("", {
		limit: totalEvents.value,
	});

	csvExport(
		events.map((event) => {
			delete event.room_id;
			delete event.host_id;
			return event;
		})
	);
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

#eventsWrapper {
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
</style>
