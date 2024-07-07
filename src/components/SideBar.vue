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
                    <Icons v-model:icon="item.svg" />
                    {{ item.name }}
                </router-link>
            </li>
        </ul>
        <hr />

        <div>
            <ul class="nav nav-pills flex-column mb-auto">
                <li class="nav-item">
                    <a href="#" class="nav-link" aria-current="page">
                        <Icons v-model:icon="logOut" />
                        Log Out
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { RouterLink, useRoute } from "vue-router";
import Icons from "@/components/Icons.vue";

import { ref, watch } from "vue";

const route = useRoute();
const breadCrumbs = defineModel("breadCrumbs");
const activeSection = defineModel("activeSection");
const logOut = ref("session-leave");

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
        svg: `avatar`,
    },
    {
        name: "visits",
        svg: `house`,
    },
    {
        name: "events",
        svg: `calendar-event-agenda`,
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
