<template>
	<h4 style="margin-bottom: 1.5rem">Monthly Visits</h4>
	<div class="data d-flex gap-4 px-3 mb-4">
		<div
			class="data-body"
			v-for="monthlyVisit in monthlyVisitData"
			:key="monthlyVisit.name"
		>
			<span>{{ monthlyVisit.name }} {{ currentYear }}</span>
			<h3 class="mb-1">{{ monthlyVisit.total }}</h3>
			<div
				class="border-color"
				:style="`background-color: ${monthlyVisit.color}`"
			></div>
		</div>
	</div>
	<Bar :data="data" :options="options" :key="barIndex" />
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";

// Register the Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const dataLabel = ref([]);
const dataSets = ref([]);

// Define chart data and options as reactive objects
const data = ref({
	labels: dataLabel.value,
	datasets: dataSets.value,
});

const options = ref({
	responsive: true,
	plugins: {
		legend: {
			display: false,
		},
	},
	scales: {
		x: {
			title: {
				display: true,
				text: "Visits for the last 3 months",
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
const colors = [
	{ rank: "max", color: "#2f9e44" },
	{ rank: "mid", color: "#1971c2" },
	{ rank: "min", color: "#e03131" },
];

const fetchVisits = async () => {
	const { visits } = await getVisits({
		limit: totalVisits.value,
	});

	const currentYearVisits = visits.filter((visit) =>
		visit.date_time.startsWith(currentYear)
	);

	updateMonthlyVisitData(currentYearVisits);
};

const monthlyVisitData = ref([]);

const updateMonthlyVisitData = (visits) => {
	const monthLabels = [];

	for (let i = 3; i > 0; i--) {
		// Calculate the month index, considering the year transition
		const monthIndex = (currentMonth + 1 - i + 12) % 12;
		const monthName = months[monthIndex];
		monthLabels.push(monthName);

		// Determine the month number to compare with visit data
		const targetMonthNumber = monthIndex + 1;

		// Filter visits for the specific month
		const filteredVisits = visits.filter((visit) => {
			const visitMonthNumber = +visit.date_time.split("-")[1];
			return targetMonthNumber === visitMonthNumber;
		});

		// Update the monthly visit data
		monthlyVisitData.value.push({
			name: monthName.slice(0, 3),
			total: filteredVisits.length,
		});
	}

	assignColors();

	// Update dataLabel.value with the month labels for the chart
	dataLabel.value = monthLabels;
};

const assignColors = () => {
	// Extract the 'total' values from each item in the monthlyVisitData array
	const totalMonthlyVisits = monthlyVisitData.value.map((visit) => {
		return visit.total;
	});

	// Find the maximum value among the totals
	const max = Math.max(...totalMonthlyVisits);

	// Find the minimum value among the totals
	const min = Math.min(...totalMonthlyVisits);

	// Find the middle value (neither maximum nor minimum)
	const mid = totalMonthlyVisits.find((num) => num !== max && num !== min);

	/**
	 * Iterate over each item in the monthlyVisitData array and
	 * assign color based on whether the total matches max, mid, or min.
	 */
	for (const visits of monthlyVisitData.value) {
		if (visits.total === max) {
			visits.color = colors.find((color) => color.rank === "max").color;
		} else if (visits.total === mid) {
			visits.color = colors.find((color) => color.rank === "mid").color;
		} else {
			visits.color = colors.find((color) => color.rank === "min").color;
		}
	}

	dataSets.value = [
		{
			data: totalMonthlyVisits,
			backgroundColor: monthlyVisitData.value.map((visit) => visit.color),
		},
	];
};

const barIndex = ref(0);

// Watch for changes in dataLabel and update chart data
watch(
	dataLabel,
	(newLabels) => {
		data.value.labels = newLabels;
		barIndex.value++;
	},
	{
		immediate: true,
	}
);

watch(
	dataSets,
	(newLabels) => {
		data.value.datasets = newLabels;
		barIndex.value++;
	},
	{ immediate: true }
);

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
</style>
