<template>
    <div id="visitor-view" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto mt-4"
        >
            <BreadCrumbs v-model:breadCrumbs="breadCrumbs" />
        </div>
        <div
            id="employeeImageInfoWrapper"
            class="mt-4 form-control"
            style="
                margin: auto;
                padding: 0 !important;
                border: none;
                background-color: transparent;
            "
        >
            <div class="row g-3">
                <div class="col-md-7">
                    <div class="input-group">
                        <div class="form-control rounded" style="padding: 2rem">
                            <div
                                class="d-flex align-items-start flex-wrap"
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
                                <div class="employee-info">
                                    <div>
                                        <span>
                                            {{ employeeInfo.first_name }}
                                            {{ employeeInfo.last_name }}
                                        </span>
                                    </div>
                                    <div v-if="employeeInfo.address">
                                        <span>
                                            <Icons
                                                class="icons"
                                                v-model:icon="locationIcon"
                                            />
                                        </span>
                                        <span class="employee-item">
                                            {{ employeeInfo.address }}
                                        </span>
                                    </div>
                                    <div class="d-flex gap-2">
                                        <div v-if="employeeInfo.email">
                                            <span>
                                                <Icons
                                                    class="icons"
                                                    v-model:icon="emailIcon"
                                                />
                                            </span>
                                            <span class="employee-item">
                                                {{ employeeInfo.email }}
                                            </span>
                                        </div>

                                        <div>
                                            <span>
                                                <Icons
                                                    class="icons"
                                                    v-model:icon="phoneIcon"
                                                />
                                            </span>
                                            <span class="employee-item">
                                                {{ employeeInfo.msisdn }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="d-flex gap-2">
                                        <div>
                                            <span>
                                                <Icons
                                                    class="icons"
                                                    v-model:icon="genderIcon"
                                                />
                                            </span>
                                            <span
                                                style="
                                                    text-transform: capitalize;
                                                "
                                                class="employee-item"
                                            >
                                                {{ employeeInfo.gender }}
                                            </span>
                                        </div>
                                        <div v-if="employeeInfo.position">
                                            <span>
                                                <Icons
                                                    class="icons"
                                                    v-model:icon="
                                                        occupationIcon
                                                    "
                                                />
                                            </span>
                                            <span
                                                style="
                                                    text-transform: capitalize;
                                                "
                                                class="employee-item"
                                            >
                                                {{ employeeInfo.position }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style="
                                        position: absolute;
                                        top: 3rem;
                                        right: 2rem;
                                        float: right;
                                    "
                                >
                                    <router-link
                                        :to="{
                                            name: 'edit-employee',
                                        }"
                                        v-model:employee-info="employeeInfo"
                                    >
                                        <button
                                            type="button"
                                            class="btn btn-outline-secondary"
                                            style="
                                                --bs-btn-font-size: 0.75rem;
                                                padding: 0.25rem 2rem;
                                            "
                                        >
                                            <Icons
                                                style="
                                                    width: 1.1rem;
                                                    height: 1rem;
                                                "
                                                v-model:icon="edit"
                                            />
                                        </button>
                                    </router-link>
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
                class="display w-100 table responsive"
                :columns="columns"
                :options="options"
                ref="table"
                v-show="!showError"
            />
            <h3 class="mt-5 text-center fw-bold" v-if="showError">
                Unable to load employee's meetings, try again!
            </h3>
        </div>
    </div>
</template>

<script setup>
import BreadCrumbs from "../BreadCrumbs.vue";
import Icons from "../Icons.vue";
import { API_KEY, API_URL } from "@/assets/js";

import { useRoute } from "vue-router";
import { ref } from "vue";
import { RouterLink } from "vue-router";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";
import { formatDateTime, formatDepartureTime } from "@/util/util";

DataTable.use(DataTablesCore);

const edit = "pencil";

const route = useRoute();

const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);
const refresh = defineModel("refresh");

const table = ref("");
const showError = ref(false);

const id = ref(route.params.id);
const employeeInfo = ref("");
const allEmployeeMeetings = ref([]);

const locationIcon = "mahali";
const emailIcon = "email";
const genderIcon = "adult";
const phoneIcon = "device-smartphone";
const occupationIcon = "briefcase";

