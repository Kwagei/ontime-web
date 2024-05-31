<template>
    <div id="visitor-view" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
        >
            <BreadCrumbs />

            <div>
                <RefreshList />
                <MoreIcon />
                <router-link :to="'/visitors/new-visitor'">
                    <button
                        class=".hover-btn btn btn-primary text-black"
                        id="new-visitor"
                        type="submit"
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
import MoreIcon from "../components/MoreIcon.vue";
</script>

<style scoped>
svg {
    height: 20px !important;
    margin: 0 !important;
}

#new-visitor:hover {
    color: white !important;
}

#visitor-view {
    padding-top: 2rem;
    gap: 1.5rem;
}

@media (min-width: 768px) and (max-width: 1440px) {
    #visitor-view {
        padding: 1rem 3rem 0 3rem;
    }
}
</style>
