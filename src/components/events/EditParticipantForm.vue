<template>
    <div id="editParticipantFormWrapper" class="p-3">
        <h3
            v-if="
                data.status &&
                (data.status.toString().startsWith('40') ||
                    data.status.toString().startsWith('50'))
            "
            class="text-danger text-center"
        >
            {{ data.errorMessage }}
            <hr />
        </h3>
        <div class="row mb-2">
            <div class="col">
                <label class="p-2" for="firstName">First Name:</label>
                <input
                    type="text"
                    class="form-control"
                    id="firstName"
                    :value="data.participant.first_name"
                    :class="{
                        'border border-danger': firstNameError,
                    }"
                />
                <Alert v-if="firstNameError" :title="data.errorMessage" />
            </div>
            <div class="col">
                <label class="p-2" for="middleName">Middle Name:</label>
                <input
                    type="middle_name"
                    class="form-control"
                    id="middleName"
                    :value="data.participant.middle_name || ''"
                    :class="{
                        'border border-danger': middleNameError,
                    }"
                />
                <Alert v-if="middleNameError" :title="data.errorMessage" />
            </div>
        </div>
        <div class="row mb-2">
            <div class="col">
                <label class="p-2" for="lastName">Last Name:</label>
                <input
                    type="text"
                    class="form-control"
                    id="lastName"
                    :value="data.participant.last_name"
                    :class="{
                        'border border-danger': lastNameError,
                    }"
                />
                <Alert v-if="lastNameError" :title="data.errorMessage" />
            </div>
            <div class="col">
                <label class="p-2" for="email">Email:</label>
                <input
                    type="email"
                    class="form-control"
                    id="email"
                    :value="data.participant.email"
                    :class="{
                        'border border-danger': emailError,
                    }"
                />
                <Alert v-if="emailError" :title="data.errorMessage" />
            </div>
        </div>
        <div class="row mb-2">
            <div class="col">
                <label class="p-2" for="address">Address:</label>
                <input
                    type="text"
                    class="form-control"
                    id="address"
                    :value="data.participant.address"
                    :class="{
                        'border border-danger': addressError,
                    }"
                />
                <Alert v-if="addressError" :title="data.errorMessage" />
            </div>
            <div class="col">
                <label class="p-2" for="msisdn">Phone Number:</label>
                <input
                    type="tel"
                    class="form-control"
                    id="msisdn"
                    :value="data.participant.msisdn"
                    :class="{
                        'border border-danger': msisdnError,
                    }"
                />
                <Alert v-if="msisdnError" :title="data.errorMessage" />
            </div>
        </div>
        <div class="d-flex justify-content-between gap-3 pt-2">
            <button class="btn btn-primary w-50" @click="update">Update</button>
            <button class="btn btn-primary w-50" @click="closeForm">
                Cancel
            </button>
        </div>
    </div>
</template>

<script setup>
import Alert from "../Alert.vue";

import { ref, onMounted } from "vue";
import $ from "jquery";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["updated", "cancel"]);

const updatedParticipant = {
    first_name: "",
    middle_name: "",
    last_name: "",
    address: "",
    email: "",
    msisdn: "",
};

const firstNameError = ref(props.data.errorMessage.includes("first_name"));
const middleNameError = ref(props.data.errorMessage.includes("middle_name"));
const lastNameError = ref(props.data.errorMessage.includes("last_name"));
const emailError = ref(props.data.errorMessage.includes("email"));
const msisdnError = ref(props.data.errorMessage.includes("hone number"));
const addressError = ref(props.data.errorMessage.includes("address"));

onMounted(() => {
    $("body").css("pointerEvents", "none");
});

function update() {
    updatedParticipant.first_name = $("#firstName").val();
    updatedParticipant.middle_name = $("#middleName").val();
    updatedParticipant.last_name = $("#lastName").val();
    updatedParticipant.address = $("#address").val();
    updatedParticipant.msisdn = $("#msisdn").val();
    updatedParticipant.email = $("#email").val();

    $("body").css("pointerEvents", "auto");
    emit("updated", updatedParticipant);
}

function closeForm() {
    $("body").css("pointerEvents", "auto");
    emit("cancel");
}
</script>

<style scoped>
#editParticipantFormWrapper {
    pointer-events: auto;
    position: absolute;
    z-index: 99999;
    top: 10vh;
    left: 25vw;
    width: 50vw;
    height: auto;
    background-color: #eee;
    box-shadow: -1.5px -1.5px 10px 1px #999;
}
</style>
