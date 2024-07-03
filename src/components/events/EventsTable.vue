<template>
    <div class="mb-3 d-flex justify-content-center">
        <table
            v-if="Array.isArray(allEvents)"
            class="table table-hover mb-0 table-responsive"
        >
            <thead class="tableHead">
                <tr>
                    <!-- Select All Check Box -->
                    <th
                        class="d-flex align-items-center"
                        style="height: 65px"
                        scope="col"
                    >
                        <input type="checkbox" class="form-check-input" />
                    </th>
                    <!-- Title -->
                    <th @click="term = 'title'" scope="col">
                        <div
                            class="d-flex justify-content-between align-items-center"
                        >
                            <div>Title</div>
                            <div>
                                <AscIcon @click="direction = 'asc'" />
                                <DescIcon @click="direction = 'desc'" />
                            </div>
                        </div>
                    </th>
                    <!-- Host -->
                    <th @click="term = 'host'" scope="col">
                        <div
                            class="d-flex justify-content-between align-items-center"
                        >
                            <div>Host</div>
                            <div>
                                <AscIcon @click="direction = 'asc'" />
                                <DescIcon @click="direction = 'desc'" />
                            </div>
                        </div>
                    </th>
                    <!-- Start Date -->
                    <th @click="term = 'start_date'" scope="col">
                        <div
                            class="d-flex justify-content-between align-items-center"
                        >
                            <div>Start Date</div>
                            <div>
                                <AscIcon @click="direction = 'asc'" />
                                <DescIcon @click="direction = 'desc'" />
                            </div>
                        </div>
                    </th>
                    <!-- End Date -->
                    <th @click="term = 'end_date'" scope="col">
                        <div
                            class="d-flex justify-content-between align-items-center"
                        >
                            <div>End Date</div>
                            <div>
                                <AscIcon @click="direction = 'asc'" />
                                <DescIcon @click="direction = 'desc'" />
                            </div>
                        </div>
                    </th>
                    <!-- Facilitator -->
                    <th @click="term = 'facilitator'" scope="col">
                        <div
                            class="d-flex justify-content-between align-items-center"
                        >
                            <div>Facilitator</div>
                            <div>
                                <AscIcon @click="direction = 'asc'" />
                                <DescIcon @click="direction = 'desc'" />
                            </div>
                        </div>
                    </th>
                    <!-- Type -->
                    <th @click="term = 'type'" scope="col">
                        <div
                            class="d-flex justify-content-between align-items-center"
                        >
                            <div>Type</div>
                            <div>
                                <AscIcon @click="direction = 'asc'" />
                                <DescIcon @click="direction = 'desc'" />
                            </div>
                        </div>
                    </th>
                    <!-- Created At -->
                    <th @click="term = 'created_at'" scope="col">
                        <div
                            class="d-flex justify-content-between align-items-center"
                        >
                            <div>Created At</div>
                            <div>
                                <AscIcon @click="direction = 'asc'" />
                                <DescIcon @click="direction = 'desc'" />
                            </div>
                        </div>
                    </th>
                    <!-- Details -->
                    <th @click="term = 'details'" scope="col">
                        <div
                            class="d-flex justify-content-between align-items-center"
                        >
                            <div>Details</div>
                            <div>
                                <AscIcon @click="direction = 'asc'" />
                                <DescIcon @click="direction = 'desc'" />
                            </div>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <!-- All Events Rows -->
                <tr
                    v-if="
                        eventsToShow.length &&
                        Array.isArray(allEvents) &&
                        allEvents.length
                    "
                    v-for="event in eventsToShow"
                    @click="displayEventPage(event.id)"
                    class="tableRow"
                >
                    <td>
                        <input
                            class="form-check-input"
                            type="checkbox"
                            name="{{ event.id }}"
                            @click.stop
                        />
                    </td>
                    <td>{{ event.title }}</td>
                    <td>{{ event.host }}</td>
                    <td style="min-width: 140px">
                        {{ formatDate(event.start_date) }}
                    </td>
                    <td style="min-width: 140px">
                        {{ formatDate(event.end_date) }}
                    </td>
                    <td>{{ event.facilitator }}</td>
                    <td>{{ event.type }}</td>
                    <td style="min-width: 140px">
                        {{ formatDate(event.created_at) }}
                    </td>
                    <td>{{ formatDetails(event.details) }}</td>
                </tr>
                <!-- No Events Add Event Table Row -->
                <tr v-else>
                    <td class="text-center" colspan="9">
                        <div
                            class="m-2 d-flex flex-column w-25 mx-auto align-items-center"
                        >
                            <svg
                                style="width: 125px; height: 125px"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1000"
                                height="1000"
                                fill="currentColor"
                                class="solaris-icon si-calendar-event-agenda"
                                viewBox="0 0 1000 1000"
                            >
                                <path
                                    d="M800 175H700v-38c0-20.71-16.789-37-37.5-37a37.5 37.5 0 0 0-37.5 37.5V175H350.011L350 137.5a37.5 37.5 0 0 0-75 0V175H100v625a75 75 0 0 0 75 75h700V250a75 75 0 0 0-75-75m25 650H187.5a37.5 37.5 0 0 1-37.5-37.5V400h637.5a37.5 37.5 0 0 1 37.5 37.5zM250 262.5a62.4 62.4 0 0 1 25-50v50a37.5 37.5 0 0 0 75 0V250h.011v-37.493A62.5 62.5 0 1 1 250 262.5m350 0a62.4 62.4 0 0 1 25-50v50a37.5 37.5 0 0 0 75 0l-.011-12.5H700v-37a61.47 61.47 0 0 1 25 49.5 62.5 62.5 0 0 1-125 0M237.5 450a37.5 37.5 0 1 0 37.5 37.5 37.5 37.5 0 0 0-37.5-37.5M725 462H350c-13.807 0-25 11.693-25 25.5s11.193 24.5 25 24.5h375c13.807 0 25-10.693 25-24.5S738.807 462 725 462M237.5 575a37.5 37.5 0 1 0 37.5 37.5 37.5 37.5 0 0 0-37.5-37.5M725 587H350c-13.807 0-25 11.693-25 25.5s11.193 24.5 25 24.5h375c13.807 0 25-10.693 25-24.5S738.807 587 725 587M237.5 700a37.5 37.5 0 1 0 37.5 37.5 37.5 37.5 0 0 0-37.5-37.5M725 712H350c-13.807 0-25 11.693-25 25.5s11.193 24.5 25 24.5h375c13.807 0 25-10.693 25-24.5S738.807 712 725 712"
                                    style="fill-rule: evenodd"
                                />
                            </svg>

                            <h4 class="my-4">No event to show</h4>

                            <button
                                class="btn btn-secondary w-100"
                                @click="router.push('/events/add-event')"
                            >
                                Create Event
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div
            class="d-flex justify-content-center"
            style="margin: 75px 0"
            v-else-if="allEvents == 'loading'"
        >
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <h2 class="w-75 text-center" v-else-if="allEvents == 'noMatch'">
            <hr />
            No match!
        </h2>
        <h2 class="w-75 text-center" v-else>
            <hr />
            Error Loading Events, Try again!
        </h2>
    </div>
    <Pagination
        v-if="Array.isArray(allEvents) && !!allEvents.length"
        v-model="paginationStart"
    />
