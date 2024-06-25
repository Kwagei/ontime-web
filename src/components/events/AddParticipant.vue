<template>
    <div class="w-75 d-flex flex-column align-items-center">
        <div class="d-flex justify-content-between align-items-center p-3 w-75">
            <div class="d-flex align-items-center gap-4">
                <BackArrow @click="emit('switch', 'details')" />
                <h3 class="m-0">Add Participant</h3>
            </div>
            <div>
                <button
                    class="btn btn-primary px-5 py-2"
                    @click="postParticipant"
                >
                    Submit
                </button>
            </div>
        </div>
        <form
            @submit.prevent="postParticipant"
            @input="validateParticipant"
            class="w-75 container gap-5 p-4"
            style="
                background-color: #fff;
                border-radius: 10px;
                outline: 1px solid #aaa;
            "
        >
            <div class="row mb-3">
                <div class="col">
                    <label class="p-2 is-required" for="firstName">
                        First Name:
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <input
                        type="text"
                        class="form-control"
                        placeholder="John"
                        id="firstName"
                        v-model="newParticipant.firstName"
                        :class="{
                            'border border-danger': participantError.firstName,
                        }"
                    />
                    <Alert
                        v-if="participantError.firstName"
                        :title="participantError.firstName"
                    />
                </div>
                <div class="col">
                    <label class="p-2" for="middle_name">Middle Name:</label>
                    <input
                        type="middle_name"
                        placeholder="Peter"
                        class="form-control"
                        id="middle_name"
                        v-model="newParticipant.middleName"
                        :class="{
                            'border border-danger': participantError.middleName,
                        }"
                    />
                    <Alert
                        v-if="participantError.middleName"
                        :title="participantError.middleName"
                    />
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <label class="p-2 is-required" for="lastName">
                        Last Name:
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Browne"
                        class="form-control"
                        id="lastName"
                        v-model="newParticipant.lastName"
                        :class="{
                            'border border-danger': participantError.lastName,
                        }"
                    />
                    <Alert
                        v-if="participantError.lastName"
                        :title="participantError.lastName"
                    />
                </div>
                <div class="col">
                    <label class="p-2 is-required" for="email">
                        Email:
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <input
                        type="email"
                        placeholder="johnbrowne@example.com"
                        class="form-control"
                        id="email"
                        v-model="newParticipant.email"
                        :class="{
                            'border border-danger': participantError.email,
                        }"
                    />
                    <Alert
                        v-if="participantError.email"
                        :title="participantError.email"
                    />
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <label class="p-2 is-required" for="address">
                        Address:
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <input
                        type="text"
                        placeholder="14th Street, Sinkor, Monrovia, Liberia"
                        class="form-control"
                        id="address"
                        v-model="newParticipant.address"
                        :class="{
                            'border border-danger': participantError.address,
                        }"
                    />
                    <Alert
                        v-if="participantError.address"
                        :title="participantError.address"
                    />
                </div>
                <div class="col">
                    <label class="p-2 is-required" for="msisdn">
                        Contact:
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <input
                        type="tel"
                        placeholder="0770894295"
                        class="form-control"
                        id="msisdn"
                        v-model="newParticipant.msisdn"
                        :class="{
                            'border border-danger': participantError.msisdn,
                        }"
                    />
                    <Alert
                        v-if="participantError.msisdn"
                        :title="participantError.msisdn"
                    />
                </div>
            </div>
            <!-- Will not show, just added so the for could submit by pressing enter -->
            <button class="visually-hidden" type="submit">Submit</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import $ from "jquery";

import { API_URL } from "../../assets/js/index.js";
import Alert from "../Alert.vue";
import BackArrow from "../BackArrow.vue";

const router = useRoute();
const eventId = router.params.id;

const emptyParticipant = {
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    email: "",
    msisdn: "",
};

const emit = defineEmits(["errorCreatingParticipant", "participantAdded"]);

const newParticipant = ref({ ...emptyParticipant });
const participantError = ref({ ...emptyParticipant });

async function postParticipant() {
    if (validateParticipant()) {
        const data = {
            event_id: router.params.id,
            event_participants: formatEventParticipants(),
        };

        $("body").css("pointer-events", "none");

        $("body").css("pointer-events", "none");

        $("body").css("pointer-events", "none");

        try {
            await $.post(API_URL + "event_participants/", data, () => {
                emit("participantAdded", {
                    status: "success",
                    title: "Participant Added",
                    pageLink: `/events/${eventId}`,
                });
                newParticipant.value = { ...emptyParticipant };
                $("body").css("pointer-events", "auto");
            });
        } catch (error) {
            console.log("Error creating participant: ", error);

            emit("errorCreatingParticipant", {
                status: "danger",
                title:
                    error.responseJSON.status == 500
                        ? "Error Creating Participant, try again"
                        : error.responseJSON.message,
            });
            $("body").css("pointer-events", "auto");
        }
    }
}

function validateParticipant() {
    participantError.value = { ...emptyParticipant };

    // ensure `first_name` was given
    if (
        !newParticipant.value.firstName ||
        newParticipant.value.firstName.length <= 1
    ) {
        participantError.value.firstName =
            "Participant's `first_name` is invalid";
        return false;
    }

    // if middle_name was given
    // ensure it's atleast two characters
    if (
        newParticipant.value.middleName &&
        newParticipant.value.middleName.length <= 1
    ) {
        participantError.value.middleName =
            "Participant's `middle_name` is invalid";
        return false;
    }

    // ensure `last_name` was given
    if (
        !newParticipant.value.lastName ||
        newParticipant.value.lastName.length <= 1
    ) {
        participantError.value.lastName =
            "Participant's `last_name` is invalid";
        return false;
    }

    // ensure `email` was given
    if (!newParticipant.value.email) {
        participantError.value.email = "Participant's `email` is required";
        return false;
    }

    // ensure `email` is atleast six chars
    if (newParticipant.value.email.length <= 5) {
        participantError.value.email = "Participant's `email` is invalid";
        return false;
    }

    // ensure address was given
    if (!newParticipant.value.address) {
        participantError.value.address = "Participant's `address` is required";
        return false;
    }

    // ensure address is atleast 12 chars with two spaces
    if (
        newParticipant.value.address.length <= 11 ||
        newParticipant.value.address.split(" ").length <= 1
    ) {
        participantError.value.address = "Participant's address is invalid";
        return false;
    }

    // ensure msisdn was given
    if (!newParticipant.value.msisdn) {
        participantError.value.msisdn = "Participant's `msisdn` is required";
        return false;
    }

    // ensure msisdn is atleast 10 chars long and it's a number
    if (
        newParticipant.value.msisdn.length < 10 ||
        !Number(newParticipant.value.msisdn)
    ) {
        participantError.value.msisdn = "Participant's `msisdn` is invalid";
        return false;
    }

    return true;
}

function formatEventParticipants() {
    return [
        {
            first_name: newParticipant.value.firstName,
            middle_name: newParticipant.value.middleName,
            last_name: newParticipant.value.lastName,
            email: newParticipant.value.email,
            address: newParticipant.value.address,
            msisdn: "231" + newParticipant.value.msisdn.slice(1),
        },
    ];
}
</script>

<style scoped>
/* code... */
</style>
