<template>
    <div class="eventsWrapper">
        <div class="d-flex justify-content-between my-4">
            <div>
                <BreadCrumbs />
            </div>
            <div>
                <RefreshList />
                <Options />
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
        <Pagination />
    </div>
</template>

<script setup>
import RefreshList from "../components/RefreshList.vue";
import BreadCrumbs from "../components/BreadCrumbs.vue";
import Options from "../components/Options.vue";
import Search from "../components/Search.vue";
import Filter from "../components/Filter.vue";
import Sort from "../components/Sort.vue";
import Pagination from "../components/Pagination.vue";
import EventsList from "../components/events/EventsList.vue";
</script>

<style>
.eventsWrapper {
    margin: 50px 125px;
}
</style>
