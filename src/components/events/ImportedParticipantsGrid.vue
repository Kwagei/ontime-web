<template>
    <div id="importedParticipantsGridContainer">
        <div class="p-3 boxShadow" v-for="(participant, index) in participants">
            <div class="float-end">
                <button :data-participantIdx="index" class="btn btn-secondary">
                    Edit
                </button>
            </div>
            <h5>{{ participant.first_name }}</h5>
            <h5>{{ participant.last_name }}</h5>
            <h5>{{ participant.address }}</h5>
            <h5>{{ participant.email }}</h5>
            <h5>+{{ participant.msisdn }}</h5>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    participants: {
        type: Array,
        required: true,
    },
});
</script>

<style scoped>
#importedParticipantsGridContainer {
    display: grid;
    grid-template-columns: repeat(3, 31%);
    justify-content: center;
    gap: 30px;
    overflow-y: scroll;
    max-height: 70vh;
    width: 80%;
    padding: 10px 0;
    margin-top: 15px;
}

.boxShadow {
    box-shadow: -1.5px -1.5px 5px 3px #ddd;
}

.boxShadow:hover {
    box-shadow: -1.5px -1.5px 5px 8px #ddd;
}
</style>
