<template>
    <div id="eventsTableContainer">
<<<<<<< HEAD
        <table class="table table-hover mb-0">
            <thead>
                <tr>
                    <th scope="col">
<<<<<<< HEAD
                        <input type="checkbox" class="form-check-input" />
=======
                        <input type="checkbox" />
>>>>>>> ff015c8 (completed creating and retrieving events from database, pulling code to use Modal for displaying messages)
=======
        <table
            v-if="allEvents.data && allEvents.data.length >= 1"
            class="table table-hover"
        >
            <thead>
                <tr>
                    <th scope="col">
                        <input type="checkbox" class="form-check-input" />
>>>>>>> c4b8253 (completed displaying events and pagination, moving to Event page creation)
                    </th>
                    <th scope="col">Title</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Facilitator</th>
                    <th scope="col">Type</th>
                    <th scope="col">Details</th>
                </tr>
            </thead>
            <tbody>
<<<<<<< HEAD
<<<<<<< HEAD
                <tr v-for="event in eventsToShow">
=======
                <tr v-for="(event, index) in events.data">
>>>>>>> ff015c8 (completed creating and retrieving events from database, pulling code to use Modal for displaying messages)
=======
                <tr v-for="event in eventsToShow">
>>>>>>> c4b8253 (completed displaying events and pagination, moving to Event page creation)
                    <td>
                        <input
                            class="form-check-input"
                            type="checkbox"
                            name="{{ event.id }}"
                        />
                    </td>
<<<<<<< HEAD
                    <td>{{ event.title }}</td>
=======
                    <td class="bold">{{ event.title }}</td>
>>>>>>> ff015c8 (completed creating and retrieving events from database, pulling code to use Modal for displaying messages)
                    <td>
                        {{ formatDate(event.start_date) }}
                    </td>
                    <td>{{ formatDate(event.end_date) }}</td>
                    <td>{{ event.facilitator }}</td>
                    <td>{{ event.type }}</td>
                    <td>{{ formatDetails(event.details) }}</td>
                </tr>
            </tbody>
        </table>
<<<<<<< HEAD
<<<<<<< HEAD
        <div
            v-if="hasEvents"
            style="
                height: 50vh;
                display: flex;
                justify-content: center;
                align-items: center;
            "
        >
            <h2>No Events Currently!</h2>
        </div>
=======
        <h2 v-else-if="events.data && events.data.length <= 0">
=======
        <h2 v-else-if="allEvents.data && allEvents.data.length <= 0">
>>>>>>> c4b8253 (completed displaying events and pagination, moving to Event page creation)
            No Events Currently!
        </h2>
        <h2 v-else-if="Object.keys(allEvents).length <= 0">
            Loading Events...
        </h2>
        <h2 v-else>Error Loading Events, Try again!</h2>
>>>>>>> ff015c8 (completed creating and retrieving events from database, pulling code to use Modal for displaying messages)
    </div>
    <Pagination v-model="paginationStart" />
</template>

<script setup>
import Pagination from "../Pagination.vue";
import { ref, onMounted, watch } from "vue";
import $ from "jquery";

<<<<<<< HEAD
<<<<<<< HEAD
const paginationStart = ref(0);
const allEvents = ref("loading");
const eventsToShow = ref([]);
const MAX = ref(10);
=======
export default {
    name: "EventsList",
    data() {
        return {
            events: ref({}),
        };
    },
    methods: {
        formatDate(date) {
            const rawDate = new Date(date);
>>>>>>> ff015c8 (completed creating and retrieving events from database, pulling code to use Modal for displaying messages)
=======
const paginationStart = ref(0);
const allEvents = ref({});
const eventsToShow = ref([]);
const MAX = ref(10);

function formatDate(date) {
    const rawDate = new Date(date);
>>>>>>> c4b8253 (completed displaying events and pagination, moving to Event page creation)

const hasEvents = ref(false);

const formatDetails = (detail) => {
    let words = detail.split(" ");

<<<<<<< HEAD
    return words.length > 7 ? `${words.slice(0, 7).join(" ")}...` : detail;
=======
        req.onload = () => {
            const res = req.response;

            if (req.readyState === 4 && req.status === 200) {
                this.events = res;
            } else {
                console.error("Error getting events: ", res);
                this.events = res;
            }
        };
    },
>>>>>>> ff015c8 (completed creating and retrieving events from database, pulling code to use Modal for displaying messages)
};

function formatDate(date) {
    const rawDate = new Date(date);

    return rawDate.toString().split(" 0")[0];
}

onMounted(async () => {
    await getEvents();
});

watch(paginationStart, (newValue) => {
    eventsToShow.value = allEvents.value.slice(newValue, MAX.value + newValue);

    if (allEvents.value.length - newValue == 10) moreEvents();
});

async function getEvents(
    search = "",
    start = 0,
    limit = 20,
    from = "",
    to = ""
) {
    // Get Events from API on `localhost:3000`
    try {
        let url = `http://localhost:3000/api/events?start=${start}&limit=${limit}`;

        if (search) url += `&search=${search}`;
        if (from) url += `&from=${from}`;
        if (to) url += `&to=${to}`;

        await $.get(url, (data) => {
            allEvents.value = data.data;
            hasEvents.value = allEvents.value.length ? false : true;
            eventsToShow.value = allEvents.value.slice(0, 10);
        });
    } catch (error) {
        // do nothing
        allEvents.value = "error";
    }
}

async function moreEvents(
    search = "",
    start = allEvents.value.length,
    limit = 20,
    from = "",
    to = ""
) {
    // Get Events from API on `localhost:3000`
    try {
        let url = `http://localhost:3000/api/events?start=${start}&limit=${limit}`;

        if (search) url += `&search=${search}`;
        if (from) url += `&from=${from}`;
        if (to) url += `&to=${to}`;

        await $.get(url, (data) => {
            allEvents.value.push(...data.data);
        });
    } catch (error) {
        // do nothing
    }
}
</script>

<<<<<<< HEAD
<style scoped></style>
=======
<style scoped>
#eventsTableContainer {
    max-height: 63vh;
    overflow: scroll;
    margin-bottom: 30px;
}
</style>
>>>>>>> c4b8253 (completed displaying events and pagination, moving to Event page creation)
