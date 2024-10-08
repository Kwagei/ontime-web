<template>
    <AlertModal :data="alert" />

    <BelongingModal @done="checkInParticipant" />

    <div id="addParticipantFormContainer" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
        >
            <BreadCrumbs class="mb-0 mt-4" :breadCrumbs="breadCrumbs" />
        </div>
        <div
            id="mobileFormWrapper"
            class="form-control input rounded"
            style="margin: auto; padding: 3rem"
        >
            <form
                class="row g-3 needs-validation"
                novalidate
                @submit.prevent="onSubmit"
            >
                <!-- FIRST NAME -->
                <div class="col-md-6">
                    <label for="first_name" class="form-label is-required"
                        >First name<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="first_name"
                            aria-describedby="inputGroupPrepend"
                            v-model="first_name"
                            autofocus="true"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide a first name.
                        </div>
                    </div>
                </div>

                <!-- LAST NAME -->
                <div class="col-md-6">
                    <label for="last_name" class="form-label is-required"
                        >Last name<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="last_name"
                            v-model="last_name"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide a last name.
                        </div>
                    </div>
                </div>

                <!-- PHONE NUMBER -->
                <div class="col-md-6">
                    <label for="phone_number" class="form-label is-required">
                        Phone number
                        <span class="visually-hidden"> (required) </span>
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
                    <div class="helpMessage form-text">
                        Phone number should start with 0 or 231. For example:
                        0778675908 / 231778675908
                    </div>
                </div>

                <!-- EMAIL -->
                <div class="col-md-6">
                    <label for="email" class="form-label"> Email </label>
                    <div class="input-group">
                        <input
                            type="email"
                            :class="[validEmail && 'validated', 'form-control']"
                            v-model="email"
                            id="email"
                            aria-describedby="inputGroupPrepend"
                            autocomplete="off"
                        />
                        <div
                            :class="[
                                'invalid-feedback',
                                email && validEmail && 'show-feedback',
                            ]"
                        >
                            {{ validEmailMessage }}
                        </div>
                    </div>
                    <div class="helpMessage form-text">
                        Enter a valid email address. For example:
                        john12@gmail.com
                    </div>
                </div>

                <!-- ADDRESS -->
                <div class="col-md-6">
                    <label for="address" class="form-label"> Address </label>
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="address"
                            v-model="address"
                        />
                    </div>
                    <div class="helpMessage form-text">
                        Enter descriptive address. For example: Congo Town,
                        Adjacent Satcom, Monrovia, Liberia
                    </div>
                </div>

                <!-- SESSION -->
                <div class="col-md-6">
                    <label for="session" class="form-label"> Session </label>
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="session"
                            v-model="session"
                        />

                        <div class="invalid-feedback">
                            Please enter session information
                        </div>
                    </div>
                    <div class="helpMessage form-text">
                        Morning Session, Afternoon Session or Time in the Day of
                        Session
                    </div>
                </div>

                <!-- GENDER -->
                <div class="col-md-6">
                    <label for="gender" class="form-label is-required">
                        Gender
                        <span class="visually-hidden"> (required) </span>
                    </label>
                    <div class="input-group has-validation">
                        <select
                            v-model="gender"
                            class="form-select"
                            id="gender"
                            required
                        >
                            <option selected></option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>

                        <div class="invalid-feedback">
                            Please select Male or Female.
                        </div>
                    </div>
                </div>

                <!-- OCCUPATION -->
                <div class="col-md-6">
                    <label for="occupation" class="form-label">
                        Occupation
                    </label>
                    <input
                        type="text"
                        class="form-control"
                        id="occupation"
                        v-model="occupation"
                        aria-describedby="inputGroupPrepend"
                    />
                </div>

                <div class="col-md-12 d-flex justify-content-end gap-2">
                    <button type="submit" class="btn btn-primary">Save</button>
                    <button
                        type="submit"
                        @click="action = 'checkIn'"
                        class="btn btn-success"
                    >
                        Check In
                    </button>
                    <button
                        @click="$emit('switch', 'details')"
                        class="btn btn-outline-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import AlertModal from "../modals/AlertModal.vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import BelongingModal from "../modals/BelongingModal.vue";