</template>

<script setup>
import Pagination from "../Pagination.vue";
import AscIcon from "../AscIcon.vue";
import DescIcon from "../DescIcon.vue";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { formatDate, API_URL } from "../../assets/js/index.js";
import $ from "jquery";

const paginationStart = ref(0);
const allEvents = ref("loading");
const eventsToShow = ref([]);
const MAX_EVENTS_TO_SHOW = ref(10);
const router = useRouter();
const MAX_DETAIL_LEN = 10;

const term = ref("created_at");
const direction = ref("ASC");

const props = defineProps({
    searchQuery: String,
    refresh: Boolean,
});

const emit = defineEmits(["refreshComplete"]);

onMounted(async () => {
    await getEvents(props.searchQuery, 0, 20, term.value, direction.value);
});

// Watch Pagination Switches
watch(paginationStart, (newValue) => {
    eventsToShow.value = allEvents.value.slice(
        newValue,
        MAX_EVENTS_TO_SHOW.value + newValue
    );

    // get more events if we're on the last page of the
    // pagination and we still have events to fetch
    if (allEvents.value.length - newValue == 10) moreEvents();
});

// Watch Input into the Events Search Input
watch(
    () => props.searchQuery,
    async (newValue) => {
        if (!props.searchQuery) await getEvents();

        // pass search query to events retrieval function
        await getEvents(newValue, 0, 30);
    }
);

// Watch Refresh Prop to refresh events accordingly
watch(
    () => props.refresh,
    async () => {
        if (props.refresh) {
            await getEvents(props.searchQuery);
            emit("refreshComplete");
        }
    }
);

// Watch for Changes in the Sort and Direction
watch(
    () => [term.value, direction.value],
    async ([newTerm, newDirection]) =>
        await getEvents(props.searchQuery, 0, 30, newTerm, newDirection)
);

async function getEvents(
    search = "",
    start = 0,
    limit = 20,
    sortTerm = term.value,
    sortDirection = direction.value,
    from = "",
    to = ""
) {
    allEvents.value = "loading";

    // Get Events from API
    try {
        let url =
            API_URL +
            `events?start=${start}&limit=${limit}&sort=${sortTerm}&direction=${sortDirection}`;

        if (search) url += `&search=${search}`;
        if (from) url += `&from=${from}`;
        if (to) url += `&to=${to}`;

        await $.get(url, (data) => {
            // display no match if there was no result from the search
            if (search && !data.data.length) {
                allEvents.value = "noMatch";
            } else {
                allEvents.value = data.data;
                eventsToShow.value = allEvents.value.slice(0, 10);
            }
        });
    } catch (error) {
        // do nothing
        allEvents.value = "error";
    }
}

function formatDetails(detail) {
    const detailLen = detail.split(" ").length;
    const newDetail =
        detailLen >= MAX_DETAIL_LEN
            ? `${detail.split(" ").slice(0, MAX_DETAIL_LEN).join(" ")}...`
            : detail;

    return newDetail;
}

function displayEventPage(eventId) {
    router.push({ name: "specific-event", params: { id: eventId } });
}

async function moreEvents(
    search = props.searchQuery,
    start = allEvents.value.length,
    limit = 20,
    sortTerm = term.value,
    direction = direction.value,
    from = "",
    to = ""
) {
    try {
        let url =
            API_URL +
            `events?start=${start}&limit=${limit}&sort=${sortTerm}&direction=${direction}`;

        if (search) url += `&search=${search}`;
        if (from) url += `&from=${from}`;
        if (to) url += `&to=${to}`;

        await $.get(url, (data) => {
            console.log("More Events: ", data);
            allEvents.value.push(...data.data);
        });
    } catch (error) {
        // do nothing
    }
}
</script>

<style scoped>
.tableRow,
.tableHead {
    cursor: pointer;
}

.tableHead tr th:hover {
    background-color: #eee !important;
}

th,
td {
    padding: 0.9rem;
    font-size: 0.9rem;
}
</style>
