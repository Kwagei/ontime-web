<template>
	<h4 class="mb-2">Calender</h4>
	<div class="data d-flex gap-3 px-3 mb-3"></div>
	<FullCalendar id="table" :options="calendarOptions" :key="calendarIndex" />
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

import { getEvents } from "@/assets/js";
import { formatDateTime } from "@/assets/js/util";

const formatedEvents = ref();
const calendarIndex = ref(0);
const allEvents = defineModel("allEvents");

const calendarOptions = ref({
	plugins: [dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin],
	headerToolbar: {
		left: "title",
		center: "dayGridMonth,timeGridWeek,timeGridDay",
		right: "prev next",
	},
	initialView: "dayGridMonth",
	weekends: true,
	selectable: true,

	eventMouseEnter: function (info) {
		new boosted.Tooltip(info.el, {
			animation: true,
			html: true,
			container: "body",
			title: `<div>
            <div class="tooltip-body">
                <h6> ${info.event.title} </h6>

                <div class="tooltip-content d-flex flex-column">

                    <div>
                        <small>
                            Start Date:
                            <strong> ${formatDateTime(
								info.event.extendedProps.start,
								{ date: true }
							)} </strong>
                        <small/>
                    </div>

                    <div>
                        <small>
                        End Date: <strong> ${formatDateTime(
							info.event.extendedProps.end,
							{ date: true }
						)} </strong>
                        <small/>

                    </div>
                </div>
            </div>
        </div>`,
		});
	},
	eventMouseLeave: function () {
		const tooltip = document.querySelector(".tooltip");
		// Remove the tooltip
		if (tooltip) {
			document.body.removeChild(tooltip);
		}
	},
});

const fetchEvents = async () => {
	const { totalLength } = await getEvents();

	const { events } = await getEvents(null, {
		limit: totalLength,
	});
	allEvents.value = events;
	formatedEvents.value = formatEvents(events);
};

const formatEvents = (events) => {
	return events.map((event) => {
		return {
			title: event.title,
			date: event.start_date.split("T")[0],
			url: `events/${event.id}`,
			extendedProps: {
				start: event.start_date,
				end: event.end_date,
				details: event.details,
				room: event.room,
				type: event.type,
				host: event.host,
				facilitator: event.facilitator,
			},
		};
	});
};

onMounted(async () => {
	await fetchEvents();
});

watch(
	formatedEvents,
	(newEvents) => {
		calendarOptions.value.events = newEvents;
		calendarIndex.value++;
	},
	{
		immediate: true,
	}
);
</script>
<style>
h4 {
	text-align: left;
}

.fc-toolbar-title {
	font-size: 1rem !important;
	font-weight: 400;
}

a.fc-event {
	background-color: #ff7900 !important;
	border: 0.125rem solid #ff7900 !important;
}

.fc-event:hover .fc-event-title {
	color: #ff7900 !important;
}

.fc-event:hover {
	background-color: white !important;
}

.border-color {
	padding: 0.1rem;
}

.fc-button-group > button,
.fc-prev-button,
.fc-next-button {
	background: white !important;
	color: black !important;
	padding: 0.3em 0.55em !important;
}

.fc-button-group > .fc-button.fc-button-active {
	background-color: black !important;
	color: white !important;
	font-weight: 700 !important;
}

.fc-button {
	border: 0.125rem solid black !important;
}

.fc-button-group > .fc-button:hover,
.fc-prev-button:hover,
.fc-next-button:hover {
	background-color: black !important;
	font-weight: 700 !important;
	color: white !important;
}

.fc .fc-col-header-cell-cushion {
	padding-top: 1px;
	padding-bottom: 1px;
}
</style>
