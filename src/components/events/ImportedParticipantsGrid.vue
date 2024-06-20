<template>
    <div id="importedParticipantsGridWrapper">
        <div class="d-flex gap-3 mt-2">
            <input
                type="search"
                class="input-group-text w-75 text-start"
                placeholder="Search..."
                v-model="query"
                @input="search"
            />
            <select class="form-select w-25" v-model="type">
                <option value="first_name">First Name</option>
                <option value="middle_name">Middle Name</option>
                <option value="last_name">Last Name</option>
                <option value="email">Email</option>
                <option value="address">Address</option>
                <option value="msisdn">Contact</option>
            </select>
        </div>
        <div id="importedParticipantsGridContainer">
            <div
                class="p-3 boxShadow"
                v-if="
                    Array.isArray(participantsToDisplay) &&
                    !!participantsToDisplay.length
                "
                v-for="participant in participantsToDisplay"
            >
                <div class="d-flex flex-column gap-2 float-end">
                    <Edit @click="emit('edit', participant.msisdn)" />
                    <Delete @click="emit('delete', participant.msisdn)" />
                </div>
                <h5>{{ participant.first_name }}</h5>
                <h5>{{ participant.middle_name }}</h5>
                <h5>{{ participant.last_name }}</h5>
                <h5>{{ participant.address }}</h5>
                <h5>{{ participant.email }}</h5>
                <h5>+{{ participant.msisdn }}</h5>
            </div>
            <h3 v-else>No match found!</h3>
        </div>
    </div>
</template>

<script setup>
import Edit from "../Edit.vue";
import Delete from "../Delete.vue";

import { computed, ref } from "vue";

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
    return props.participants;
});

const emit = defineEmits(["edit", "delete"]);

function search() {
    // query the original participants array for matching values
    queryResults.value = props.participants.filter((participant) =>
        participant[type.value]
            .toLowerCase()
            .includes(query.value.toLowerCase())
    );

    if (queryResults.value.length) participantsToDisplay = "No match found!";
}
</script>

<style scoped>
#importedParticipantsGridWrapper {
	min-width: 75%;
}

#importedParticipantsGridContainer {
	display: grid;
	grid-template-columns: repeat(3, 31%);
	justify-content: center;
	gap: 30px;
	overflow-y: scroll;
	max-height: 68vh;
	min-width: 73%;
	padding: 10px 5px;
	margin-top: 15px;
}

.boxShadow {
	box-shadow: -1.5px -1.5px 5px 3px #ddd;
}

.boxShadow:hover {
	box-shadow: -1.5px -1.5px 5px 8px #ccc;
}
</style>
