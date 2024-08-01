<template>
	<h4 style="margin-bottom: 1.5rem">Weekly Visits</h4>
	<div class="data d-flex gap-4 px-3 mb-4">
		<div class="data-body">
			<div class="d-flex align-items-center gap-1">
				<span class="male-color"></span>
				<span>Male</span>
			</div>
			<h3 class="mb-1">{{ gender.male }}</h3>
		</div>
		<div class="data-body">
			<div class="d-flex align-items-center gap-1">
				<span class="female-color"></span>
				<span>Female</span>
			</div>
			<h3 class="mb-1">{{ gender.female }}</h3>
		</div>
	</div>
	<Line :data="chartData" :options="options" />
</template>
<script setup>
import { onMounted, ref } from "vue";
import { Line } from "vue-chartjs";
import {
	Chart as ChartJS,
	LineElement,
	PointElement,
	LinearScale,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

// Register the Chart.js components
ChartJS.register(
	LineElement,
	PointElement,
	LinearScale,
	Title,
	Tooltip,
	Legend
);

const gender = ref({
	male: 0,
	female: 0,
});

const chartData = ref({
	labels: [],
	datasets: [],
});

const options = ref({
	responsive: true,
	plugins: {
		legend: {
			display: false,
		},
		tooltip: {
			callbacks: {
				label: function (tooltipItem) {
					return tooltipItem.dataset.label + ": " + tooltipItem.raw;
				},
			},
		},
	},
	scales: {
		x: {
			title: {
				display: true,
				text: "Days of Week",
			},
		},
		y: {
			title: {
				display: true,
				text: "Number of Visits",
			},
			beginAtZero: true,
		},
	},
});

import { getVisits } from "@/assets/js";

const totalVisits = defineModel("totalVisits");

const date = new Date();
const currentYear = date.getFullYear();
const currentMonth = date.getMonth();

const fetchVisits = async () => {
	const { visits } = await getVisits({ limit: totalVisits.value });

	const currentWeekVisits = visits.filter(
		(visit) =>
			visit.date_time.startsWith(currentYear) &&
			+visit.date_time.split("-")[1] === currentMonth + 1
	);

	updateWeeklyVisitData(currentWeekVisits);
};

const updateWeeklyVisitData = (visits) => {
	const { daysOfWeek, datesOfWeek } = getCurrentWeekDays();

	const maleVisits = new Array(7).fill(0);
	const femaleVisits = new Array(7).fill(0);

	for (const visit of visits) {
		const dayIndex = datesOfWeek.indexOf(
			new Date(visit.date_time).getDate()
		);
		if (visit.gender === "male") {
			maleVisits[dayIndex]++;
			gender.value.male++;
		} else {
			femaleVisits[dayIndex]++;
			gender.value.female++;
		}
	}

	chartData.value = {
		labels: daysOfWeek,
		datasets: [
			{
				label: "Male",
				backgroundColor: "rgba(255, 121, 0, 0.2)",
				borderColor: "#ff7900",
				data: maleVisits,
				fill: true,
			},
			{
				label: "Female",
				backgroundColor: "rgba(0, 191, 255, 0.2)",
				borderColor: "#1971c2",
				data: femaleVisits,
				fill: true,
			},
		],
	};
};

const getCurrentWeekDays = (date = new Date()) => {
	const startOfWeek = date.getDate() - date.getDay();
	const daysOfWeek = [];
	const datesOfWeek = [];

	for (let i = 0; i < 7; i++) {
		const currentDay = new Date(date);
		currentDay.setDate(startOfWeek + i);

		datesOfWeek.push(currentDay.getDate());

		const options = { weekday: "short" };
		daysOfWeek.push(currentDay.toLocaleDateString("en-US", options));
	}

	return {
		daysOfWeek: daysOfWeek.slice(1),
		datesOfWeek: datesOfWeek.slice(1),
	};
};

onMounted(async () => {
	await fetchVisits();
});
</script>
<style scoped>
h4 {
	text-align: left;
}

.border-color {
	padding: 0.1rem;
}

span {
	font-weight: 400;
}

.male-color {
	padding: 0.3rem;
	background-color: #ff7900;
	height: 1px;
	border-radius: 50%;
}

.female-color {
	padding: 0.3rem;
	background-color: #1971c2;
	height: 1px;
	border-radius: 50%;
}
</style>
