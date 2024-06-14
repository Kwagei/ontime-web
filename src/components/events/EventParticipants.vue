<template>
    <EventTitle :title="currentEvent.title" />
    <div class="w-75 mt-3 mx-auto">
        <ImportedParticipantsGrid :participants="participants" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import $ from "jquery";
import { useRouter } from "vue-router";

import ImportedParticipantsGrid from "./ImportedParticipantsGrid.vue";
import EventTitle from "./EventTitle.vue";
import { API_URL } from "../../assets/js/index.js";

const router = useRouter();

const currentEvent = ref({});
const participants = ref([]);

const eventId = router.currentRoute.value.params.id;

onMounted(() => {
    getEvent();
    getParticipants();
});

async function getParticipants() {
    try {
        await $.get(API_URL + `events/${eventId}/participants`, (data) => {
            console.log("Retrieved Participants: ", data);
            participants.value = data.data;
        });
    } catch (error) {
        console.log(
            "Error retrieving event participants: ",
            error.responseJSON
        );
    }
}

async function getEvent() {
    try {
        await $.get(API_URL + `events/${eventId}/`, (data) => {
            console.log("Retrieved Event Data: ", data.data[0]);
            currentEvent.value = data.data[0];
        });
    } catch (error) {
        console.log("Error fetching event: ", error.responseJSON);
    }
}
</script>

<style scoped>
/* code... */
</style>
