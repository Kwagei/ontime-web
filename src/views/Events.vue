<template>
    <div id="eventsWrapper">
        <div class="d-flex justify-content-between my-4">
            <div>
                <BreadCrumbs :breadCrumbs="breadCrumbs" />
            </div>
            <div>
                <RefreshList />
                <Options class="mx-2" />
                <router-link :to="{ name: 'add-event' }">
                    <button class="px-3 btn btn-primary">Add Event</button>
                </router-link>
            </div>
        </div>
        <div class="d-flex justify-content-between my-4">
            <Search v-model:search="searchQuery" />
            <Filter />
            <Sort :sortTerms="sortTerms" />
        </div>
        <EventsList :searchQuery="searchQuery" />
    </div>
</template>

<script setup>
import RefreshList from "../components/RefreshList.vue";
import BreadCrumbs from "../components/BreadCrumbs.vue";
import Options from "../components/Options.vue";
import Search from "../components/Search.vue";
import Filter from "../components/Filter.vue";
import Sort from "../components/Sort.vue";
import EventsList from "../components/events/EventsList.vue";
import { ref } from "vue";

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});

const sortTerms = ref([
    { type: "Title", term: "title" },
    { type: "Start Date", term: "start_date" },
    { type: "End Date", term: "end_date" },
    { type: "Type", term: "type" },
    { type: "Facilitator", term: "facilitator" },
]);
const searchQuery = ref("");
</script>

<style scoped>
svg {
    height: 20px !important;
    margin: 0 !important;
}

#new-visitor:hover {
    color: white !important;
}

#eventsWrapper {
    gap: 1.5rem;
    margin: 0 9rem;
}

.btn {
    padding: 0.5rem !important;
}

.btn:hover {
    border: 0.125rem solid black !important;
}

.btn:hover g {
    fill: white;
}

.list-options svg {
    height: 20px !important;
    margin: 0 !important;
}

@media (min-width: 768px) and (max-width: 1440px) {
    #eventsWrapper {
        padding: 1rem 3rem 0 3rem;
    }
}
</style>
