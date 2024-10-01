<template>
    <div id="importedParticipantsGridWrapper">
        <div id="searchWrapper" class="d-flex gap-3 mt-2 overflow-x-scroll">
            <input
                style="margin-left: auto; min-width: 10rem"
                type="search"
                class="form-control form-control-lg w-50"
                placeholder="Search..."
                v-model="query"
                @input="search"
            />
            <select
                class="form-select"
                style="width: 23%; min-width: 5rem"
                v-model="type"
            >
                <option value="first_name">First Name</option>
                <option value="middle_name">Middle Name</option>
                <option value="last_name">Last Name</option>
                <option value="gender">Gender</option>
                <option value="email">Email</option>
                <option value="address">Address</option>
                <option value="msisdn">Contact</option>
                <option value="occupation">Occupation</option>
                <option value="session">Session</option>
            </select>
        </div>
        <div id="importedParticipantsGridContainer">
            <div
                class="participantGridItem p-3 boxShadow bg-white rounded"
                v-if="
                    Array.isArray(participantsToDisplay) &&
                    !!participantsToDisplay.length
                "
                v-for="(participant, index) in participantsToDisplay"
            >
                <div class="d-flex justify-content-between align-items-center">
                    <h5>Participant {{ index + 1 }}</h5>
                    <div class="d-flex justify-content-end gap-2 mb-3">
                        <Icons
                            @click="emit('edit', participant.msisdn)"
                            class="icons"
                            v-model:icon="editIcon"
                        />
                        <Icons
                            @click="emit('delete', participant.msisdn)"
                            class="icons"
                            v-model:icon="deleteIcon"
                        />
                    </div>
                </div>
                <div class="visitor-info">
                    <div>
                        <span style="font-weight: 600">
                            {{ participant.first_name }}
                            {{ participant?.middle_name }}
                            {{ participant.last_name }}
                        </span>
                    </div>
                    <div v-if="participant.address">
                        <span>
                            <Icons
                                style="width: 1.2rem"
                                v-model:icon="locationIcon"
                            />
                        </span>
                        <span style="font-weight: 400; font-size: small">
                            {{ participant.address }}
                        </span>
                    </div>
                    <div v-if="participant.email">
                        <span>
                            <Icons
                                style="width: 1.2rem"
                                v-model:icon="emailIcon"
                            />
                        </span>
                        <span
                            style="
                                font-weight: 400;
                                font-size: small;
                                margin-left: 0.3rem;
                            "
                        >
                            {{ participant.email }}
                        </span>
                    </div>

                    <div>
                        <span>
                            <Icons
                                style="width: 1.2rem"
                                v-model:icon="phoneIcon"
                            />
                        </span>
                        <span
                            style="
                                font-weight: 400;
                                font-size: small;
                                margin-left: 0.3rem;
                            "
                        >
                            {{ `0${participant.msisdn.slice(3)}` }}
                        </span>
                    </div>

                    <div>
                        <span>
                            <Icons
                                style="width: 1.2rem"
                                v-model:icon="genderIcon"
                            />
                        </span>
                        <span
                            style="
                                font-weight: 400;
                                font-size: small;
                                margin-left: 0.3rem;
                                text-transform: capitalize;
                            "
                        >
                            {{ participant.gender }}
                        </span>
                    </div>

                    <div v-if="participant.occupation">
                        <span>
                            <Icons
                                style="width: 1.2rem"
                                v-model:icon="occupationIcon"
                            />
                        </span>
                        <span
                            style="
                                font-weight: 400;
                                font-size: small;
                                margin-left: 0.3rem;
                                text-transform: capitalize;
                            "
                        >
                            {{ participant.occupation }}
                        </span>
                    </div>

                    <div>
                        <span>
                            <Icons
                                style="width: 1.2rem"
                                v-model:icon="sessionIcon"
                            />
                        </span>
                        <span
                            style="
                                font-weight: 400;
                                font-size: small;
                                margin-left: 0.3rem;
                                text-transform: capitalize;
                            "
                        >
                            {{ participant.session }}
                        </span>
                    </div>
                </div>
            </div>
            <h3 v-else>No match found!</h3>
        </div>
    </div>
</template>

<script setup>
const deleteIcon = "delete";
const editIcon = "pencil";
const locationIcon = "mahali";
const emailIcon = "email";
const genderIcon = "adult";
const phoneIcon = "device-smartphone";
const occupationIcon = "briefcase";
const sessionIcon = "clock";

import { computed, ref } from "vue";
import Icons from "../Icons.vue";

const props = defineProps({
    participants: {
        type: Array,
        required: true,
    },
});

const query = ref("");
const queryResults = ref([]);
const type = ref("first_name");

// display query results if any, otherwise, display the participants
const participantsToDisplay = computed(() => {
    if (queryResults.value.length) return queryResults.value;
    else if (query.value && !queryResults.value.length)
        return "No match found!";

    return sortParticipans(props.participants);
});

const sortParticipans = (participants) => {
    return participants.sort((a, b) => {
        if (a[type.value] < b[type.value]) return -1;
        if (a[type.value] > b[type.value]) return 1;
        return 0;
    });
};
const emit = defineEmits(["edit", "delete"]);

function search() {
    // handle gender search because male is included in female
    // so it has to be handled differently
    if (type.value == "gender") {
        queryResults.value = props.participants.filter((participant) =>
            participant[type.value]
                .toLowerCase()
                .startsWith(query.value.toLowerCase())
        );
        return;
    }

    // query the original participants array for matching values
    queryResults.value = props.participants.filter((participant) =>
        participant[type.value]
            .toLowerCase()
            .includes(query.value.toLowerCase())
    );
}
</script>

<style scoped>
#importedParticipantsGridWrapper {
    min-width: 70%;
}

#importedParticipantsGridContainer {
    display: flex;
    justify-content: flex-start;
    align-items: top;
    gap: 25px;
    flex-wrap: wrap;
    overflow-x: scroll;
    max-height: 70vh;
    min-width: 73%;
    padding: 10px;
    margin-top: 15px;
}

.visitor-info {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.participantGridItem {
    max-width: 300px;
    min-width: 300px;
    min-height: 280px;
}

.boxShadow {
    box-shadow: -1.5px -1.5px 5px 3px #ddd;
}

.boxShadow:hover {
    box-shadow: -1.5px -1.5px 5px 8px #ccc;
}

.icons {
    width: 20px !important;
    height: 20px !important;
    cursor: pointer;
    color: #444;
}

.icons:hover {
    border: 2px solid grey;
    border-radius: 0.3rem;
}
</style>
