<template>
    <div style="" id="wrapper">
        <div class="d-flex gap-4 px-0" style="height: 100%">
            <aside class="flex-grow-0 bg-info">
                <SideBar @currentSection="currentSection" />
            </aside>
            <main class="flex-grow-1" style="background-color: #ececec">
                <HeaderBar :activeSection="activeSection" />

                <section>
                    <!-- <AddVisitors
                        @visitorFormSubmitted="handleVisitorSubmitted"
                    /> -->
                    <RouterView :breadcrumbs="breadcrumbs" />
                </section>
            </main>
        </div>
    </div>
</template>

<script setup>
import SideBar from "./components/SideBar.vue";
import HeaderBar from "./components/HeaderBar.vue";

import { ref } from "vue";
import { RouterView } from "vue-router";

const breadcrumbs = ref("");
const activeSection = ref("");

const currentSection = (section) => {
    activeSection.value = section;
    breadcrumbs.value = section;
};
</script>

<style scope>
#wrapper {
    height: 100vh;
}

aside {
    width: 20rem;
    height: 100%;
}

@media (min-width: 768px) and (max-width: 1440px) {
    aside {
        width: 16rem;
    }
}
</style>
