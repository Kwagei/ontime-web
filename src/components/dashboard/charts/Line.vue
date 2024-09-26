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
import { ref, watch } from "vue";
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
import { getVisits } from "@/assets/js";

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

const totalVisits = defineModel("totalVisits");

const date = new Date();
const currentYear = date.getFullYear();
const currentMonth = date.getMonth();
const todaysVisits = defineModel("todaysVisits");

watch(totalVisits, async (n) => {
    await fetchVisits(n);
});

const fetchVisits = async (total) => {
    // fetch all the visits in the DB from the beginning of time
    const { visits } = await getVisits({ limit: total });

    updateWeeklyVisitData(visits);
};

const updateWeeklyVisitData = (visits) => {
    const { daysOfWeek, datesOfWeek, currentWeekVisits } =
        getCurrentWeekData(visits);

    const maleVisits = new Array(6).fill(0);
    const femaleVisits = new Array(6).fill(0);

    for (const visit of currentWeekVisits) {
        const dayIndex = datesOfWeek.indexOf(
            new Date(visit.date_time).getDate()
        );

        if (visit.gender.toLowerCase() === "male") {
            maleVisits[dayIndex]++;
            gender.value.male++;
        } else if (visit.gender.toLowerCase() == "female") {
            femaleVisits[dayIndex]++;
            gender.value.female++;
        }
    }

    const currentDay = date.getDate();
    const currentDayIndex = datesOfWeek.indexOf(currentDay);

    todaysVisits.value =
        maleVisits[currentDayIndex] + femaleVisits[currentDayIndex];

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

const getCurrentWeekVisits = (visits, datesOfWeek) => {
    const currentYearVisits = getCurrentYearVisits(visits);
    const currentMonthVisits = getCurrentMonthVisits(currentYearVisits);

    return currentMonthVisits.filter((visit) =>
        datesOfWeek.some(
            (date) =>
                date === +visit.date_time.split("T")[0].split("-").reverse()[0]
        )
    );
};

const getCurrentYearVisits = (visits) =>
    visits.filter((visit) => visit.date_time.startsWith(currentYear));

const getCurrentMonthVisits = (visits) =>
    visits.filter(
        (visit) => +visit.date_time.split("-")[1] === currentMonth + 1
    );

const getCurrentWeekData = (visits) => {
    const startOfWeek = date.getDate() - date.getDay();
    const daysOfWeek = [],
        datesOfWeek = [];

    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(date);
        currentDay.setDate(startOfWeek + i);

        datesOfWeek.push(currentDay.getDate());

        const options = { weekday: "short" };
        daysOfWeek.push(currentDay.toLocaleDateString("en-US", options));
    }

    const currentWeekVisits = getCurrentWeekVisits(
        visits,
        datesOfWeek.slice(1)
    );

    return {
        daysOfWeek: daysOfWeek.slice(1),
        datesOfWeek: datesOfWeek.slice(1),
        currentWeekVisits,
    };
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
