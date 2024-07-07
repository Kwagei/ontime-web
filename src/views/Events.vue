<template>
    <div id="eventsWrapper" class="d-flex flex-column container">
        <div class="d-flex justify-content-between gap-4">
            <Search class="flex-grow-1" v-model:search="searchQuery" />
            <div class="d-flex" style="gap: 0.521rem">
                <RefreshList @click="refreshEvents" />
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
        <EventsTable
            v-model:refreshEvents="refresh"
            @refreshComplete="stopEventsRefresh"
        />
    </div>
</template>

<script setup>
import RefreshList from "../components/RefreshList.vue";
import Search from "../components/Search.vue";
import EventsTable from "../components/events/EventsTable.vue";

import { ref } from "vue";
import $ from "jquery";

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});

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
    padding-top: 2rem;
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
