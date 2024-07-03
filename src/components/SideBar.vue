<template>
    <div
        class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
        style="height: 100%"
    >
        <a
            href="/"
            class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
            <h2 class="m-0 px-4">OnTime</h2>
        </a>
        <hr />
        <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item" v-for="item in navItems" :key="item.name">
                <router-link
                    class="nav-link text-white"
                    :to="{ name: item.name }"
                    :id="item.name"
                >
                    <span v-html="item.svg"></span>
                    {{ item.name }}
                </router-link>
            </li>
        </ul>
        <hr />

        <div>
            <ul class="nav nav-pills flex-column mb-auto">
                <li class="nav-item">
                    <a href="#" class="nav-link" aria-current="page">
                        <svg
                            width="100"
                            height="100"
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill="#FFFFFF"
                                fill-rule="evenodd"
                                d="M72.623 85H27.377A2.377 2.377 0 0125 82.623V17.377A2.377 2.377 0 0127.377 15h45.246A2.377 2.377 0 0175 17.377v5.246A2.377 2.377 0 0077.377 25h2.746a2.377 2.377 0 002.377-2.377v-9.9A5.223 5.223 0 0077.277 7.5H22.424a4.924 4.924 0 00-4.924 4.924v74.654a5.42 5.42 0 005.422 5.422h54.343a5.235 5.235 0 005.235-5.235v-9.888A2.377 2.377 0 0080.123 75h-2.746A2.377 2.377 0 0075 77.377v5.246A2.377 2.377 0 0172.623 85M57.5 62.5H40c-2.514 0-5-2.569-5-5v-15c0-2.431 2.486-5 5-5h17.5V25l23.346 21.05a5.68 5.68 0 011.654 4 5.68 5.68 0 01-1.654 4L57.5 75z"
                            />
                        </svg>
                        Log Out
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { RouterLink, useRoute } from "vue-router";

import { watch } from "vue";

const route = useRoute();
const breadCrumbs = defineModel("breadCrumbs");
const activeSection = defineModel("activeSection");

activeSection.value = route.path.split("/")[1];

watch(
    () => route.path,
    (newPath) => {
        const currentSection = newPath.split("/")[1];
        activeSection.value = currentSection;
        breadCrumbs.value = [currentSection];
    }
);

const navItems = [
    {
        name: "visitors",
        svg: `<svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="#FFFFFF"
                            fill-rule="evenodd"
                            d="M33.8 87.5V69.684A10.02 10.02 0 0126.3 60V48.75a18.7 18.7 0 011.763-7.943 16.64 16.64 0 01-10.72-4.533A15.29 15.29 0 008.8 50v11.912C8.8 65.81 12.001 69 15.9 69v18.5a4.965 4.965 0 004.959 5h14.857a7.47 7.47 0 01-1.916-5m48.958-51.226a16.64 16.64 0 01-10.72 4.533A18.7 18.7 0 0173.8 48.75V60a10.02 10.02 0 01-7.5 9.684V87.5a7.47 7.47 0 01-1.916 5h14.857a4.965 4.965 0 004.959-5V69c3.899 0 7.1-3.19 7.1-7.088V50a15.29 15.29 0 00-8.542-13.726M71.3 12.5a12.44 12.44 0 00-6.538 1.845q.135.286.26.579a16.24 16.24 0 01-2.416 16.644l.723.356a18.8 18.8 0 016.668 5.509A12.5 12.5 0 1071.3 12.5m-7.5 8.75A13.75 13.75 0 1150.05 7.5 13.75 13.75 0 0163.8 21.25m-1.576 12.916a17.747 17.747 0 01-24.348 0A16.25 16.25 0 0028.8 48.75V60a7.5 7.5 0 007.5 7.5v20a5 5 0 005 5h17.5a5 5 0 005-5v-20a7.5 7.5 0 007.5-7.5V48.75a16.25 16.25 0 00-9.076-14.584m-32.12 3.266a18.8 18.8 0 016.667-5.508l.723-.357a16.27 16.27 0 01-2.416-16.643q.125-.292.26-.58A12.5 12.5 0 1028.8 37.5a13 13 0 001.304-.067Z"
                        />
                    </svg>`,
    },
    {
        name: "visits",
        svg: `<svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="#FFFFFF"
                            fill-rule="evenodd"
                            d="M82.5 37.5V35l-15-15H60v-3.75A1.25 1.25 0 0058.75 15h-2.5A1.25 1.25 0 0055 16.25V20H40v-3.75A1.25 1.25 0 0038.75 15h-2.5A1.25 1.25 0 0035 16.25V20h-7.5l-15 15v2.5h5V85H15v2.5h65V85h-2.5V37.5zM35 77.5H25V70a5 5 0 015-5 5 5 0 015 5zm0-25H25V45a5 5 0 015-5 5 5 0 015 5zM52.5 85h-10V70a5 5 0 015-5 5 5 0 015 5zm0-32.5h-10V45a5 5 0 015-5 5 5 0 015 5zm17.5 25H60V70a5 5 0 015-5 5 5 0 015 5zm0-25H60V45a5 5 0 015-5 5 5 0 015 5z"
                        />
                    </svg>`,
    },
    {
        name: "events",
        svg: ` <svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="#FFFFFF"
                            fill-rule="evenodd"
                            d="M80 17.5H70v-3.8c0-2.071-1.679-3.7-3.75-3.7a3.75 3.75 0 00-3.75 3.75v3.75H35.001L35 13.75a3.75 3.75 0 00-7.5 0v3.75H10V80a7.5 7.5 0 007.5 7.5h70V25a7.5 7.5 0 00-7.5-7.5m2.5 65H18.75A3.75 3.75 0 0115 78.75V40h63.75a3.75 3.75 0 013.75 3.75zM25 26.25a6.24 6.24 0 012.5-5v5a3.75 3.75 0 007.5 0V25h.001v-3.75a6.25 6.25 0 11-10.001 5m35 0a6.24 6.24 0 012.5-5v5a3.75 3.75 0 007.5 0L69.999 25H70v-3.7a6.15 6.15 0 012.5 4.95 6.25 6.25 0 01-12.5 0M23.75 45a3.75 3.75 0 103.75 3.75A3.75 3.75 0 0023.75 45m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55M23.75 57.5a3.75 3.75 0 103.75 3.75 3.75 3.75 0 00-3.75-3.75m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55M23.75 70a3.75 3.75 0 103.75 3.75A3.75 3.75 0 0023.75 70m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55"
                        />
                    </svg>`,
    },
];
</script>

<style scoped>
.nav-pills svg {
    width: 30px !important;
    height: 30px !important;
    margin-right: 0.5rem;
}
.nav-link {
    text-transform: capitalize !important;
}

.nav-item {
    margin: 0 !important;
}
</style>
