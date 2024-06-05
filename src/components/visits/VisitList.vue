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
                    <td>{{ visit.first_name + " " + visit.last_name }}</td>
                    <td>{{ visit.arrival_time }}</td>
                    <td>{{ visit.msisdn }}</td>
                    <td>{{ visit.departure_time }}</td>
                    <td>{{ visit.host }}</td>
                    <td>{{ visit.date }}</td>
                    <td>{{ visit.room_name }}</td>
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
import { getVisits, registerVisit } from "@/assets/js/index.js";

const visits = ref([]);
const fetchData = async () => {
    const data = await getVisits();
    visits.value = formatDateTime(data)

};

fetchData();

const formatDateTime = (visits) => {
    for (let i = 0; i < visits.length; i++) {
        let [date, arrival_time] = visits[i].date_time.split('T')
        arrival_time = arrival_time.split('.')[0]
        visits[i] = {...visits[i], date, arrival_time}
        delete visits[i].date_time
    }

    return visits

}


console.log(getVisits);
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
