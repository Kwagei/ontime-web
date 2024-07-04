<template>
    <div class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
            style="margin-top: 0.3rem"
        >
            <BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
        </div>

        <div
            class="mt-4 form-control input"
            style="margin: auto; padding: 3rem"
        >
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
                            placeholder="John"
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
                        id="middle_name"
                        v-model="middle_name"
                        aria-describedby="inputGroupPrepend"
                    />
                </div>

                <!-- EMAIL -->
                <div class="col-md-6">
                    <label for="email" class="form-label is-required">
                        Email
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <div class="input-group has-validation">
                        <input
                            type="email"
                            :class="[validEmail && 'validated', 'form-control']"
                            v-model="email"
                            id="email"
                            aria-describedby="inputGroupPrepend"
                            autocomplete="off"
                            required
                        />
                        <div
                            :class="[
                                'invalid-feedback',
                                validEmail && 'show-feedback',
                            ]"
                        >
                            {{ validEmailMessage }}
                        </div>
                    </div>
                    <div id="emailHelp" class="form-text">
                        Enter a valid email address. For example:
                        john12@gmail.com
                    </div>
                </div>

                <!-- LAST NAME -->
                <div class="col-md-6">
                    <label for="last_name" class="form-label is-required">
                        Last name
                        <span class="visually-hidden">(required)</span>
                    </label>
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

                <!-- ADDRESS -->
                <div class="col-md-6">
                    <label for="address" class="form-label is-required">
                        Address
                        <span class="visually-hidden"> (required)</span>
                    </label>
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="address"
                            v-model="address"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide an address.
                        </div>
                    </div>
                    <div id="emailHelp" class="form-text">
                        Enter descriptive address. For example: Congo Town,
                        Adjacent Satcom, Monrovia, Liberia
                    </div>
                </div>

                <div class="col-md-12 d-flex">
                    <button
                        type="submit"
                        class="btn btn-primary"
                        style="
                            padding: 0.7rem 2rem !important;
                            font-weight: 600;
                            margin-left: auto;
                        "
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import BreadCrumbs from "../BreadCrumbs.vue";
import $ from "jquery";

// Helpers
import { getSingleVisitor, API_URL } from "@/assets/js/index.js";

// Utilities
import {
    msisdnValidation,
    emailValidation,
    showModal,
} from "@/assets/js/util.js";

import BreadCrumbs from "../BreadCrumbs.vue";

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

// Form status and breadcrumbs
const activeBreadCrumbs = ref([]);
const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);
activeBreadCrumbs.value = breadCrumbs.value;
const tmp = [...breadCrumbs.value];
const formStatus = tmp.pop();

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
        success: () => {
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
        const id = breadCrumbs.value[1];
        visitorInfo = await getSingleVisitor({ id });
        first_name.value = visitorInfo.first_name;
        middle_name.value = visitorInfo.middle_name;
        last_name.value = visitorInfo.last_name;
        msisdn.value = visitorInfo.msisdn;
        email.value = visitorInfo.email;
    }
};

const validEmail = ref(false);
const validMsisdn = ref(false);
const validMsisdnMessage = ref("Please provide a phone number");
const validEmailMessage = ref("Please provide a valid email address");

const contactValidation = (number) => {
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
        contactValidation(n);
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
        return;
    }

    const isValid = emailValidation(mail);

    if (!isValid.valid) {
        validEmail.value = true;
        validEmailMessage.value = isValid.message;
    } else {
        validEmail.value = false;
    }
};

function clearInputs() {
    first_name.value = "";
    middle_name.value = "";
    last_name.value = "";
    msisdn.value = "";
    email.value = "";
    address.value = "";

    // Remove validation classes
    const form = document.querySelector(".needs-validation");
    form.classList.remove("was-validated");
}

// Lifecycle Hooks
onMounted(() => {
    fetchVisitor();

    $(".needs-validation").on(
        "submit",
        (event) => {
            console.log("event: ", event);

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
    padding-top: 2rem;
    gap: 1.5rem;
}

@media (max-width: 1440px) {
    #emailHelp {
        font-size: small;
    }
}
</style>
