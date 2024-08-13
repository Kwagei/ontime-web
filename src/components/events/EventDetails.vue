<template>
	<div class="d-flex align-items-center flex-column">
		<div class="w-100 d-flex justify-content-between gap-4 pt-3">
			<BreadCrumbs :breadCrumbs="['events', event.title]" />
			<div class="d-flex" style="gap: 0.521rem">
				<RefreshList @click="refresh = true" />

				<div class="dropdown">
					<Options />
					<ul class="dropdown-menu boxShadow rounded">
						<li
							id="edit-event"
							class="dropdown-item"
							@click="$emit('editEvent')"
						>
							Edit Event
						</li>
						<li
							id="export-participants"
							class="dropdown-item"
							@click="exportEventParticipants"
						>
							Export Participants
						</li>
						<li
							id="import-participants"
							class="dropdown-item"
							@click="emit('switch', 'importParticipants')"
						>
							Import Participants
						</li>
						<li
							id="today-addendance"
							class="dropdown-item"
							@click="emit('switch', 'todaysAttendance')"
						>
							Today's Attendance
						</li>
					</ul>
				</div>

				<button
					class="btn btn-primary"
					id="addParticipantBtn"
					@click="emit('switch', 'addParticipant')"
				>
					<Icons v-model:icon="add" />
					New
				</button>
			</div>
		</div>
		<div class="w-100 d-flex justify-content-between gap-4">
			<div
				class="d-flex justify-content-between mt-3 gap-4 mx-auto"
				style="width: 70%"
			>
				<div class="d-flex flex-column align-items-start">
					<span class="fs-6">Facilitator</span>
					<h4>{{ event.facilitator }}</h4>
					<span class="fs-6">Type</span>
					<h4>{{ event.type }}</h4>
					<span class="fs-6">Host</span>
					<h4>{{ event.host }}</h4>
					<span class="fs-6">Host Type</span>
					<h4>{{ event.host_type }}</h4>
				</div>
				<div class="d-flex flex-column align-items-end">
					<span class="fs-6">Start Date</span>
					<h4>
						{{ formatDateTime(event.start_date, { date: true }) }}
					</h4>
					<span class="fs-6">End Date</span>
					<h4>
						{{ formatDateTime(event.end_date, { date: true }) }}
					</h4>
					<span class="fs-6">Room</span>
					<h4>{{ event.room }}</h4>
					<span class="fs-6">Created At</span>
					<h4>
						{{ formatDateTime(event.created_at, { date: true }) }}
					</h4>
				</div>
			</div>
			<div v-show="event.details" class="border border-1"></div>
			<div v-show="event.details" class="w-50 pt-2 text-left flex-grow-1">
				<span class="fs-6">Details</span>
				<h5 class="mt-2 mb-0">{{ event.details }}</h5>
			</div>
		</div>
		<EventParticipants v-model:refresh="refresh" />
	</div>
</template>

<script setup>
import BreadCrumbs from "../BreadCrumbs.vue";
import EventParticipants from "./EventParticipants.vue";
import Icons from "../Icons.vue";
import { formatDateTime } from "@/assets/js/util.js";
import RefreshList from "../RefreshList.vue";
import { csvExport, getParticipants } from "@/assets/js";
import { ref, onMounted } from "vue";
import Options from "../Options.vue";

const add = "add";
const refresh = defineModel("refresh");
const totalEventParticipants = defineModel("totalEventParticipants");

const exportEventParticipants = async () => {
	const { participants } = await getParticipants(props.event.id, {
		limit: totalEventParticipants.value,
	});

	csvExport(
		participants.map((participant) => {
			participant.event_title = props.event.title;
			delete participant.event_id;
			delete participant.participant_id;
			delete participant.visit_date_time;
			delete participant.visit_departure_time;
			return participant;
		})
	);
};

const props = defineProps({
	event: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(["editEvent", "switch"]);
</script>

<style scoped>
svg {
	height: 20px !important;
	margin: 0 !important;
}

#addParticipantBtn {
	padding: 0.5rem;
}

li {
	font-size: 1rem;
	font-weight: 600;
	padding: 0.75rem 1rem;
}
</style>
