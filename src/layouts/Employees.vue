<template>
    <div id="employeesWrapper" class="d-flex flex-column container">
        <div
            id="breadCrumbsOptionsTopWrapper"
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
        >
            <BreadCrumbs :breadCrumbs="['Employees']" />

            <div class="d-flex" style="gap: 0.521rem; margin-left: auto">
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
                    </ul>
                </div>

                <router-link :to="{ name: 'add-employee' }">
                    <button
                        id="addEmployeeBtn"
                        type="button"
                        class="btn btn-primary"
                    >
                        <Icons v-model:icon="plusIcon" />
                        New
                    </button>
                </router-link>
            </div>
        </div>

        <EmployeesTable v-model:refresh="refresh" />

        <ExportModal
            :exportFields="exportFields"
            v-model:exportTitle="exportTitle"
            @export="exportEmployees"
        />
    </div>
</template>

<script setup>
import RefreshList from "../components/RefreshList.vue";
import BreadCrumbs from "../components/BreadCrumbs.vue";
import EmployeesTable from "../components/employees/EmployeesTable.vue";
import Options from "../components/Options.vue";
import Icons from "../components/Icons.vue";
const plusIcon = "add";

import { getCurrentInstance, onMounted, ref } from "vue";
import { csvExport, getEmployees } from "../assets/js/index.js";
import ExportModal from "@/components/modals/ExportModal.vue";
import { hideSidebarOnSmallScreen, showModal } from "@/util/util";

const exportTitle = defineModel("exportTitle");

const exportFields = ref([
    { name: "First Name", selected: false },
    { name: "Last Name", selected: false },
    { name: "Phone Number", data: "msisdn", selected: false },
    { name: "Position", selected: false },
    { name: "Email", selected: false },
    { name: "Address", selected: false },
    { name: "Room", selected: false },
    { name: "Creation Date", data: "created_at", selected: false },
]);

exportTitle.value = "Employees";

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});

// section loader flag
const $sectionIsLoading =
    getCurrentInstance().appContext.config.globalProperties.$sectionIsLoading;

onMounted(() => {
    hideSidebarOnSmallScreen();

    // ensure section loader is not showing
    $sectionIsLoading.value = false;
});

const refresh = ref(false);

const exportEmployees = async (fields) => {
    const { employees } = await getEmployees(null, { limit: "all" });

    const selectedEmployees = employees.map((employee) => {
        const data = {};
        for (const field of fields) {
            data[field] = employee[field];
        }

        return data;
    });

    csvExport(selectedEmployees);
};

const displayExportModay = () => {
    showModal("#exportModal", "#modal-dialog");
};
</script>

<style scoped>
svg {
    height: 20px !important;
    margin: 0 !important;
}

#new-visitor:hover {
    color: white !important;
}

#employeesWrapper {
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
