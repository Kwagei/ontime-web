<template>
    <div id="visitor-view" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
            style="margin-top: 0.3rem"
        >
            <BreadCrumbs v-model:breadCrumbs="breadCrumbs" />
        </div>
        <div
            class="mt-4 form-control"
            style="
                margin: auto;
                padding: 0 !important;
                border: none;
                background-color: transparent;
            "
        >
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="input-group">
                        <div class="form-control" style="padding: 2rem">
                            <div
                                class="d-flex justify-content-between align-items-center"
                            >
                                <h4 class="m-0">Visitor Information</h4>
                                <router-link
                                    :to="{
                                        name: 'edit-visitor',
                                    }"
                                    v-model:visitor-info="visitorInfo"
                                >
                                    <button
                                        class="btn btn-secondary editBtn"
                                        style="border: 0.125rem solid black"
                                        type="button"
                                        data-bs-theme="dark"
                                    >
                                        <Icons v-model:icon="edit" />
                                    </button>
                                </router-link>
                            </div>
                            <div
                                class="d-flex align-items-center"
                                style="gap: 1.5rem; padding-top: 1rem"
                            >
                                <div>
                                    <div class="profile-container">
                                        <img
                                            src="../../assets/images/user.png"
                                            alt="User"
                                            class="profile-image"
                                        />
                                    </div>
                                </div>
                                <div class="visitor-info">
                                    <ul>
                                        <li v-for="(info, key) in visitorInfo">
                                            <!-- First name <br /> -->
                                            <div
                                                class="card-body"
                                                v-if="
                                                    key !== 'id' &&
                                                    key !== 'middle_name' &&
                                                    key !== 'created_at' &&
                                                    key !== 'email'
                                                "
                                            >
                                                <span>{{
                                                    formatVisitorInfo(key)
                                                }}</span
                                                >:

                                                <span
                                                    class="card-text fw-bold"
                                                    >{{ info }}</span
                                                >
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="input-group"></div>
                </div>
            </div>
        </div>

        <div>
            <DataTable
                id="eventssTable"
                class="display w-100 table"
                :columns="columns"
                :options="options"
                ref="table"
            />
        </div>
    </div>
</template>
<script setup>
import BreadCrumbs from "../BreadCrumbs.vue";
import Icons from "../Icons.vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";
import { API_URL } from "@/assets/js";

DataTable.use(DataTablesCore);

import { useRoute } from "vue-router";
import { ref } from "vue";
import { RouterLink } from "vue-router";

const edit = "pencil";

const route = useRoute();

const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);

const id = ref(route.params.id);
const visitorInfo = ref("");

const columns = [
    { data: "date_time", title: "Date" },
    { data: "date_time", title: "Arrival Time" },
    { data: "departure_time", title: "Departure Time" },
    { data: "purpose", title: "Purpose" },
    { data: "items", title: "Items" },
];

const options = {
    responsive: true,
    select: true,
    serverSide: true,
    ajax: {
        url: `${API_URL}visitors/${id.value}/visits`,
        type: "GET",
        data: (query) => {
            const order =
                query.columns[query.order[0].column].data === "date"
                    ? "date_time"
                    : query.columns[query.order[0].column].data;
            return {
                start: query.start,
                limit: query.length,
                search: query.search.value,
                sort: order,
                direction: query.order[0].dir,
            };
        },
        dataSrc: (json) => {
            const { visitor, visits } = json.data;
            visitorInfo.value = visitor;

            json.recordsTotal = visits.length;
            json.recordsFiltered = visits.length;

            return visits.visitorVisits;
        },
        error: (error) => {
            console.log("Error fetching data:", error.responseJSON);
        },
    },
    responsive: true,
    lengthMenu: [10, 25, 50, 100],
    language: {
        searchPlaceholder: "Search ...",
        search: "",
        emptyTable: `
         <div class="d-flex flex-column justify-content-center align-items-center gap-3 p-4">
            No Visits to show!
            <svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M82.5 37.5V35l-15-15H60v-3.75A1.25 1.25 0 0058.75 15h-2.5A1.25 1.25 0 0055 16.25V20H40v-3.75A1.25 1.25 0 0038.75 15h-2.5A1.25 1.25 0 0035 16.25V20h-7.5l-15 15v2.5h5V85H15v2.5h65V85h-2.5V37.5zM35 77.5H25V70a5 5 0 015-5 5 5 0 015 5zm0-25H25V45a5 5 0 015-5 5 5 0 015 5zM52.5 85h-10V70a5 5 0 015-5 5 5 0 015 5zm0-32.5h-10V45a5 5 0 015-5 5 5 0 015 5zm17.5 25H60V70a5 5 0 015-5 5 5 0 015 5zm0-25H60V45a5 5 0 015-5 5 5 0 015 5z"/></svg>
        </div>
        `,
        loadingRecords: `<div class="d-flex justify-content-center p-4">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        </div>`,
    },
    order: [[2, "desc"]],
    destroy: true,
};

const formatVisitorInfo = (key) => {
    if (!key) return "";

    const v = key.split("_").join(" ");
    const formattedString = v.charAt(0).toUpperCase() + v.slice(1);

    return formattedString;
};

const formatDateTime = (visits) => {
    return visits.map((visit) => {
        if (visit.date_time) {
            const [date, time] = visit.date_time.split("T");
            const arrival_time = time.split(".")[0];
            visit.items = visit.items ? visit.items.join(", ") : "";
            delete visit.date_time;
            return { ...visit, date, arrival_time };
        } else {
            return visit;
        }
    });
};
</script>

<style scoped>
.profile-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 8rem;
    height: 8rem;
    padding: 0.5rem;
    background-color: black;
    border-radius: 50%;
    overflow: hidden;
}

.profile-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.visitor-info {
    margin-top: 0.5rem;
}

.visitor-info ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.visitor-info li {
    margin-bottom: 0.5rem;
}

.visitor-item {
    color: gray;
}

.btn {
    padding: 0.5rem !important;
}
.btn:hover {
    border: 0.125rem solid black !important;
}

.btn:hover path {
    fill: white;
}
.editBtn svg {
    height: 1.5rem !important;
    margin: 0 !important;
}
</style>
