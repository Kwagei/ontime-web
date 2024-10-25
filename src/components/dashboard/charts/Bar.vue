<template>
    <h4 style="margin-bottom: 1.5rem">Monthly Visits</h4>
    <div class="data d-flex gap-4 px-3 mb-4">
        <div
            class="data-body"
            style="min-width: 90px"
            v-for="monthlyVisit in monthlyVisitData"
            :key="monthlyVisit.name"
        >
            <span
                >{{ monthlyVisit.name || "..." }}
                {{ monthlyVisit.name ? currentYear : "..." }}</span
            >
            <h3 class="mb-1">
                {{ monthlyVisit.gender.total || "..." }}
            </h3>
            <div class="border-color" style="background-color: #ddd"></div>
        </div>
    </div>
    <Bar :data="data" :options="options" :key="barIndex" />
</template>

<script setup>
import { API_KEY, API_URL } from "@/assets/js";

import { onMounted, ref } from "vue";
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

const barIndex = ref(0);
const currentYear = new Date().getFullYear();

// Define chart data and options as reactive objects
const data = ref({
    labels: [],
    datasets: [],
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
            ticks: {
                callback: function (val, index) {
                    val;
                    // format month
                    let month = new Date(
                        monthlyVisitData.value[index].month
                    ).toLocaleString("default", {
                        month: "long",
                    });

                    // Custom labels for the gender under each category
                    // use array to put them in seperate lines
                    return ["    Male    |    Female", month];
                },
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

const fetchPastThreeMonthsVisits = async () => {
    let allVisits = [];

    await $.ajax(`${API_URL}visits/past-three-months`, {
        method: "GET",
        headers: {
            authorization: API_KEY,
        },
        success: (res) => {
            allVisits = res.data.visits;
        },
        error: (error) => {
            console.error("error retrieving past three months visits: ", error);
        },
    });

    return allVisits;
};

const monthlyVisitData = ref([
    {
        name: "",
        gender: {
            total: "",
        },
    },
    {
        name: "",
        gender: {
            total: "",
        },
    },
    {
        name: "",
        gender: {
            total: "",
        },
    },
]);

onMounted(async () => {
    const allVisits = await fetchPastThreeMonthsVisits();

    for (const month of allVisits) {
        month["name"] = new Date(month.month).toLocaleString("default", {
            month: "short",
        });
    }

    monthlyVisitData.value = allVisits;

    // Extract the 'total' values from each item in the monthlyVisitData array
    const chartGenderStats = monthlyVisitData.value.map((visit) => {
        return { male: visit.gender.male, female: visit.gender.female };
    });

    data.value.labels = monthlyVisitData.value.map((monthVisits) =>
        new Date(monthVisits.month).toLocaleString("default", {
            month: "long",
        })
    );

    // generate array of male and female visits for the past three months
    chartGenderStats.male = chartGenderStats.map((gender) => gender.male);
    chartGenderStats.female = chartGenderStats.map((gender) => gender.female);

    data.value.datasets = [
        {
            label: "Male",
            data: chartGenderStats.male,
            backgroundColor: "#085EBD",
        },
        {
            label: "Female",
            data: chartGenderStats.female,
            backgroundColor: "#0A6E31",
        },
    ];

    barIndex.value += 1;
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
