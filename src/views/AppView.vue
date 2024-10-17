<template>
    <div id="wrapper">
        <div class="d-flex gap-4 px-0" style="height: 100%">
            <aside id="sideBar" class="flex-grow-0 bg-info">
                <SideBar
                    v-model:activeSection="activeSection"
                    v-model:breadCrumbs="breadCrumbs"
                />
            </aside>
            <main
                @click="hideSidebarOnSmallScreen"
                class="flex-grow-1"
                style="background-color: #ececec"
            >
                <HeaderBar :activeSection="activeSection" />

                <section>
                    <div v-if="$sectionIsLoading" id="sectionLoader">
                        <div
                            id="sectionSpinner"
                            class="spinner-grow spinner-grow-lg"
                            role="status"
                        >
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <RouterView :breadCrumbs="breadCrumbs" />
                </section>
            </main>
        </div>
    </div>
</template>

<script setup>
import SideBar from "../components/SideBar.vue";
import HeaderBar from "../components/HeaderBar.vue";

import { getCurrentInstance, ref } from "vue";
import { RouterView } from "vue-router";
import { hideSidebarOnSmallScreen } from "@/util/util";

const activeSection = ref("");
const breadCrumbs = ref([]);

const $sectionIsLoading =
    getCurrentInstance().appContext.config.globalProperties.$sectionIsLoading;
</script>

<style>
#sectionLoader {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 6rem;
    left: 20rem;
    right: 0;
    bottom: 0;
    z-index: 9999999999999;
    background-color: rgba(0, 0, 0, 0.25);
}

#sectionSpinner {
    background-color: black;
}

#wrapper {
    height: 100vh;
    width: 100vw;
}

/* Section Scrolling Media Query */
@media (min-width: 1700px) and (min-height: 920px) {
    #wrapper {
        position: fixed;
    }
}

aside {
    width: 20rem;
    height: 100vh;
    position: fixed;
    z-index: 1700;
}

main {
    margin-left: 20rem;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-bottom: 3rem;
}

.modal-backdrop {
    display: none !important;
}

@media (max-width: 1440px) {
    main {
        margin-left: 15rem;
    }

    header {
        padding: 0 1.275rem !important;
    }
}

@media (max-width: 1250px) {
    #sideBar {
        display: none;
    }

    main {
        margin-left: 0 !important;
    }

    #sectionLoader {
        left: 0 !important;
    }
}
</style>
