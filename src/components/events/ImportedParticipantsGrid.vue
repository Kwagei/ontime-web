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
				v-for="(participant, idx) in participantsToDisplay"
			>
				<div class="float-end">
					<button
						@click="emit('edit', idx)"
						class="btn btn-secondary"
					>
						Edit
					</button>
				</div>
				<h5>{{ participant.first_name }}</h5>
				<h5>{{ participant.middle_name }}</h5>
				<h5>{{ participant.last_name }}</h5>
				<h5>{{ participant.address }}</h5>
				<h5>{{ participant.email }}</h5>
				<h5>+{{ participant.msisdn }}</h5>
			</div>
		</div>
	</div>
</template>

<script setup>
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
	return queryResults.value.length ? queryResults.value : props.participants;
});

const emit = defineEmits(["edit"]);

function search() {
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
