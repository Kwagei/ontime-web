<template>
    <div>
        <div
            class="d-flex justify-content-between align-items-center mt-2"
            style="width: 80%; margin: auto; padding-top: 1rem"
        >
            <BreadCrumbs />

            <div>
                <button
                    class="visitors-list-btn btn bg-white"
                    style="
                        padding: 0.8rem 0.5rem;
                        font-weight: 400;
                        border: 0.0125rem solid #ccc;
                        border-radius: 0.5rem !important;
                    "
                >
                    <svg
                        fill="#000000"
                        viewBox="0 0 489.645 489.645"
                        xml:space="preserve"
                    >
                        <g>
                            <path
                                d="M460.656,132.911c-58.7-122.1-212.2-166.5-331.8-104.1c-9.4,5.2-13.5,16.6-8.3,27c5.2,9.4,16.6,13.5,27,8.3
		c99.9-52,227.4-14.9,276.7,86.3c65.4,134.3-19,236.7-87.4,274.6c-93.1,51.7-211.2,17.4-267.6-70.7l69.3,14.5
		c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-122.8-25c-20.6-2-25,16.6-23.9,22.9l15.6,123.8
		c1,10.4,9.4,17.7,19.8,17.7c12.8,0,20.8-12.5,19.8-23.9l-6-50.5c57.4,70.8,170.3,131.2,307.4,68.2
		C414.856,432.511,548.256,314.811,460.656,132.911z"
                            />
                        </g>
                    </svg>
                </button>
                <button
                    class="visitors-list-btn btn mx-2 bg-white"
                    style="
                        padding: 0.8rem 1rem;
                        font-weight: 400;
                        border: 0.0125rem solid #ccc;
                        border-radius: 0.25rem !important;
                    "
                >
                    ...
                </button>
                <button
                    class="btn btn-primary text-black"
                    id="new-visitor"
                    type="submit"
                    style="padding: 0.64rem 1.5rem; font-weight: 600"
                >
                    Add Visitor
                </button>
            </div>
        </div>
        <div
            id="filters"
            class="row g-4 mb-3 justify-content-between"
            style="width: 80%; margin: auto"
        >
            <div class="col-md-5 filter-item">
                <input
                    type="search"
                    class="form-control"
                    id="first_name"
                    placeholder="Search ..."
                    style="
                        padding: 0.9rem 1.4rem;
                        font-weight: 400;
                        border: 0.0125rem solid #ccc;
                        border-radius: 0.25rem !important;
                    "
                />
            </div>
            <div
                class="col-md-3 filter-item bg-white d-flex justify-content-between"
                style="border: 0.0125rem solid #ccc; border-radius: 0.25rem"
            >
                <button
                    class="btn"
                    style="
                        width: 80%;
                        height: 100%;
                        border: none;
                        border-radius: 0.25rem;
                        border-right: 0.0125rem solid #ccc;
                        padding: 0.9rem;
                        font-weight: 400;
                        color: black !important;
                    "
                >
                    Filter
                </button>
                <button
                    class="flex-grow-1"
                    style="
                        border: none;
                        background-color: white;
                        border-radius: 0.25rem;
                    "
                ></button>
            </div>
            <div
                class="col-md-3 filter-item bg-white d-flex justify-content-between"
                style="border: 0.0125rem solid #ccc; border-radius: 0.25rem"
            >
                <button
                    class="flex-grow-1"
                    style="
                        border: none;
                        background-color: white;
                        border-radius: 0.25rem;
                    "
                ></button>
                <button
                    class="btn"
                    style="
                        width: 80%;
                        height: 100%;
                        border: none;
                        border-radius: 0.25rem;
                        border-left: 0.0125rem solid #ccc;
                        padding: 0.9rem;
                        font-weight: 400;
                        color: black !important;
                    "
                >
                    Last Updated On
                </button>
            </div>
        </div>
        <VisitorList />
    </div>
</template>

<script setup>
import BreadCrumbs from "../../components/BreadCrumbs.vue";
import VisitorList from "./VisitorList.vue";
</script>

<style scoped>
svg {
    height: 20px !important;
    margin: 0 !important;
}

#new-visitor:hover {
    color: white !important;
}

.filter-item {
    padding: 0 !important;
}

@media (hover: hover) {
    .visitors-list-btn:hover {
        background-color: var(--bs-black) !important;
        color: white !important;
    }

    .visitors-list-btn:hover path {
        fill: var(--bs-white) !important;
    }
}
</style>
