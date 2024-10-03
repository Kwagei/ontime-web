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
import { onMounted, ref, watch } from "vue";
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

import { API_KEY, API_URL, getVisits } from "@/assets/js";
import { getTodaysVisits } from "@/util/util";

const totalVisits = defineModel("totalVisits");
const todaysVisits = defineModel("todaysVisits");

onMounted(() => {
    setTimeout(() => initializeTodaysVisits(), 4000);
});

async function initializeTodaysVisits() {
    let tmpTotalVisits = await getTodaysVisits();
    todaysVisits.value = tmpTotalVisits.totalLength;
}

watch(totalVisits, async (n) => {
    await fetchVisits(n);
});

const fetchVisits = async (total) => {
    const { visits } = await getVisits({ limit: total });

    updateWeeklyVisitData(visits);
};

const updateWeeklyVisitData = async () => {
    const currentWeekVisits = await getCurrentWeekData();
    const datesOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const maleVisits = new Array(6).fill(0);
    const femaleVisits = new Array(6).fill(0);

    // loop through each day of the week
    for (const [dayIndex, eachDayVisits] of currentWeekVisits.entries()) {
        // loop through each visit for the day
        for (const visit of eachDayVisits) {
            // update gender accordingly
            if (visit.gender.toLowerCase() == "male") {
                maleVisits[dayIndex]++;
                gender.value.male++;
            } else {
                femaleVisits[dayIndex]++;
                gender.value.female++;
            }
        }
    }

    chartData.value = {
        labels: datesOfWeek,
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

const getCurrentWeekData = async () => {
    let currentWeekVisits = Array(6).fill(new Array());

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
