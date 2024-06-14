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
                    <button class="btn btn-primary">Add Event</button>
                </router-link>
            </div>
        </div>
        <div class="d-flex justify-content-between my-4">
            <Search />
            <Filter />
            <Sort />
        </div>
        <EventsList />
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

<style>
#eventsWrapper {
    margin: 25px 125px;
}
</style>