import { ref, onMounted, watch, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import $ from "jquery";

import {
    API_KEY,
    API_URL,
    registerVisit,
    registerVisitor,
} from "@/assets/js/index.js";
import {
    msisdnValidation,
    emailValidation,
    showModal,
    getElement,
    removeClass,
    addClass,
    formValidation,
} from "@/util/util.js";

const props = defineProps({
    breadCrumbs: Object,
    event: Object,
});

const action = ref("");
const createdParticipant = ref({});
const $sectionIsLoading =
    getCurrentInstance().appContext.config.globalProperties.$sectionIsLoading;

// Route and State
const route = useRoute();
const eventId = route.params.id;
const breadCrumbs = ["Events", eventId, "Add Participant"];

const first_name = ref("");
const last_name = ref("");
const msisdn = ref("");
const email = ref("");
const address = ref("");
const gender = ref("");
const occupation = ref("");
const session = ref("");

const alert = ref({
    status: "",
    title: "",
    message: "",
    pageLink: "",
});

const validEmail = ref(false);
const validMsisdn = ref(false);
const validMsisdnMessage = ref("Please provide a phone number");
const validEmailMessage = ref("Please provide a valid email address");

// Functions
const onSubmit = async () => {
    if (!first_name.value || !last_name.value || !gender.value) {
        return;
    }

    const participant = {
        first_name: first_name.value,
        last_name: last_name.value,

        // format msisdn for backend
        msisdn: msisdn.value.startsWith("0")
            ? `231${msisdn.value.slice(1)}`
            : msisdn.value,

        email: email.value,
        address: address.value,
        gender: gender.value,
        occupation: occupation.value,
        session: session.value,
    };

    const body = {
        event: {
            id: route.params.id,
        },
        event_participants: [participant],
    };

    $sectionIsLoading.value = true;

    await $.ajax({
        url: `${API_URL}event_participants`,
        type: "POST",
        data: body,
        headers: {
            authorization: API_KEY,
        },
        success: (data) => {
            alert.value.status = "success";
            alert.value.message = data.message;
            alert.value.title = data.message;
            alert.value.pageLink = `/events/${eventId}`;

            showModal();
            $sectionIsLoading.value = false;

            if (action.value == "checkIn") {
                createdParticipant.value = data.data[0];
                showModal("#visitModal", "#modal-dialog");
            } else resetForm();

            setTimeout(() => {
                $("#alertMessageParagraph").text(data.message);
                $("#alertStatusDiv").removeClass("alert-undefined");
                $("#alertStatusDiv").removeClass("alert-warning");
                $("#alertStatusDiv").removeClass("alert-danger");
                $("#alertStatusDiv").addClass("alert-success");
                $("#alertModalBody > .modal-content").removeClass(
                    "border-undefined"
                );
                $("#alertModalBody > .modal-content").addClass(
                    "border-success"
                );
            }, 150);
        },
        error: (error) => {
            $sectionIsLoading.value = false;

            alert.value.pageLink = "danger";
            alert.value.title = error.responseJSON.message;
            alert.value.message = error.responseJSON.message;
            alert.value.status = "";

            showModal();

            setTimeout(() => {
                $("#alertMessageParagraph").text(error.responseJSON.message);
                $("#alertStatusDiv").removeClass("alert-undefined");
                $("#alertStatusDiv").removeClass("alert-warning");
                $("#alertStatusDiv").removeClass("alert-danger");
                $("#alertStatusDiv").addClass("alert-danger");
                $("#alertModalBody").removeClass("border-undefined");
                $("#alertModalBody").addClass("border-success");
            }, 150);
        },
    });
};

async function checkInParticipant(modalResponse) {
    $sectionIsLoading.value = true;

    // create visitor
    const createdVisitor = await registerVisitor({
        first_name: createdParticipant.value.first_name,
        last_name: createdParticipant.value.last_name,
        msisdn: createdParticipant.value.msisdn,
        email: createdParticipant.value.email,
        address: createdParticipant.value.address,
        gender: createdParticipant.value.gender,
        occupation: createdParticipant.value.occupation,
    });

    // handle error creating visitor
    if (!createdVisitor.ok) {
        showModal();

        setTimeout(() => {
            $("#alertMessageParagraph").text(data.message);
            $("#alertStatusDiv").removeClass("alert-undefined");
            $("#alertStatusDiv").removeClass("alert-warning");
            $("#alertStatusDiv").removeClass("alert-danger");
            $("#alertStatusDiv").addClass("alert-danger");
            $("#alertModalBody > .modal-content").removeClass(
                "border-undefined"
            );
            $("#alertModalBody > .modal-content").addClass("border-danger");
        }, 150);

        return;
    }

    // format visit data
    const checkInData = {
        visitor_id: createdVisitor.result.data[0].id,
        purpose: props.event?.title,
        room_id: props.event?.room_id,
        institution: modalResponse.institution,
        items: modalResponse.belongings,
    };

    // check participant in finally
    const checkInResponse = await registerVisit(checkInData);

    showModal();

    $sectionIsLoading.value = false;

    if (checkInResponse.ok) {
        setTimeout(() => {
            $("#alertMessageParagraph").text(checkInResponse.result.message);
            $("#alertStatusDiv").removeClass("alert-undefined");
            $("#alertStatusDiv").removeClass("alert-warning");
            $("#alertStatusDiv").removeClass("alert-danger");
            $("#alertStatusDiv").addClass("alert-success");
            $("#alertModalBody > .modal-content").removeClass(
                "border-undefined"
            );
            $("#alertModalBody > .modal-content").addClass("border-success");
        }, 150);

        // hide belongings and institution modal
        const visitModal = getElement("#visitModal");
        removeClass(visitModal, "show");
        visitModal.style.display = "none";

        resetForm();
    } else {
        setTimeout(() => {
            $("#alertMessageParagraph").text(checkInResponse.result.message);
            $("#alertStatusDiv").removeClass("alert-undefined");
            $("#alertStatusDiv").removeClass("alert-warning");
            $("#alertStatusDiv").removeClass("alert-danger");
            $("#alertStatusDiv").addClass("alert-danger");
            $("#alertModalBody > .modal-content").removeClass(
                "border-undefined"
            );
            $("#alertModalBody > .modal-content").addClass("border-danger");
        }, 150);
    }
}

const validateMsisdn = (number) => {
    if (!number) {
        validMsisdn.value = false;
        validMsisdnMessage.value = "Please provide a phone number";

        return;
    }

    const isValid = msisdnValidation([number]);

    if (!isValid.valid) {
        validMsisdn.value = true;
        validMsisdnMessage.value = isValid.message;
    } else {
        validMsisdn.value = false;
    }
};

watch(
    () => msisdn.value,
    (n) => {
        validateMsisdn(n);
    }
);

watch(
    () => email.value,
    (n) => {
        validateEmail(n);
    }
);

const validateEmail = (mail) => {
    if (!mail) {
        validEmail.value = false;
        validEmailMessage.value = "Please provide a valid email address";
    }
    const isValid = emailValidation(mail);

    if (!isValid.valid) {
        validEmail.value = true;
        validEmailMessage.value = isValid.message;
    } else {
        validEmail.value = false;
    }
};

const resetForm = () => {
    first_name.value = "";
    last_name.value = "";
    msisdn.value = "";
    email.value = "";
    address.value = "";
    gender.value = "";
    session.value = "";
    occupation.value = "";

    // Remove validation classes
    const form = getElement(".needs-validation");
    removeClass(form, "was-validated");
};

// Lifecycle Hooks
onMounted(() => {
    formValidation();
});
</script>

<style scoped>
@media (max-width: 450px) {
    #addParticipantFormContainer {
        padding: 0 !important;
        gap: 0 !important;
    }
}

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

#addParticipantFormContainer {
    gap: 1.5rem;
}
</style>
