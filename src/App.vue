<template>
    <div style="" id="wrapper">
        <div class="d-flex gap-4 px-0" style="height: 100%">
            <aside
                class="flex-grow-0 bg-info"
                style="width: 20rem; height: 100%"
            >
                <SideBar @currentSection="currentSection" />
            </aside>
            <main class="flex-grow-1" style="background-color: #ececec">
                <HeaderBar :activeSection="activeSection" />

                <section>
                    <!-- <AddVisitors
                        @visitorFormSubmitted="handleVisitorSubmitted"
                    /> -->
                    <RouterView />
                </section>
            </main>
        </div>
    </div>
</template>

<script setup>
import AddVisitors from "./components/visitors/AddVisitors.vue";
import SideBar from "./components/SideBar.vue";
import HeaderBar from "./components/HeaderBar.vue";

import { ref, defineProps } from "vue";
import { RouterView } from "vue-router";

const emit = defineEmits(["activeSection"]);

const breadcrumbs = ref([]);
const activeSection = ref("");

const currentSection = (section) => {
    activeSection.value = section;
    breadcrumbs.value.push(section);
};

window.onload = () => {
    const { pathname } = location;
    activeSection.value = pathname.split("/")[1];
};

const handleVisitorSubmitted = (visitor) => {
    visitors.value.push(visitor);
};
</script>

<style scope>
#wrapper {
    height: 100vh;
}
</style>
