<template>
    <div class="d-flex align-items-center flex-column w-100">
        <div class="container">
            <div class="w-100 d-flex justify-content-between gap-4 pt-3">
                <BreadCrumbs :breadCrumbs="['events', event.title]" />
                <div
                    class="d-flex mb-3"
                    style="gap: 0.521rem; margin-left: auto"
                >
                    <RefreshList @click="refresh = true" />

                    <div class="dropdown">
                        <Options />
                        <ul class="dropdown-menu boxShadow rounded">
                            <li
                                id="edit-event"
                                class="dropdown-item"
                                @click="$emit('editEvent')"
                            >
                                Edit Event
                            </li>
                            <li
                                id="export-participants"
                                class="dropdown-item"
                                @click="displayExportModay"
                            >
                                Export Participants
                            </li>
                            <li
                                id="import-participants"
                                class="dropdown-item"
                                @click="emit('switch', 'importParticipants')"
                            >
                                Import Participants
                            </li>
                            <li
                                id="today-addendance"
                                class="dropdown-item"
                                @click="emit('switch', 'todaysAttendance')"
                            >
                                Attendance
                            </li>
                        </ul>
                    </div>

                    <button
                        class="btn btn-primary"
                        id="addParticipantBtn"
                        @click="emit('switch', 'addParticipant')"
                    >
                        <Icons v-model:icon="add" />
                        Participant
                    </button>
                </div>
            </div>
            <div
                id="eventInfoDiv"
                class="w-100 d-flex justify-content-between gap-4"
            >
                <div
                    id="eventInfo"
                    class="d-flex justify-content-between mt-3 gap-4 mx-auto"
                    style="width: 60%"
                >
                    <div class="d-flex flex-column align-items-start">
                        <span class="fs-6">Facilitator</span>
                        <h6>{{ event.facilitator }}</h6>
                        <span class="fs-6">Type</span>
                        <h6>{{ event.type }}</h6>
                        <span class="fs-6">Host</span>
                        <h6>{{ event.host }}</h6>
                        <span class="fs-6">Host Type</span>
                        <h6>{{ event.host_type }}</h6>
                    </div>
                    <div class="d-flex flex-column align-items-end">
                        <span class="fs-6">Start Date</span>
                        <h6>
                            {{
                                formatDateTime(event.start_date, { date: true })
                            }}
                        </h6>
                        <span class="fs-6">End Date</span>
                        <h6>
                            {{ formatDateTime(event.end_date, { date: true }) }}
                        </h6>
                        <span class="fs-6">Room</span>
                        <h6>{{ event.room }}</h6>
                        <span class="fs-6">Creation Date</span>
                        <h6>
                            {{
                                formatDateTime(event.created_at, { date: true })
                            }}
                        </h6>
                    </div>
                </div>
                <div class="border border-1"></div>
                <div
                    id="eventDetailsDiv"
                    class="pt-2 text-left flex-grow-1"
                    style="width: 40%"
                >
                    <span class="fs-6">Details</span>
                    <h6 class="mt-2 mb-0">{{ event.details }}</h6>
                </div>
            </div>
        </div>
        <EventParticipants v-model:refresh="refresh" />

        <ExportModal
            :exportFields="exportFields"
            v-model:exportTitle="exportTitle"
            @export="exportEventParticipants"
        />
    </div>
</template>

<script setup>
import BreadCrumbs from "../BreadCrumbs.vue";
import EventParticipants from "./EventParticipants.vue";
import Icons from "../Icons.vue";
import { formatDateTime, showModal } from "@/util/util.js";
import RefreshList from "../RefreshList.vue";
import { csvExport, getParticipants } from "@/assets/js";
import { ref } from "vue";
import Options from "../Options.vue";
import ExportModal from "../modals/ExportModal.vue";

const add = "add";
const refresh = defineModel("refresh");
const totalEventParticipants = defineModel("totalEventParticipants");

const exportFields = ref([
    { name: "First name", selected: false },
    { name: "Middle name", selected: false },
    { name: "Last name", selected: false },
    { name: "Phone number", selected: false },
    { name: "Email", selected: false },
    { name: "Address", selected: false },
]);
const exportTitle = defineModel("exportTitle");

exportTitle.value = "Participants";

const exportEventParticipants = async (fields) => {
    const { participants } = await getParticipants(props.event.id, {
        limit: totalEventParticipants.value,
    });

    const selectedParticipants = participants.map((participant) => {
        const data = {};
        for (const field of fields) {
            if (field === "phone_number") {
                data[field] = `0${participant.msisdn.slice(3)}`;
            } else {
                data[field] = participant[field];
            }
        }

        return data;
    });

    csvExport(selectedParticipants);
};

const props = defineProps({
    event: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["editEvent", "switch"]);

const displayExportModay = () => {
    showModal("#exportModal", "#modal-dialog");
};
</script>

<style scoped>
@media (max-width: 1000px) {
    #eventInfoDiv {
        flex-direction: column;
        gap: 0.5rem !important;
    }

    #eventInfo {
        width: 100% !important;
    }

    #eventDetailsDiv {
        margin-bottom: 20px;
        width: 100% !important;
    }
}

#eventInfoDiv {
    margin-left: auto !important;
    margin-right: auto !important;
}

svg {
    height: 20px !important;
    margin: 0 !important;
}

#addParticipantBtn {
    padding: 0.5rem;
}

li {
    font-size: 1rem;
    font-weight: 600;
    padding: 0.75rem 1rem;
}
</style>
