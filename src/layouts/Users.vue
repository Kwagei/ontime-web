<template>
    <div id="visitor-view" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
        >
            <BreadCrumbs :breadCrumbs="breadCrumbs" />

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
                        <li
                            @click="displayFilterModal"
                            id="filter-visitors"
                            class="dropdown-item"
                        >
                            Filter Visitors
                        </li>
                    </ul>
                </div>

                <router-link :to="{ name: 'add-user' }">
                    <button
                        id="addUserBtn"
                        type="button"
                        class="btn btn-primary"
                    >
                        <Icons v-model:icon="add" />
                        New
                    </button>
                </router-link>
            </div>
        </div>

        <UsersList
            v-model:refresh="refresh"
            v-model:totalVisitors="totalUsers"
            v-model:filterDates="filterDates"
        />

        <FilterModal @done="filterCompleted" />
        <ExportModal
            :exportFields="exportFields"
            v-model:exportTitle="exportTitle"
            @export="exportUsers"
        />

        <RouterView :breadCrumbs="breadCrumbs" />
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import BreadCrumbs from "../components/BreadCrumbs.vue";
import UsersList from "../components/users/UsersList.vue";
import RefreshList from "../components/RefreshList.vue";
import Options from "../components/Options.vue";
import Icons from "../components/Icons.vue";
const add = "add";

import { RouterLink, RouterView } from "vue-router";
import { csvExport, getUsers } from "../assets/js/index.js";
import { hideSidebarOnSmallScreen, showModal } from "@/util/util";
import FilterModal from "@/components/modals/FilterModal.vue";
import ExportModal from "@/components/modals/ExportModal.vue";

const totalUsers = defineModel("totalUsers");
const breadCrumbs = defineModel("breadCrumbs");
const refresh = defineModel("refresh");
const exportFields = ref([
    { name: "Username", selected: false },
    { name: "Email", selected: false },
    { name: "Phone number", selected: false },
    { name: "Address", selected: false },
    { name: "Roles", selected: false },
]);
const exportTitle = defineModel("exportTitle");
exportTitle.value = "Users";

const exportUsers = async (fields) => {
    const { users } = await getUsers({
        limit: totalUsers.value,
    });

    const selectedUsers = users.map((user) => {
        const data = {};
        for (const field of fields) {
            if (field === "phone_number") {
                const [phone_number] = user.msisdn;
                data[field] = `0${phone_number.slice(3)}`;
            } else if (field === "roles") {
                const [user_role] = user[field];
                data[field] = user_role;
            } else {
                data[field] = user[field];
            }
        }

        return data;
    });

    csvExport(selectedUsers);
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
