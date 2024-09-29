<template>
    <div>
        <div
            class="offcanvas offcanvas-start"
            tabindex="-1"
            id="offcanvasExample"
            aria-labelledby="offcanvasExampleLabel"
        >
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasExampleLabel">
                    Purpose
                </h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="offcanvas"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    data-bs-title="Close"
                >
                    <span class="visually-hidden">Close</span>
                </button>
            </div>
            <div class="m-3">
                <router-link :to="{ name: 'visit-event' }">
                    <button
                        type="button"
                        class="btn btn-primary"
                        id=""
                        style="padding: 0.5rem 1.5rem; font-weight: 600"
                    >
                        Events
                    </button>
                </router-link>

                <router-link :to="''">
                    <button
                        type="button"
                        class="btn btn-primary"
                        id=""
                        style="padding: 0.5rem 1.5rem; font-weight: 600"
                        disabled
                    >
                        Meeting
                    </button>
                </router-link>

                <router-link :to="{ name: 'visit-workspace' }">
                    <button
                        type="button"
                        class="btn btn-primary"
                        id=""
                        style="padding: 0.5rem 1.5rem; font-weight: 600"
                    >
                        Workspace
                    </button>
                </router-link>
            </div>
        </div>

        <div class="container text-center">
            <div id="dashboardFirstChild" class="row gap-4 my-3">
                <div class="" id="stats">
                    <div
                        class="d-flex justify-content-end align-items-end w-100 pb-3"
                    >
                        <button
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasExample"
                            aria-controls="offcanvasExample"
                            class="btn btn-primary"
                        >
                            Check In
                        </button>
                    </div>
                    <div class="row align-items-start gap-4">
                        <div
                            class="form-control col py-3 px-4 d-flex rounded align-items-center gap-4"
                            style="padding-left: 2.5rem !important"
                        >
                            <div
                                id="visitIcon"
                                class="icon-circle"
                                style="background-color: #ff77002a"
                            >
                                <Icons class="icons" v-model:icon="visitIcon" />
                            </div>
                            <div
                                class="cards d-flex flex-column align-items-center"
                            >
                                <span>Today's Visits</span>
                                <h2>
                                    {{ todaysVisits || 0 }}
                                </h2>
                            </div>
                        </div>
                        <div
                            class="form-control col py-3 px-4 d-flex rounded align-items-center gap-4"
                            style="padding-left: 2.5rem !important"
                        >
                            <div
                                id="eventIcon"
                                class="icon-circle"
                                style="background-color: #1970c221"
                            >
                                <Icons class="icons" v-model:icon="eventIcon" />
                            </div>
                            <div
                                class="cards d-flex flex-column align-items-center"
                            >
                                <span>Today's Events</span>
                                <h2>{{ todaysEvents }}</h2>
                            </div>
                        </div>
                        <div
                            class="form-control col py-3 px-4 d-flex rounded align-items-center gap-4"
                            style="padding-left: 2.5rem !important"
                        >
                            <div
                                id="visitorIcon"
                                class="icon-circle"
                                style="background-color: rgb(255 204 0 / 19%)"
                            >
                                <Icons
                                    class="icons"
                                    v-model:icon="visitorIcon"
                                />
                            </div>
                            <div
                                class="cards d-flex flex-column align-items-center"
                            >
                                <span>Total Visitors</span>
                                <h2>{{ totalVisitors }}</h2>
                            </div>
                        </div>
                        <div
                            class="form-control col d-none rounded align-items-center gap-4"
                            style="
                                margin-top: auto;
                                padding: 0 !important;
                                background: transparent;
                                border: none;
                            "
                        >
                            <router-link to="/visits/purpose-event">
                                <button class="btn btn-primary px-4 py-2">
                                    Check In
                                </button>
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="form-control rounded col">
                    <Line
                        v-model:totalVisits="totalVisits"
                        v-model:todaysVisits="todaysVisits"
                    />
                </div>

                <div class="form-control rounded col">
                    <Bar v-model:totalVisits="totalVisits" />
                </div>

                <div class="form-control rounded col-12" style="padding: 3rem">
                    <Calender v-model:allEvents="allEvents" />
                </div>
            </div>

            <h4>Last 5 Check In</h4>
            <div class="row">
                <div class="col p-0" id="dashboardTable">
                    <VisitList
                        v-model:totalVisits="totalVisits"
                        v-model:filterDates="filterDates"
                        v-model:dtd="dashboardTableData"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Bar from "../components/dashboard/charts/Bar.vue";
import Line from "../components/dashboard/charts/Line.vue";
import Calender from "../components/dashboard/Calender.vue";
import { RouterLink } from "vue-router";

import VisitList from "@/components/visits/VisitList.vue";
import Icons from "@/components/Icons.vue";
import { onMounted, ref, watch } from "vue";
import { getVisitors } from "@/assets/js";
import { hideSidebarOnSmallScreen } from "@/util/util";

const visitIcon = "house";
const eventIcon = "calendar-event-agenda";
const visitorIcon = "collective-class-training";

const totalVisits = defineModel("totalVisits");
const totalVisitors = defineModel("totalVisitors");
const todaysVisits = defineModel("todaysVisits");
const todaysEvents = ref(0);
const allEvents = defineModel("allEvents");
allEvents.value = [];
const filterDates = ref({
    from: "",
    to: "",
});

const dashboardTableData = defineModel("dtd");
dashboardTableData.value = {
    lengthMenu: [5],
    bLengthChange: false,
    recordsFiltered: 0,
    bInfo: false,
    paging: true,
    searching: false,
};

watch(allEvents, (events) => {
    todaysEvents.value = getTodaysEvents(events).length;
});

const isEventHappeningToday = (event) => {
    const today = new Date();

    // Normalize today's date to midnight
    const startOfToday = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfToday = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    return (
        new Date(event.time.start) <= new Date(endOfToday) &&
        new Date(event.time.end) >= new Date(startOfToday)
    );
};

const getTodaysEvents = (events) => {
    return events.filter(isEventHappeningToday);
};

const fetchVisitors = async () => {
    const { totalLength } = await getVisitors();
    totalVisitors.value = totalLength;
};

onMounted(async () => {
    await fetchVisitors();
    hideSidebarOnSmallScreen();
});
</script>

<style scoped>
.col {
    padding: 3rem;
}

h4 {
    text-align: left;
}

span {
    font-weight: 400;
}

.icon-circle {
    width: 5rem;
    height: 5rem;
    border-radius: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.cards {
    padding-left: 1rem;
}

.cards span {
    font-size: large;
    font-weight: 400;
}

.cards h2 {
    font-size: xx-large;
    margin: 0;
}

.icons {
    width: 4rem !important;
    height: 3rem !important;
}

#visitIcon {
    color: #ff7900;
}

#eventIcon {
    color: #1971c2;
}

#visitorIcon {
    color: #fc0;
}

.m-3 {
    display: flex;
    height: 300px;
    align-items: center;
    flex-direction: column;
    /* background-color: aquamarine; */
    padding: 0.5rem;
    justify-content: space-between;
}

.m-3 button {
    width: 250px;
    padding: 0.5rem;
}

.offcanvas {
    position: fixed;
    z-index: 9999;
}

@media (max-width: 1250px) {
    #dashboardFirstChild {
        margin: 0.6rem !important;
    }
}
</style>
