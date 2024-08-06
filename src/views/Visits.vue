<template>
    <div id="visit-view" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
        >
            <BreadCrumbs :breadCrumbs="breadCrumbs" />

            <div class="d-flex" style="gap: 0.521rem">
                <RefreshList @click="refresh = true" />
                <button
                    @click="displayDateRangeModal"
                    class="btn btn-secondary"
                >
                    Date Range
                </button>

                <button
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasExample"
                    aria-controls="offcanvasExample"
                    type="button"
                    id="addVisitBtn"
                    class="btn btn-primary"
                >
                    Add Visit
                </button>

                <div
                    class="offcanvas offcanvas-start"
                    tabindex="-1"
                    id="offcanvasExample"
                    aria-labelledby="offcanvasExampleLabel"
                >
                    <div class="offcanvas-header">
                        <h5
                            class="ms-5 offcanvas-title"
                            id="offcanvasExampleLabel"
                        >
                            Purpose
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="offcanvas"
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            data-bs-title="Close"
                        >
                            <span class="visually-hidden">Close</span>
                        </button>
                    </div>
                    <div class="m-3">
                        <router-link :to="{ name: 'visits-event' }">
                            <button
                                type="button"
                                class="btn btn-primary"
                                style="padding: 0.5rem 1.5rem; font-weight: 600"
                            >
                                Events
                            </button>
                        </router-link>

                        <button
                            type="button"
                            class="btn btn-primary"
                            style="padding: 0.5rem 1.5rem; font-weight: 600"
                            disabled
                        >
                            Meeting
                        </button>

                        <button
                            type="button"
                            class="btn btn-primary"
                            style="padding: 0.5rem 1.5rem; font-weight: 600"
                            disabled
                        >
                            Workspace
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <VisitList
            v-model:refresh="refresh"
            v-model:dateRangeDates="dateRangeDates"
        />
        <DateRangeModal v-if="showDateRangeModal" @done="dateRangeCompleted" />
        <RouterView />
    </div>
</template>

<script setup>
import BreadCrumbs from "../components/BreadCrumbs.vue";
import VisitList from "../components/visits/VisitList.vue";
import RefreshList from "../components/RefreshList.vue";
import DateRangeModal from "@/components/DateRangeModal.vue";
import { showModal } from "@/assets/js/util";

import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";

const breadCrumbs = defineModel("breadCrumbs");
const refresh = ref(false);
const showDateRangeModal = ref(false);
const dateRangeDates = ref({
    from: "",
    to: "",
});

function displayDateRangeModal() {
    showDateRangeModal.value = true;
    setTimeout(() => showModal("#dateRangeModal", "#modal-dialog"), 500);
}

function dateRangeCompleted(newDates) {
    // remove date range modal
    showDateRangeModal.value = false;

    // update date ranges, then it will be caught by watchers in events table
    dateRangeDates.value = newDates;
}
</script>

<style scoped>
#visit-view {
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
.m-3 {
    display: flex;
    height: 300px;
    align-items: center;
    flex-direction: column;
    /* background-color: aquamarine; */
    padding: 0.5rem;
    justify-content: space-between;
}

.m-3 button {
    width: 250px;
    padding: 0.5rem;
}
.offcanvas {
    position: fixed;
    z-index: 9999;
}

/* @media (min-width: 768px) and (max-width: 1440px) {
	#visit-view {
		padding: 1rem 3rem 0 3rem;
	}
} */
</style>
