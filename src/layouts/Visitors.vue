<template>
    <div id="visitor-view" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
        >
            <BreadCrumbs :breadCrumbs="breadCrumbs" />

            <div class="d-flex" style="gap: 0.521rem">
                <RefreshList @click="refresh = true" />
                <div class="dropdown">
                    <Options />
                    <ul class="dropdown-menu boxShadow rounded">
                        <li
                            @click="displayExportModay"
                            id="export"
                            class="dropdown-item"
                        >
                            Export
                        </li>
                        <li
                            @click="displayFilterModal"
                            id="filter-visitors"
                            class="dropdown-item"
                        >
                            Filter Visitors
                        </li>
                    </ul>
                </div>

                <router-link :to="{ name: 'add-visitor' }">
                    <button
                        id="addVisitorBtn"
                        type="button"
                        class="btn btn-primary"
                    >
                        <Icons v-model:icon="add" />
                        New
                    </button>
                </router-link>
            </div>
        </div>

        <VisitorList
            v-model:refresh="refresh"
            v-model:totalVisitors="totalVisitors"
            v-model:filterDates="filterDates"
        />

        <FilterModal @done="filterCompleted" />
        <ExportModal
            :exportFields="exportFields"
            v-model:exportTitle="exportTitle"
            @export="exportVisitors"
        />

        <RouterView :breadCrumbs="breadCrumbs" />
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import BreadCrumbs from "../components/BreadCrumbs.vue";
import VisitorList from "../components/visitors/VisitorList.vue";
import RefreshList from "../components/RefreshList.vue";
import Options from "../components/Options.vue";
import Icons from "../components/Icons.vue";
const add = "add";

import { RouterLink, RouterView } from "vue-router";
import { csvExport, getVisitors } from "../assets/js/index.js";
import { hideSidebarOnSmallScreen, showModal } from "@/util/util";
import FilterModal from "@/components/modals/FilterModal.vue";
import ExportModal from "@/components/modals/ExportModal.vue";

const totalVisitors = defineModel("totalVisitors");
const breadCrumbs = defineModel("breadCrumbs");
const refresh = defineModel("refresh");
const exportFields = ref([
    { name: "First name", selected: false },
    { name: "Middle name", selected: false },
    { name: "Last name", selected: false },
    { name: "Phone number", selected: false },
    { name: "Email", selected: false },
    { name: "Address", selected: false },
]);
const exportTitle = defineModel("exportTitle");
exportTitle.value = "Visitors";

const exportVisitors = async (fields) => {
    const { data: visitors } = await getVisitors({
        limit: totalVisitors.value,
    });

    const selectedVisitors = visitors.map((visitor) => {
        const data = {};
        for (const field of fields) {
            if (field === "phone_number") {
                data[field] = `0${visitor.msisdn.slice(3)}`;
            } else {
                data[field] = visitor[field];
            }
        }

        return data;
    });

    csvExport(selectedVisitors);
};

const filterDates = ref({
    from: "",
    to: "",
});

const displayFilterModal = () => {
    showModal("#filterModal", "#modal-dialog");
};

const displayExportModay = () => {
    showModal("#exportModal", "#modal-dialog");
};

// update date ranges, then it will be caught by watchers in visitors table
const filterCompleted = (newDates) => {
    filterDates.value = newDates;
};

onMounted(() => {
    hideSidebarOnSmallScreen();
});
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

li {
    font-size: 1rem;
    font-weight: 600;
    padding: 0.75rem 1rem;
}
</style>
