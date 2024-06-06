<template>
    <div id="eventsTableContainer">
<<<<<<< HEAD
        <table
            v-if="allEvents.data && allEvents.data.length >= 1"
            class="table table-hover"
        >
=======
        <table class="table table-hover mb-0">
>>>>>>> 1ef147a (Updated Interface design to follow Boosted style guide)
            <thead>
                <tr>
                    <th scope="col">
                        <input type="checkbox" class="form-check-input" />
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
                <tr v-for="event in eventsToShow">
                    <td>
                        <input
                            class="form-check-input"
                            type="checkbox"
                            name="{{ event.id }}"
                        />
                    </td>
                    <td>{{ event.title }}</td>
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

const hasEvents = ref(false);

const formatDetails = (detail) => {
    let words = detail.split(" ");

    return words.length > 7 ? `${words.slice(0, 7).join(" ")}...` : detail;
};

function formatDate(date) {
    const rawDate = new Date(date);

            return rawDate.toString().split(" 0")[0];
        },
    },
    mounted() {
        // Get Events from API on `localhost:3000`
        const req = new XMLHttpRequest();

        req.open("GET", "http://localhost:3000/api/events");
        req.responseType = "json";
        req.setRequestHeader("API_KEY", "ccea0f61-ed15-425e-8a80-87ae9c60cf13");
        req.send();

        req.onload = () => {
            const res = req.response;

<<<<<<< HEAD
            if (req.readyState === 4 && req.status === 200) {
                this.events = res;
            } else {
                console.error("Error getting events: ", res);
                this.events = res;
            }
        };
    },
};
=======
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
>>>>>>> 1ef147a (Updated Interface design to follow Boosted style guide)
</script>

<style scoped></style>
