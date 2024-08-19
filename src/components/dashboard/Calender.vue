<template>
	<div class="is-light-mode">
		<div class="mb-4" style="text-align: left">
			<h4>Calender</h4>
		</div>
		<Qalendar style="height: 50vh" :events="allEvents" :config="config" />
	</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Qalendar } from "qalendar";
import { getEvents } from "@/assets/js";

const allEvents = defineModel("allEvents");

const fetchEvents = async () => {
	const { totalLength } = await getEvents();

	const { events } = await getEvents(null, {
		limit: totalLength,
	});

	const formattedEvents = formatEvents(events);
	allEvents.value = formattedEvents;
};

const formatEvents = (events) => {
	return events.map((event) => {
		return {
			title: event.title,
			with: event.host,
			time: {
				start: formatEventDateTime(event.start_date),
				end: formatEventDateTime(event.end_date),
			},
			isEditable: false,
			id: event.id,
			description: event.details,
			location: event.room,
			color: "blue",
		};
	});
};

const formatEventDateTime = (dateTime) => {
	const [date, time] = dateTime.split("T");
	return `${date} ${time ? time.slice(0, 5) : ""}`;
};

onMounted(async () => {
	await fetchEvents();
});

const config = ref({
	week: {
		startsOn: "sunday",
		nDays: 6,
		scrollToHour: 5,
	},
	month: {
		showTrailingAndLeadingDates: false,
	},
	style: {
		fontFamily: "inherit",
	},
	showCurrentTime: true,
	defaultMode: "month",
});
</script>

<style>
@import "qalendar/dist/style.css";

.svg-inline--fa.fa-calendar-day,
.date-picker__value-display-text {
	margin: auto;
}

.calendar-month__week-day-name,
.calendar-month__day-name {
	margin: 0 !important;
	padding: 1rem;
	font-weight: 700 !important;
}

.calendar-month__weekday {
	display: flex;
	justify-content: center;
	align-items: center;
}

.calendar-month__event {
	display: flex;
	justify-content: center;
	align-items: center;
}

.date-picker__value-display,
.calendar-header__chevron-arrows {
	gap: 0rem !important;
}

.calendar-header {
	padding: 0.7rem 2rem !important;
}

.event-flyout__row.is-description {
	font-size: small;
	text-align: left;
}
</style>
