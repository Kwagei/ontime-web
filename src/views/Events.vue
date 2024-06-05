<template>
<<<<<<< HEAD
    <div id="eventsWrapper" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
        >
            <BreadCrumbs :breadCrumbs="breadCrumbs" />

            <div class="d-flex" style="gap: 0.521rem">
=======
    <div id="eventsWrapper">
        <div class="d-flex justify-content-between my-4">
            <div>
                <BreadCrumbs :breadCrumbs="breadCrumbs" />
            </div>
            <div>
>>>>>>> ff015c8 (completed creating and retrieving events from database, pulling code to use Modal for displaying messages)
                <RefreshList />
                <Options />

                <router-link :to="{ name: 'add-event' }">
                    <button
                        type="button"
                        class="btn btn-primary"
                        id="new-visitor"
                        style="
                            padding: 0.7rem 2rem !important;
                            font-weight: 600;
                        "
                    >
                        Add Event
                    </button>
                </router-link>
            </div>
        </div>

        <div class="row justify-content-between container p-0 mx-auto">
            <Search v-model:search="searchTerms" />
            <Filter />
            <Sort v-model:sort="sortTerms" v-model:direction="directionTerms" />
        </div>

        <EventsList />
<<<<<<< HEAD
<<<<<<< HEAD
=======
        <Pagination />
>>>>>>> ff015c8 (completed creating and retrieving events from database, pulling code to use Modal for displaying messages)
=======
>>>>>>> c4b8253 (completed displaying events and pagination, moving to Event page creation)
        <RouterView :breadCrumbs="breadCrumbs" />
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

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});
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
    padding-top: 2rem;
    gap: 1.5rem;
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
