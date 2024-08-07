<template>
	<div>
		<div class="">
			<h4 class="mb-2">Calender</h4>
		</div>
		<DxScheduler
			:data-source="dataSource"
			:current-date="currentDate"
			:views="views"
			:height="500"
			:editing="false"
			:show-all-day-panel="false"
			:start-day-hour="7"
			:start-date-expr="'start.dateTime'"
			:end-date-expr="'end.dateTime'"
			:text-expr="'summary'"
			time-zone="America/Los_Angeles"
			current-view="month"
		/>
	</div>
</template>

<script setup>
import { GOOGLE_CALENDAR_API_URL, getEvents } from "@/assets/js";
import DxScheduler from "devextreme-vue/scheduler";
import CustomStore from "devextreme/data/custom_store";
import { onMounted, ref } from "vue";

const views = ["day", "workWeek", "month"];
const currentDate = new Date();
const dataSource = new CustomStore({
	load: async (options) => await getData(options, { showDeleted: false }),
});

const getData = async (_, requestOptions) => {
	return fetch(GOOGLE_CALENDAR_API_URL, requestOptions)
		.then((response) => response.json())
		.then(async (data) => {
			return await fetchEvents();
		});
};

const fetchEvents = async () => {
	const { totalLength } = await getEvents();

	const { events } = await getEvents(null, {
		limit: totalLength,
	});
	return formatEvents(events);
};

const formatEvents = (events) => {
	return events.map((event) => {
		return {
			summary: event.title,
			start: {
				dateTime: event.start_date,
			},
			end: {
				dateTime: event.end_date,
			},
		};
	});
};
</script>

<style>
.long-title h3 {
	font-family: "Segoe UI Light", "Helvetica Neue Light", "Segoe UI",
		"Helvetica Neue", "Trebuchet MS", Verdana;
	font-weight: 200;
	font-size: 28px;
	text-align: center;
	margin-bottom: 20px;
}
</style>
