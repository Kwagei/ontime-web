<template>
    <div id="eventsWrapper" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
        >
            <BreadCrumbs :breadCrumbs="breadCrumbs" />
            <div class="d-flex" style="gap: 0.521rem">
                <RefreshList @click="refresh = true" />
                <router-link :to="{ name: 'add-event' }">
                    <button
                        id="addEventBtn"
                        type="button"
                        class="btn btn-primary"
                    >
                        Add Event
                    </button>
                </router-link>
            </div>
        </div>
        <EventsTable v-model:refresh="refresh" />
    </div>
</template>

<script setup>
import RefreshList from "../components/RefreshList.vue";
import BreadCrumbs from "../components/BreadCrumbs.vue";
import EventsTable from "../components/events/EventsTable.vue";

import { ref } from "vue";

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});

const refresh = ref(false);
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
</style>
