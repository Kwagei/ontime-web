<template>
    <Modal
        :data="{
            title: alert.title,
            message: alert.message,
            status: alert.status,
            pageLink: alert.pageLink,
        }"
    />
    <div class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
            style="margin: 2rem auto"
        >
            <BreadCrumbs
                class="mb-3"
                :breadCrumbs="['Events', eventId, 'AddParticipant']"
            />
        </div>

        <div class="form-control input" style="padding: 3rem">
            <form
                class="row g-3 needs-validation"
                novalidate
                @submit.prevent="postParticipant"
            >
                <!-- FIRST NAME -->
                <div class="col-md-6">
                    <label for="first_name" class="form-label is-required">
                        First name
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="first_name"
                            aria-describedby="inputGroupPrepend"
                            v-model="first_name"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide a first name.
                        </div>
                    </div>
                </div>

                <!-- PHONE NUMBER -->
                <div class="col-md-6">
                    <label for="phone_number" class="form-label is-required">
                        Phone number
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <div class="input-group has-validation">
                        <input
                            type="tel"
                            :class="[
                                validMsisdn && 'validated',
                                'form-control',
                            ]"
                            v-model="msisdn"
                            id="phone_number"
                            aria-describedby="inputGroupPrepend"
                            required
                            autocomplete="off"
                        />
                        <div
                            :class="[
                                'invalid-feedback',
                                validMsisdn && 'show-feedback',
                            ]"
                        >
                            {{ validMsisdnMessage }}
                        </div>
                    </div>
                    <div id="emailHelp" class="form-text">
                        Phone number should start with 0. For example:
                        0778675908
                    </div>
                </div>

                <!-- MIDDLE NAME -->
                <div class="col-md-6">
                    <label for="middle_name" class="form-label"
                        >Middle name</label
                    >
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

                <div class="col-md-12 d-flex gap-3">
                    <div
                        style="font-weight: 600; margin-left: auto"
                        class="d-flex gap-3"
                    >
                        <button type="submit" class="btn btn-primary px-5">
                            Save
                        </button>
                        <button
                            class="btn btn-secondary px-5"
                            @click="router.back()"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            <div class="d-flex gap-3">
                <button
                    class="btn btn-primary px-5 py-2"
					type="submit"
                >
                    Save
                </button>
                <button
                    @click="$emit('switch', 'details')"
                    class="btn btn-secondary px-5 py-2"
                >
                    Cancel
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import Modal from "../Modal.vue";

import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import $ from "jquery";

import { API_URL } from "../../assets/js/index.js";
import BreadCrumbs from "../BreadCrumbs.vue";
import Alert from "../Alert.vue";

const props = defineProps({
    breadCrumbs: Object,
});

// Route and State
const route = useRoute();
const first_name = ref("");
const middle_name = ref("");
const last_name = ref("");
const msisdn = ref("");
const email = ref("");
const address = ref("");

const alert = ref({
    status: "",
    title: "",
    message: "",
    pageLink: "",
});

const router = useRouter();

// Form status and breadcrumbs
const activeBreadCrumbs = ref([]);
const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);
activeBreadCrumbs.value = breadCrumbs.value;
const tmp = [...breadCrumbs.value];
const formStatus = tmp.pop();

const validEmail = ref(false);
const validMsisdn = ref(false);
const validMsisdnMessage = ref("Please provide a phone number");
const validEmailMessage = ref("Please provide a valid email address");

// Functions
async function postParticipant() {
    // return if any of the required fields were not given
    if (
        !first_name.value ||
        !last_name.value ||
        !msisdn.value ||
        !email.value ||
        !address.value
    )
        return;

    const participant = {
        first_name: first_name.value,
        middle_name: middle_name.value,
        last_name: last_name.value,

        // format Msisdn for backend
        msisdn: msisdn.value.startsWith("0")
            ? `231${msisdn.value.slice(1)}`
            : msisdn.value,

        email: email.value,
        address: address.value,
    };

    const body = {
        event_id: route.params.id,
        event_participants: [participant],
    };

    $.ajax({
        url: API_URL + "event_participants",
        type: "POST",
        data: body,
        success: (res) => {
            showModal("#alertModal", "#alertModalBody");

            alert.value.status = "success";
            alert.value.title = "Participant Added";
            alert.value.pageLink = `/events/${route.params.id}`;

            clearInputs();
        },
        error: (error) => {
            showModal("#alertModal", "#alertModalBody");
            alert.value.status = "danger";
            alert.value.title = error.responseJSON.message;
        },
    });
}

const fetchVisitor = async () => {
	if (formStatus.startsWith("edit")) {
		buttonLabel.value = "Update";
		const id = breadCrumbs.value[1];
		visitorInfo = await getSingleVisitor({ id });
		first_name.value = visitorInfo.first_name;
		middle_name.value = visitorInfo.middle_name;
		last_name.value = visitorInfo.last_name;
		msisdn.value = visitorInfo.msisdn;
		email.value = visitorInfo.email;
	}
};

const contactValidation = (number) => {
	if (!number) {
		validMsisdn.value = false;
		validMsisdnMessage.value = "Please provide a phone number";

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
            console.log("Unable to create participant: ", error);

            emit("errorCreatingParticipant", {
                status: "danger",
                title:
                    error.responseJSON.status == 500
                        ? "Unable to create participant, try again"
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

	if (!isValid.valid) {
		validEmail.value = true;
		validEmailMessage.value = isValid.message;
	} else {
		validEmail.value = false;
	}
};

    return true;
}

	// Remove validation classes
	const form = document.querySelector(".needs-validation");
	form.classList.remove("was-validated");
};

// Lifecycle Hooks
onMounted(() => {
	fetchVisitor();

    $(".needs-validation").on(
        "submit",
        (event) => {
            if (!form.checkValidity()) event.preventDefault();
            event.target.classList.add("was-validated");
        },
        false
    );
});
</script>

<style scoped>
.show-feedback {
	display: flex;
}

.validated {
	border-color: var(--bs-form-invalid-border-color);
}

#list-options {
	padding: 0.6rem 0.5rem;
	font-weight: 400;
	border: 0.0125rem solid #ccc;
	border-radius: 0.25rem !important;
}
svg {
	height: 20px !important;
	margin: 0 !important;
}

#visitor-view {
	gap: 1.5rem;
}

@media (max-width: 1440px) {
	#emailHelp {
		font-size: small;
	}
}
</style>
