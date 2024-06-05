<template>
    <div id="eventsTableContainer">
        <table
            v-if="allEvents.data && allEvents.data.length >= 1"
            class="table table-hover"
        >
            <thead>
                <tr>
                    <th scope="col">
                        <input type="checkbox" class="form-check-input" />
                    </th>
                    <th scope="col">Title</th>
                    <th scope="col" style="width: 150px">Start Date</th>
                    <th scope="col" style="width: 150px">End Date</th>
                    <th scope="col">Facilitator</th>
                    <th scope="col">Type</th>
                    <th scope="col">Details</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="event in eventsToShow">
                    <td>
                        <input
                            class="form-check-input"
                            type="checkbox"
                            name="{{ event.id }}"
                        />
                    </td>
                    <td class="bold">{{ event.title }}</td>
                    <td>
                        {{ formatDate(event.start_date) }}
                    </td>
                    <td>{{ formatDate(event.end_date) }}</td>
                    <td>{{ event.facilitator }}</td>
                    <td>{{ event.type }}</td>
                    <td>{{ event.details }}</td>
                </tr>
            </tbody>
        </table>
        <h2 v-else-if="allEvents.data && allEvents.data.length <= 0">
            No Events Currently!
        </h2>
        <h2 v-else-if="Object.keys(allEvents).length <= 0">
            Loading Events...
        </h2>
        <h2 v-else>Error Loading Events, Try again!</h2>
    </div>
    <Pagination v-model="paginationStart" />
</template>

<script setup>
import Pagination from "../Pagination.vue";
import { ref, onMounted, watch } from "vue";
import $ from "jquery";

const paginationStart = ref(0);
const allEvents = ref({});
const eventsToShow = ref([]);
const MAX = ref(10);

function formatDate(date) {
    const rawDate = new Date(date);

    return rawDate.toString().split(" 0")[0];
}

onMounted(async () => {
    // Get Events from API on `localhost:3000`
    try {
        await $.get("http://localhost:3000/api/events/", (data) => {
            allEvents.value = data;
            nextPage(0);
        });
    } catch (error) {
        allEvents.value = error.responseJSON;
    }
});

watch(paginationStart, (newValue, oldValue) => {
    if (newValue > oldValue) nextPage(newValue);
    else previousPage(newValue);
});

function nextPage(start) {
    eventsToShow.value = allEvents.value.data.slice(start, MAX.value + start);
}

function previousPage(start) {
    eventsToShow.value = allEvents.value.data.slice(start, MAX.value);
}
</script>

<style scoped>
#eventsTableContainer {
    max-height: 63vh;
    overflow: scroll;
    margin-bottom: 30px;
}
</style>
