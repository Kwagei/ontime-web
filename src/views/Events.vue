<template>
    <div id="eventsWrapper">
        <div class="d-flex justify-content-between my-4">
            <div>
                <BreadCrumbs :breadCrumbs="breadCrumbs" />
            </div>
            <div>
                <RefreshList
                    style="height: 50px !important; width: 55px !important"
                    @click="refreshEvents"
                />
                <Options
                    style="height: 50px !important; width: 55px !important"
                    class="mx-2"
                />
                <router-link :to="{ name: 'add-event' }">
                    <button
                        style="height: 50px !important; width: 150px !important"
                        class="btn btn-primary"
                    >
                        Add Event
                    </button>
                </router-link>
            </div>
        </div>
        <div class="d-flex justify-content-between my-4">
            <Search v-model:search="searchQuery" />
            <Filter />
            <<<<<<< HEAD
            <Sort :sortTerms="sortTerms" />
            =======
            <Sort
                :sortTerms="sortTerms"
                v-model:term="sort"
                v-model:direction="direction"
            />
            >>>>>>> development
        </div>
        <EventsList
            :searchQuery="searchQuery"
            :refresh="refresh"
            :sort="sort"
            :direction="direction"
            @refreshComplete="stopEventsRefresh"
        />
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
import $ from "jquery";

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
const sort = ref("title");
const direction = ref("asc");

const searchQuery = ref("");

const refresh = ref(false);

function refreshEvents() {
    refresh.value = true;
    $(".refresh").css("pointer-events", "none");
}

function stopEventsRefresh() {
    // refresh and then set refresh back to false
    refresh.value = false;
    $(".refresh").css("pointer-events", "auto");
}
</script>

<<<<<<< HEAD
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
=======
<style>
#eventsWrapper {
<<<<<<< HEAD
    margin: 50px 125px;
>>>>>>> ff015c8 (completed creating and retrieving events from database, pulling code to use Modal for displaying messages)
=======
    margin: 25px 125px;
>>>>>>> c4b8253 (completed displaying events and pagination, moving to Event page creation)
}
</style>
