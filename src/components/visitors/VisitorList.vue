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
                    <th scope="col">First name</th>
                    <th scope="col">Middle name</th>
                    <th scope="col">Last name</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Email</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    class=""
                    v-for="visitor in visitors"
                    :key="visitor.id"
                    :id="visitor.id"
                >
                    <td>
                        <div class="form-check mb-0">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="customCheck3"
                            />
                        </div>
                    </td>
                    <td>{{ visitor.first_name }}</td>
                    <td>{{ visitor.middle_name }}</td>
                    <td>{{ visitor.last_name }}</td>
                    <td>{{ visitor.msisdn }}</td>
                    <td>{{ visitor.email }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <Pagination v-model="start" />
</template>

<script setup>
import { ref, watch } from "vue";
import { getVisitors } from "@/assets/js/index.js";
import Pagination from "../Pagination.vue";

const visitors = ref();
const start = ref(0);

const searchTerms = defineProps({
    searchTerms: {
        type: String,
        required: true,
    },
});

watch(
    () => [start.value, searchTerms.searchTerms],
    async ([newPagination, newSearch]) => {
        visitors.value = await getVisitors({
            search: newSearch,
            start: newPagination,
        });
    }
);

const fetchData = async () => {
    visitors.value = await getVisitors({
        search: searchTerms.value,
        start: start.value,
    });
};
fetchData();
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
