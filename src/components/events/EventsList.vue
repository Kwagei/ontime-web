<template>
    <div>
        <table
            v-if="events.data && events.data.length >= 1"
            class="table table-hover"
        >
            <thead>
                <tr>
                    <th scope="col">
                        <input
                            type="checkbox"
                            name="allEventsChecked"
                            id="allEventsChecked"
                        />
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
                <tr v-for="(event, index) in events.data">
                    <td><input type="checkbox" name="{{ event.id }}" /></td>
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
        <h2 v-else-if="events.data && events.data.length <= 0">
            No Events Currently!
        </h2>
        <h2 v-else-if="events.status !== 200 && !events.data">
            Error Loading Events, Try again!
        </h2>
        <h2 v-else>Loading Events...</h2>
    </div>
</template>

<script>
import { ref } from "vue";

export default {
    name: "EventsList",
    data() {
        return {
            events: ref(""),
        };
    },
    methods: {
        formatDate(date) {
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

            if (req.readyState === 4 && req.status === 200) {
                this.events = res;
            } else {
                console.error("Error getting events: ", res);
            }
        };
    },
};
</script>
