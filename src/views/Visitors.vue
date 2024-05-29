<template>
    <div
        class="d-flex flex-column"
        style="padding: 3rem 8rem 0 8rem; gap: 2.5rem"
    >
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
        >
            <BreadCrumbs />

            <div>
                <RefreshList />
                <button id="list-options" class="hover-btn btn mx-2 bg-white">
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
                <button
                    class=".hover-btn btn btn-primary text-black"
                    id="new-visitor"
                    type="submit"
                    style="padding: 0.8rem 1.5rem; font-weight: 600"
                >
                    Add Visitor
                </button>
            </div>
        </div>
        <div class="row justify-content-between container p-0 mx-auto">
            <Search />
            <Filter />
            <Sort />
        </div>
        <VisitorList />
    </div>
</template>

<script setup>
import BreadCrumbs from "../components/BreadCrumbs.vue";
import VisitorList from "../components/visitors/VisitorList.vue";
import Search from "../components/Search.vue";
import Filter from "../components/Filter.vue";
import Sort from "../components/Sort.vue";
import RefreshList from "../components/RefreshList.vue";
</script>

<style scoped>
#list-options {
    padding: 0.8rem 0.5rem;
    font-weight: 400;
    border: 0.0125rem solid #ccc;
    border-radius: 0.25rem !important;
}
svg {
    height: 20px !important;
    margin: 0 !important;
}

#new-visitor:hover {
    color: white !important;
}
</style>
