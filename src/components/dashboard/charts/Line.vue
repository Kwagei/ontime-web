<template>
    <h4 style="margin-bottom: 1.5rem">Weekly Visits</h4>
    <div class="data d-flex gap-4 px-3 mb-4">
        <div class="data-body">
            <div class="d-flex align-items-center gap-1">
                <span class="male-color"></span>
                <span>Male</span>
            </div>
            <h3 class="mb-1">
                {{ gender.male }}
            </h3>
        </div>
        <div class="data-body">
            <div class="d-flex align-items-center gap-1">
                <span class="female-color"></span>
                <span>Female</span>
            </div>
            <h3 class="mb-1">
                {{ gender.female }}
            </h3>
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

import { API_KEY, API_URL } from "@/assets/js";

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
    male: "...",
    female: "...",
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
        x: {},
        y: {
            title: {
                display: true,
                text: "Number of Visits",
            },
            beginAtZero: true,
        },
    },
});

const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const todaysVisits = defineModel("todaysVisits");

onMounted(async () => {
    initializeWeeklyVisitData();
});

const initializeWeeklyVisitData = async () => {
    const currentWeekVisits = await getCurrentWeekData();

    // initialize today's visits
    todaysVisits.value =
        currentWeekVisits[currentWeekVisits.length - 1].gender.total;

    gender.value.male = currentWeekVisits[0].weekly_male_total;
    gender.value.female = currentWeekVisits[0].weekly_female_total;

    const maleVisits = currentWeekVisits.map((day) => day.gender.male);
    const femaleVisits = currentWeekVisits.map((day) => day.gender.female);

    chartData.value = {
        labels: currentWeekVisits.map(
            (day) => daysOfWeek[new Date(day.day).getDay()]
        ),
        datasets: [
            {
                label: "Male",
                backgroundColor: "rgba(0, 191, 255, 0.2)",
                borderColor: "#085EBD",
                data: maleVisits,
                fill: true,
            },
            {
                label: "Female",
                backgroundColor: "rgba(255, 121, 0, 0.2)",
                borderColor: "#F16E00",
                data: femaleVisits,
                fill: true,
            },
        ],
    };
};

const getCurrentWeekData = async () => {
    let currentWeekVisits = [];

    await $.ajax(`${API_URL}visits/current-week-visits`, {
        method: "GET",
        headers: {
            authorization: API_KEY,
        },
        success: (res) => {
            currentWeekVisits = res.data.visits;
        },
        error: (error) => {
            console.error("error fetching current week's visits: ", error);
        },
    });

    return currentWeekVisits;
};
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
