<template>
	<EditParticipantForm
		:data="participantToEdit"
		@updated="onParticipantUpdate"
		v-model:participantIndex="participantIndex"
	/>

	<div>
		<div
			class="d-flex justify-content-between align-items-center gap-5 mt-3"
		>
			<div class="d-flex align-items-center gap-4">
				<BackArrow
					v-show="!participants.length"
					@click="$emit('switch', 'details')"
				/>
				<BreadCrumbs
					:breadCrumbs="['events', eventId, 'Import Participants']"
				/>
			</div>
			<div>
				<a
					class="link-underline link-underline-opacity-0"
					href="/docs/participants_template.csv"
					download="participants_template.csv"
				>
					<button class="btn btn-primary">
						Download CSV Template
					</button>
				</a>
			</div>
		</div>
		<div class="d-flex justify-content-center gap-3 mt-2">
			<div class="pt-2">
				<h2 class="pb-2 text">Import Participants</h2>
				<div>
					<label
						for="formFile"
						class="form-label d-flex justify-content"
					>
						Upload Participants CSV File
					</label>
					<input
						class="form-control"
						id="formFile"
						type="file"
						ref="participantsFile"
						@change="handleFileImport"
					/>
					<Alert
						v-if="errorAlertMessage"
						:title="errorAlertMessage"
						class="mb-1"
					/>
				</div>
				<form
					class="d-flex gap-2 pt-2 text-center justify-content-start"
					v-if="participants.length"
					@submit.prevent="postParticipants"
				>
					<button class="btn btn-primary" type="submit">
						Upload
					</button>
					<button
						@click="$emit('switch', 'details')"
						class="btn btn-outline-secondary"
					>
						Cancel
					</button>
				</form>
			</div>
			<ImportedParticipantsGrid
				v-if="participants.length"
				:participants="participants"
				@edit="editParticipant"
				@delete="deleteParticipant"
			/>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { parse } from "papaparse"; // Import Papa Parse for CSV parsing
import $ from "jquery";
import { useRoute } from "vue-router";

import { API_URL, registerEventParticipants } from "../../assets/js/index.js";
import ImportedParticipantsGrid from "./ImportedParticipantsGrid.vue";
import EditParticipantForm from "./EditParticipantForm.vue";
import Alert from "../Alert.vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import BackArrow from "../BackArrow.vue";
import { showModal } from "@/util/util.js";

const route = useRoute();
const eventId = route.params.id;

const props = defineProps({
	eventId: {
		type: String,
		required: true,
	},
	eventTitle: {
		type: String,
		required: true,
	},
});

const emit = defineEmits([
	"participantsImported",
	"errorImportingParticipants",
	"switch",
]);

const participants = ref([]);
const participantsFile = ref(null);
const errorAlertMessage = ref("");
const participantToEdit = ref({});
const participantIndex = defineModel("participantIndex");

function handleFileImport(event) {
	const file = event.target.files[0];
	if (file && file.type === "text/csv") {
		const reader = new FileReader();
		reader.onload = (e) => {
			const csvData = e.target.result;
			parse(csvData, {
				header: true,
				skipEmptyLines: true,
				complete: (results) => {
					results.data = removeEmptyRows(results.data);

					// validate csv file table columns
					if (!validateParticipantsCsvFile(results)) return false;

					participants.value = [];
					participants.value.push(...results.data);

					// Clear file input after import
					participantsFile.value.value = "";
				},
			});
		};

		reader.readAsText(file);
	} else errorAlertMessage.value = "CSV File only";
}

async function onParticipantUpdate(updatedParticipant) {
	participants.value[participantToEdit.value.idx] = updatedParticipant;

	// only repost the participants if there was an error
	if (participantToEdit.value.errorMessage) {
		await postParticipants();
		return;
	}

	// empty the value if it there wasn't any error
	participantToEdit.value = {};
}

async function postParticipants() {
	const { ok, result } = await registerEventParticipants({
		event_id: props.eventId,
		event_participants: participants.value,
	});

	if (ok) {
		emit("participantsImported", {
			status: "success",
			message: "Participants Successfully Imported",
			pageLink: `/events/${eventId}`,
		});
	} else {
		if (result.status === 500) {
			emit("errorImportingParticipants", {
				status: "danger",
				message: "Unable to Import Participants, try again",
			});
			return;
		}

		showModal("#editParticipantModal", "#editParticipantModalBody");

		participantToEdit.value = {
			errorMessage: result.message,
			participant: result.data.participant,
			idx: result.data.index,
			status: result.status,
		};
	}
}

function removeEmptyRows(data) {
	// only keep rows that have either of the values
	// don't add it if it has none
	return data.filter(
		(participant) =>
			participant.first_name ||
			participant.middle_name ||
			participant.last_name ||
			participant.msisdn ||
			participant.address ||
			participant.email
	);
}

function validateParticipantsCsvFile(result) {
	const fields = result.meta.fields;

	if (result.errors.length) return true;

	// ensure first_name column exists
	if (!fields.includes("first_name")) {
		errorAlertMessage.value = "`first_name` column required but not found";
		return false;
	}

	// ensure last_name column exists
	if (!fields.includes("last_name")) {
		errorAlertMessage.value = "`last_name` column required but not found";
		return false;
	}

	// ensure email column exists
	if (!fields.includes("email")) {
		errorAlertMessage.value = "`email` column required but not found";
		return false;
	}

	// ensure address column exists
	if (!fields.includes("address")) {
		errorAlertMessage.value = "`address` column required but not found";
		return false;
	}

	// ensure msisdn column exists
	if (!fields.includes("msisdn")) {
		errorAlertMessage.value = "`msisdn` column required but not found";
		return false;
	}

	// clear errorMessage
	errorAlertMessage.value = "";

	return true;
}

function editParticipant(msisdn) {
	const idxToEdit = participants.value.findIndex(
		(participant) => participant.msisdn === msisdn
	);

	participantIndex.value = idxToEdit + 1;
	showModal("#editParticipantModal", "#editParticipantModalBody");

	// set a participant to edit
	participantToEdit.value = {
		participant: participants.value[idxToEdit],
		idx: idxToEdit,
		errorMessage: "",
	};
}

function deleteParticipant(msisdn) {
	const idxToDelete = participants.value.findIndex(
		(participant) => participant.msisdn === msisdn
	);

	participants.value.splice(idxToDelete, 1);
}
</script>

<style scoped>
/* code */
</style>
