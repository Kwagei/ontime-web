<template>
    <div class="row justify-content-between container p-0 mx-auto">
        <Search v-model:search="searchTerms" />
        <Filter />
        <Sort
            :sortTerms="sortTerms"
            v-model:term="sortTerm"
            v-model:direction="directionTerm"
        />
    </div>
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
                    <th scope="col">Created At</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="visitor in visitors"
                    :key="visitor.id"
                    @click="visitorDetail(visitor.id)"
                >
                    <td>
                        <div class="form-check mb-0">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="customCheck3"
                                @click.stop
                            />
                        </div>
                    </td>
                    <td>{{ visitor.first_name }}</td>
                    <td>{{ visitor.middle_name }}</td>
                    <td>{{ visitor.last_name }}</td>
                    <td>{{ visitor.msisdn }}</td>
                    <td>{{ visitor.email }}</td>
                    <td>{{ visitor.created_at }}</td>
                </tr>
            </tbody>
        </table>
        <div
            id="spinner"
            v-if="loader"
            class="d-flex justify-content-center p-4"
        >
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>

    <Pagination v-model="start" />
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { getVisitors } from "@/assets/js/index.js";
import Pagination from "../Pagination.vue";
import Search from "../Search.vue";
import Filter from "../Filter.vue";
import Sort from "../Sort.vue";

import { useRouter } from "vue-router";
const router = useRouter();

const visitors = defineModel();
const start = ref(0);
const limit = ref(10);
const loader = ref(true);
const sort = ref("");

const props = defineProps({
    searchTerms: {
        type: String,
        required: true,
    },
    sortTerms: {
        type: String,
        required: true,
    },
    directionTerms: {
        type: String,
        required: true,
    },
});

const visitorDetail = (id) => {
    router.push({ name: "visitorDetail", params: { id } });
};

watch(
    () => [
        start.value,
        props.searchTerms,
        props.sortTerms,
        props.directionTerms,
    ],
    async ([startValue, searchValue, sortValue, directionValue]) => {
        visitors.value = await getVisitors({
            search: searchValue,
            start: startValue,
            sort: sortValue,
            direction: directionValue,
        });
    }
);

const fetchData = async () => {
    visitors.value = await getVisitors({
        search: props.searchTerms,
        sort: props.sortTerms,
        start: start.value,
        direction: props.directionTerms,
    });
};

const fetchVisitors = async () => {
    const data = await getVisitors({
        sort: sortTerm.value,
        direction: directionTerm.value,
        limit: limit.value,
    });
    visitors.value = formatDateTime(data);
    loader.value = false;
};

const formatDateTime = (visitors) => {
    return visitors.map((visitor) => {
        const [date] = visitor.created_at.split("T");
        visitor.created_at = date;
        return visitor;
    });
};

onMounted(() => {
    fetchVisitors();
});
</script>

<style scoped>
table {
    margin: 0;
}

tr {
    cursor: pointer;
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

svg.solaris-icon {
    width: 1.2rem;
    height: 1.2rem;
}
</style>