const columns = [
    { data: "date_time", title: "Date" },
    {
        data: null,
        title: "Visitor",
        orderable: false,
        render: (data) => `${data.first_name} ${data.last_name}`,
    },
    { data: "msisdn", title: "Phone Number" },
    { data: "room_name", title: "Room" },
    { data: "departure_time", title: "Departure Time" },
    {
        data: null,
        title: "Purpose",
        orderable: false,
        render: (data) => {
            if (data.event_id)
                return `<a href="/events/${data.event_id}">${data.purpose}</a>`;
            return data.purpose;
        },
    },
    { data: "items", title: "Items" },
];

const options = {
    responsive: true,
    select: true,
    serverSide: true,
    ajax: {
        url: `${API_URL}/employees/${id.value}/meetings`,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("authorization", API_KEY);
        },
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
            showError.value = false;
            refresh.value = false;

            const { employee, meetings, totalLength } = json.data;
            employee.msisdn = `0${employee.msisdn.slice(3)}`;

            employeeInfo.value = employee;

            json.recordsTotal = totalLength;
            json.recordsFiltered = totalLength;

            allEmployeeMeetings.value = formatEmployeeMeetings(meetings);

            return allEmployeeMeetings.value;
        },
        error: (error) => {
            console.log("Error fetching data:", error.responseJSON);
            showError.value = true;
            refresh.value = false;
        },
    },
    responsive: true,
    lengthMenu: [10, 25, 50, 100],
    language: {
        searchPlaceholder: "Search ...",
        search: "",
        emptyTable: `
			<div class="d-flex flex-column justify-content-center align-items-center gap-3 p-4">
				No Meetings to show!
				<svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M82.5 37.5V35l-15-15H60v-3.75A1.25 1.25 0 0058.75 15h-2.5A1.25 1.25 0 0055 16.25V20H40v-3.75A1.25 1.25 0 0038.75 15h-2.5A1.25 1.25 0 0035 16.25V20h-7.5l-15 15v2.5h5V85H15v2.5h65V85h-2.5V37.5zM35 77.5H25V70a5 5 0 015-5 5 5 0 015 5zm0-25H25V45a5 5 0 015-5 5 5 0 015 5zM52.5 85h-10V70a5 5 0 015-5 5 5 0 015 5zm0-32.5h-10V45a5 5 0 015-5 5 5 0 015 5zm17.5 25H60V70a5 5 0 015-5 5 5 0 015 5zm0-25H60V45a5 5 0 015-5 5 5 0 015 5z"/></svg>
			</div>
        `,
        zeroRecords: `
			<div class="d-flex flex-column justify-content-center align-items-center gap-3 p-4">
				No match found!
				<svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M82.5 37.5V35l-15-15H60v-3.75A1.25 1.25 0 0058.75 15h-2.5A1.25 1.25 0 0055 16.25V20H40v-3.75A1.25 1.25 0 0038.75 15h-2.5A1.25 1.25 0 0035 16.25V20h-7.5l-15 15v2.5h5V85H15v2.5h65V85h-2.5V37.5zM35 77.5H25V70a5 5 0 015-5 5 5 0 015 5zm0-25H25V45a5 5 0 015-5 5 5 0 015 5zM52.5 85h-10V70a5 5 0 015-5 5 5 0 015 5zm0-32.5h-10V45a5 5 0 015-5 5 5 0 015 5zm17.5 25H60V70a5 5 0 015-5 5 5 0 015 5zm0-25H60V45a5 5 0 015-5 5 5 0 015 5z"/></svg>
			</div>
        `,
        loadingRecords: `<div class="d-flex justify-content-center p-4">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        </div>`,
    },
    order: [[0, "desc"]],
    destroy: true,
};

const formatEmployeeMeetings = (meetings) => {
    for (const meeting of meetings) {
        if (meeting.date_time) {
            meeting.date_time = formatDateTime(meeting.date_time);
        }

        if (meeting.departure_time) {
            meeting.departure_time = formatDepartureTime(
                meeting.departure_time,
                {
                    time: true,
                }
            );
        }

        meeting.items = meeting.items ? meeting.items.join(", ") : "";
    }

    return meetings;
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
    border-radius: 0.5rem;
    overflow: hidden;
}

.profile-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.employee-info {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.employee-item {
    font-weight: 400;
    font-size: small;
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

.icons {
    width: 1.3rem;
    height: 1rem !important;
}

@media (max-width: 1000px) {
    #employeeImageInfoWrapper {
        margin-top: 0 !important;
    }
}
</style>
