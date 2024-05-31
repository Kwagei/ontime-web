<template>
    <div class="table-responsive container p-0">
        <table class="table table-sm table-hover has-checkbox">
            <thead>
                <tr>
                    <th scope="col">
                        <div class="form-check mb-0">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="customCheck"
                            />
                            <label class="form-check-label" for="customCheck">
                                <span class="visually-hidden">Select all</span>
                            </label>
                        </div>
                    </th>
                    <th scope="col">Visitor</th>
                    <th scope="col">Arrival time</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Departure time</th>
                    <th scope="col">Host</th>
                    <th scope="col">Date</th>
                    <th scope="col">Room</th>
                    <th scope="col">Institution</th>
                    <th scope="col">Belonging</th>
                    <th scope="col">Purpose</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="visit in visits" :key="visit.id" :id="visit">
                    <td>
                        <div class="form-check mb-0">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="customCheck3"
                            />
                        </div>
                    </td>
                    <td>{{ visit.name }}</td>
                    <td>{{ visit.arrival_time }}</td>
                    <td>{{ visit.contact }}</td>
                    <td>{{ visit.departural_time }}</td>
                    <td>{{ visit.host }}</td>
                    <td>{{ visit.date }}</td>
                    <td>{{ visit.room }}</td>
                    <td>{{ visit.institution }}</td>
                    <td>{{ visit.belonging }}</td>
                    <td>{{ visit.purpose }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref } from "vue";
// import { getVisits } from "@/assets/js/index.js";

// const visits = ref(null);
// const fetchData = async () => {
//     visits.value = await getVisitors();
// };

// fetchData();

const visits = ref([
    {
        id: 1,
        name: "John Doe",
        arrival_time: "08:00 AM",
        contact: "1234567890",
        departural_time: "09:00 AM",
        host: "Alice Johnson",
        date: "2024-05-29",
        room: "101",
        institution: "ABC Corp",
        belonging: "Laptop",
        purpose: "Meeting"
    },
    // Other visit objects...
]);

</script>

<style scoped>
   table {
    margin: 0;
}
th,
td {
    padding: 0.9rem;
}

@media (min-width: 768px) and (max-width: 1440px) {
    th,
    td {
        padding: 0.7rem;
    }
}
    
</style>
