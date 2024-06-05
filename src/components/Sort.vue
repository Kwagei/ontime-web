<template>
    <div
        class="col-md-3 sort bg-white d-flex justify-content-between"
        style="border: 0.125rem solid black"
    >
        <button
            class="btn btn-secondary w-25"
            type="button"
            data-bs-theme="dark"
        >
            <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill="#000000"
                    fill-rule="evenodd"
                    d="M85 82.5H42.4a5 5 0 010-10H85a5 5 0 010 10M69.9 67.4H42.3a5 5 0 010-10h27.6a5 5 0 010 10M55 52.5H42.5a5 5 0 010-10H55a5 5 0 010 10M37.43 36.082l-4.93-4.93V77.35a5.05 5.05 0 01-5.05 5.05c-2.789 0-4.95-2.261-4.95-5.05V31.154l-4.937 4.937a4.85 4.85 0 11-6.859-6.86l12.828-12.827a4.84 4.84 0 013.841-1.4Q27.436 15 27.5 15c.096 0 .205-.005.3 0a4.8 4.8 0 013.668 1.42L44.28 29.232a4.844 4.844 0 11-6.85 6.85"
                />
            </svg>
        </button>
        <div
            class="d-flex dropdown btn-secondary w-75"
            style="border-left: 0.125rem solid black"
        >
            <button
                class="btn w-100"
                type="button"
                data-value=""
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {{ sortType }}
            </button>
            <ul class="dropdown-menu w-100">
                <li
                    class="dropdown-item"
                    v-for="sort in sortItems"
                    :key="sort.term"
                    @click="updateSortTerms(sort)"
                >
                    {{ sort.type }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
const sortTerms = defineModel("sort");
const sortType = ref("Created At");

const updateSortTerms = (sort) => {
    sortTerms.value = sort.term;
    sortType.value = sort.type;
};

const sortItems = [
    { type: "Created At", term: "created_at" },
    { type: "First Name", term: "first_name" },
    { type: "Middle Name", term: "middle_name" },
    { type: "Last Name", term: "last_name" },
    { type: "Phone Number", term: "msisdn" },
    { type: "Email", term: "email" },
];
</script>

<style scoped>
.dropdown-item {
    cursor: pointer;
}
.sort {
    padding: 0 !important;
}
.sort svg {
    height: 20px !important;
    margin: 0 !important;
}
</style>
