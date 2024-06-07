<template>
    <div class="w-75 d-flex flex-column align-items-center">
        <div class="d-flex justify-content-between align-items-center p-3 w-75">
            <div class="pt-3">
                <h3>Add Participant</h3>
            </div>
            <div>
                <button
                    class="btn btn-primary px-5 py-2"
                    @click="addParticipant"
                >
                    Submit
                </button>
            </div>
        </div>
        <div class="w-75 container gap-5">
            <div class="row mb-3">
                <div class="col">
                    <label class="p-2" for="firstName">First Name:</label>
                    <input
                        type="text"
                        class="form-control"
                        placeholder="John"
                        id="firstName"
                        v-model="newParticipant.firstName"
                    />
                </div>
                <div class="col">
                    <label class="p-2" for="middle_name">Middle Name:</label>
                    <input
                        type="middle_name"
                        placeholder="Peter"
                        class="form-control"
                        id="middle_name"
                        v-model="newParticipant.middle_name"
                    />
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <label class="p-2" for="lastName">Last Name:</label>
                    <input
                        type="text"
                        placeholder="Browne"
                        class="form-control"
                        id="lastName"
                        v-model="newParticipant.lastName"
                    />
                </div>
                <div class="col">
                    <label class="p-2" for="email">Email:</label>
                    <input
                        type="email"
                        placeholder="johnbrowne@example.com"
                        class="form-control"
                        id="email"
                        v-model="newParticipant.email"
                    />
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <label class="p-2" for="address">Address:</label>
                    <input
                        type="text"
                        placeholder="14th Street, Sinkor, Monrovia, Liberia"
                        class="form-control"
                        id="address"
                        v-model="newParticipant.address"
                    />
                </div>
                <div class="col">
                    <label class="p-2" for="msisdn">Contact:</label>
                    <input
                        type="tel"
                        placeholder="0770894295"
                        class="form-control"
                        id="msisdn"
                        v-model="newParticipant.msisdn"
                    />
                </div>
            </div>
        </div>
        <div class="d-flex gap-3 pt-3 text-center justify-content-center">
            <button class="btn btn-primary" @click="$emit('switch', 'details')">
                View Details
            </button>
            <button
                class="btn btn-primary"
                @click="$emit('switch', 'importParticipants')"
            >
                Import Participants
            </button>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const participants = reactive([]);
const newParticipant = ref({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    msisdn: "",
    email: "",
});

const addParticipant = () => {
    if (validateParticipant(newParticipant.value)) {
        participants.push({
            ...newParticipant.value,
            id: Math.random().toString(36).substring(2, 15),
        });
        newParticipant.value = { firstName: "", lastName: "", email: "" };
    } else {
        // Handle validation errors (display message to user)
    }
};

const clearNewParticipant = () => {
    newParticipant.value = { firstName: "", lastName: "", email: "" };
};

const removeParticipant = (participant) => {
    const participantIndex = participants.findIndex(
        (p) => p.id === participant.id
    );
    if (participantIndex !== -1) {
        participants.splice(participantIndex, 1);
    }
};

const validateParticipant = (participant) => {
    // Implement validation logic for participant data (e.g., required fields, email format)
    return true; // Replace with actual validation logic
};
</script>

<style scoped>
/* code... */
</style>
