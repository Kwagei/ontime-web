<template>
	<div class="">
		<div class="container text-center">
			<div class="row gap-4 mb-5">
				<div class="" id="stats">
					<div class="row align-items-start gap-4">
						<div
							class="form-control col py-3 px-4 d-flex rounded align-items-center gap-4"
							style="
								padding-left: 2.5rem !important;
								flex: 0 0 30%;
							"
						>
							<div
								id="visitIcon"
								class="icon-circle"
								style="background-color: #ff77002a"
							>
								<Icons class="icons" v-model:icon="visitIcon" />
							</div>
							<div
								class="cards d-flex flex-column align-items-end"
							>
								<span>Today's Visits</span>
								<h2>
									{{ todaysVisits || 0 }}
								</h2>
							</div>
						</div>
						<div
							class="form-control col py-3 px-4 d-flex rounded align-items-center gap-4"
							style="
								padding-left: 2.5rem !important;
								flex: 0 0 30%;
							"
						>
							<div
								id="eventIcon"
								class="icon-circle"
								style="background-color: #1970c221"
							>
								<Icons class="icons" v-model:icon="eventIcon" />
							</div>
							<div
								class="cards d-flex flex-column align-items-end"
							>
								<span>Today's Events</span>
								<h2>{{ todaysEvents }}</h2>
							</div>
						</div>
						<div
							class="form-control col d-flex rounded align-items-center gap-4"
							style="
								margin-top: auto;
								padding: 0 !important;
								background: transparent;
								border: none;
							"
						>
							<router-link to="/visits/purpose-event">
								<button class="btn btn-primary px-4 py-2">
									Check In
								</button>
							</router-link>
						</div>
					</div>
				</div>
				<div class="form-control rounded col">
					<Line
						v-model:totalVisits="totalVisits"
						v-model:todaysVisits="todaysVisits"
					/>
				</div>

				<div class="form-control rounded col">
					<Bar v-model:totalVisits="totalVisits" />
				</div>

				<div class="form-control rounded col-12" style="padding: 3rem">
					<Calender v-model:allEvents="allEvents" />
				</div>
			</div>

			<h4>Last 5 Check In</h4>
			<div class="row">
				<div class="col p-0">
					<VisitList
						v-model:lengthMenu="lengthMenu"
						v-model:recordsFiltered="recordsFiltered"
						v-model:totalVisits="totalVisits"
						v-model:dateRangeDates="dateRangeDates"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import Bar from "../components/dashboard/charts/Bar.vue";
import Line from "../components/dashboard/charts/Line.vue";
import Calender from "../components/dashboard/Calender.vue";
import { RouterLink } from "vue-router";

import VisitList from "@/components/visits/VisitList.vue";
import Icons from "@/components/Icons.vue";
import { ref, watch } from "vue";

const visitIcon = "house";
const eventIcon = "calendar-event-agenda";

const totalVisits = defineModel("totalVisits");
const lengthMenu = defineModel("recordsTotal");
const recordsFiltered = defineModel("recordsFiltered");
const todaysVisits = defineModel("todaysVisits");
const todaysEvents = ref(0);
const allEvents = defineModel("allEvents");

lengthMenu.value = [5];
recordsFiltered.value = 5;

const dateRangeDates = ref({
	from: "",
	to: "",
});

watch(allEvents, (events) => {
	todaysEvents.value = getTodaysEvents(events).length;
});

const isEventHappeningToday = (event) => {
	const today = new Date();

	// Normalize today's date to midnight
	const startOfToday = new Date(today.setHours(0, 0, 0, 0)).toISOString();
	const endOfToday = new Date(today.setHours(23, 59, 59, 999)).toISOString();

	return (
		new Date(event.start_date) <= new Date(endOfToday) &&
		new Date(event.end_date) >= new Date(startOfToday)
	);
};

const getTodaysEvents = (events) => {
	return events.filter(isEventHappeningToday);
};
</script>

<style>
.col {
	padding: 3rem;
}

h4 {
	text-align: left;
}

span {
	font-weight: 400;
}

.icon-circle {
	width: 5rem;
	height: 5rem;
	border-radius: 3rem;
	display: flex;
	justify-content: center;
	align-items: center;
}

.cards {
	padding-left: 1rem;
}

.cards span {
	font-size: large;
	font-weight: 400;
}

.cards h2 {
	font-size: xx-large;
	margin: 0;
}

.icons {
	width: 4rem !important;
	height: 3rem !important;
}

#visitIcon {
	color: #ff7900;
}

#eventIcon {
	color: #1971c2;
}
</style>
