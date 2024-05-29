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
                        border-radius: 0.25rem !important;
                    "
                >
                    <svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="#000000"
                            fill-rule="evenodd"
                            d="m78.286 21.717-.002-.001a40 40 0 00-56.568 0c-15.621 15.62-15.621 40.947 0 56.568a40 40 0 0056.568 0L67.678 67.678a25 25 0 110-35.356l.003.003L57.507 42.5H82.5a5 5 0 005-5v-25Z"
                        />
                    </svg>
                </button>
                <button
                    class="visitors-list-btn btn mx-2 bg-white"
                    style="
                        padding: 0.8rem 0.5rem;
                        font-weight: 400;
                        border: 0.0125rem solid #ccc;
                        border-radius: 0.25rem !important;
                    "
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
                <button
                    class="visitors-list-btn btn btn-primary text-black"
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
                    class="btn visitors-list-btn"
                    style="
                        width: 80%;
                        height: 100%;
                        border: none;
                        border-radius: 0.25rem;
                        border-right: 0.0125rem solid #ccc;
                        padding: 0.9rem;
                        font-weight: 400;
                        color: black;
                    "
                >
                    <svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="#000000"
                            fill-rule="evenodd"
                            d="M90 12.5V20L57.5 52.5v40l-15-15v-25L10 20v-7.5a5 5 0 015-5h70a5 5 0 015 5"
                        />
                    </svg>
                    Filter
                </button>
                <button
                    class="flex-grow-1 visitors-list-btn"
                    style="
                        border: none;
                        background-color: white;
                        border-radius: 0.25rem;
                    "
                >
                    <svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="#000000"
                            fill-rule="evenodd"
                            d="M81.75 67.617a5 5 0 010 7.066l-7.067 7.066a5 5 0 01-7.067 0L49.95 64.083 32.283 81.749a5 5 0 01-7.066 0l-7.066-7.066a5 5 0 010-7.067L35.817 49.95 18.151 32.283a5 5 0 010-7.066l7.066-7.066a5 5 0 017.067 0L49.95 35.817l17.667-17.666a5 5 0 017.066 0l7.066 7.066a5 5 0 010 7.067L64.083 49.95Z"
                        />
                    </svg>
                </button>
            </div>
            <div
                class="col-md-3 filter-item bg-white d-flex justify-content-between"
                style="border: 0.0125rem solid #ccc; border-radius: 0.25rem"
            >
                <button
                    class="flex-grow-1 visitors-list-btn"
                    style="
                        border: none;
                        background-color: white;
                        border-radius: 0.25rem;
                    "
                >
                    <svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="#000000"
                            fill-rule="evenodd"
                            d="M85 82.5H42.4a5 5 0 010-10H85a5 5 0 010 10M69.9 67.4H42.3a5 5 0 010-10h27.6a5 5 0 010 10M55 52.5H42.5a5 5 0 010-10H55a5 5 0 010 10M37.43 36.082l-4.93-4.93V77.35a5.05 5.05 0 01-5.05 5.05c-2.789 0-4.95-2.261-4.95-5.05V31.154l-4.937 4.937a4.85 4.85 0 11-6.859-6.86l12.828-12.827a4.84 4.84 0 013.841-1.4Q27.436 15 27.5 15c.096 0 .205-.005.3 0a4.8 4.8 0 013.668 1.42L44.28 29.232a4.844 4.844 0 11-6.85 6.85"
                        />
                    </svg>
                </button>
                <button
                    class="btn visitors-list-btn"
                    style="
                        width: 80%;
                        height: 100%;
                        border: none;
                        border-radius: 0.25rem;
                        border-left: 0.0125rem solid #ccc;
                        padding: 0.9rem;
                        font-weight: 400;
                        color: black;
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

    .visitors-list-btn:hover path,
    .visitors-list-btn:hover g {
        fill: var(--bs-white) !important;
    }
}
</style>
