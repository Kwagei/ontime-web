<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div id="visitor-view" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
        >
            <BreadCrumbs :breadCrumbs="breadCrumbs" />

            <div class="d-flex" style="gap: 0.521rem">
                <RefreshList />
                <button
                    class="btn btn-secondary list-options"
                    style="border: 0.125rem solid black"
                    type="button"
                    data-bs-theme="dark"
                >
                    <svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g fill="#000000" transform="scale(.1)">
                            <circle cx="200" cy="500" r="100" />
                            <circle cx="500" cy="500" r="100" />
                            <circle cx="800" cy="500" r="100" />
                        </g>
                    </svg>
                </button>

                <router-link :to="{ name: 'add-visitor' }">
                    <button
                        type="button"
                        class="btn btn-primary"
                        id="new-visitor"
                        style="padding: 0.5rem 1.5rem; font-weight: 600"
                    >
                        Add Visitor
                    </button>
                </router-link>
            </div>
        </div>
        <div class="row justify-content-between container p-0 mx-auto">
            <Search />
            <Filter />
            <Sort />
        </div>

        <VisitorList />
        <Pagination />
        <RouterView :breadCrumbs="breadCrumbs" />
    </div>
</template>

<script setup>
import BreadCrumbs from "../components/BreadCrumbs.vue";
import VisitorList from "../components/visitors/VisitorList.vue";
import Search from "../components/Search.vue";
import Filter from "../components/Filter.vue";
import Sort from "../components/Sort.vue";
import RefreshList from "../components/RefreshList.vue";
import Pagination from "../components/Pagination.vue";

import { RouterLink, RouterView } from "vue-router";

import { ref, defineProps } from "vue";

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});
</script>

<style scoped>
#visitor-view {
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
    #visitor-view {
        padding: 1rem 3rem 0 3rem;
    }
}
</style>
