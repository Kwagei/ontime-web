<template>
    <!-- BELONGING MODAL -->
    <div
        class="modal fade"
        id="editParticipantModal"
        tabindex="-1"
        aria-hidden="true"
        aria-labelledby="editParticipantModalLabel"
        style="z-index: 999999"
    >
        <div
            class="modal-dialog modal-lg modal-dialog-centered"
            id="editParticipantModalBody"
        >
            <div class="modal-content py-4 px-3 rounded">
                <div class="text-center">
                    <h5 class="text-danger">{{ errorMessage }}</h5>
                </div>
                <div class="modal-header">
                    <h4>Editing Participant {{ participantIndex }}</h4>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        data-bs-placement="bottom"
                        data-bs-title="Close"
                    >
                        <span class="visually-hidden">Close</span>
                    </button>
                </div>
                <div class="modal-body input">
                    <form
                        class="row g-3 needs-validation"
                        novalidate
                        @submit.prevent="update"
                    >
                        <!-- FIRST NAME -->
                        <div class="col-md-6">
                            <label
                                for="first_name"
                                class="form-label is-required"
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
                                    required
                                />
                                <div class="invalid-feedback">
                                    Please provide a first name.
                                </div>
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

                        <!-- LAST NAME -->
                        <div class="col-md-6">
                            <label
                                for="last_name"
                                class="form-label is-required"
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

                        <!-- GENDER -->
                        <div class="col-md-6">
                            <label for="address" class="form-label is-required"
                                >Gender<span class="visually-hidden">
                                    (required)</span
                                ></label
                            >
                            <div class="input-group has-validation">
                                <select
                                    class="form-select"
                                    aria-label="Default select example"
                                    required
                                    v-model="gender"
                                >
                                    <option selected></option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <div class="invalid-feedback">
                                    Please select a gender.
                                </div>
                            </div>
                        </div>

                        <!-- PHONE NUMBER -->
                        <div class="col-md-6">
                            <label
                                for="phone_number"
                                class="form-label is-required"
                                >Phone number<span class="visually-hidden">
                                    (required)</span
                                ></label
                            >
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
                                Phone number should start with 0. For example:
                                0778675908
                            </div>
                        </div>

                        <!-- EMAIL -->
                        <div class="col-md-6">
                            <label for="email" class="form-label">Email</label>
                            <div class="input-group">
                                <input
                                    type="email"
                                    v-model="email"
                                    :class="[
                                        validEmail && 'validated',
                                        'form-control',
                                    ]"
                                    id="email"
                                    aria-describedby="inputGroupPrepend"
                                    autocomplete="off"
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
                            <div class="helpMessage form-text">
                                Enter a valid email address. For example:
                                john12@gmail.com
                            </div>
                        </div>

                        <!-- ADDRESS -->
                        <div class="col-md-6">
                            <label for="address" class="form-label is-required"
                                >Address<span class="visually-hidden">
                                    (required)</span
                                ></label
                            >
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
                            <div class="helpMessage form-text">
                                Enter descriptive address. For example: Congo
                                Town, Adjacent Satcom, Monrovia, Liberia
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

                        <!-- SESSION -->
                        <div class="col-md-6">
                            <label for="session" class="form-label is-required">
                                Session
                                <span class="visually-hidden">
                                    (required)
                                </span>
                            </label>
                            <div class="input-group has-validation">
                                <select
                                    class="form-select"
                                    aria-label="Default select example"
                                    required
                                    v-model="session"
                                >
                                    <option selected></option>
                                    <option value="morning">Morning</option>
                                    <option value="afternoon">Afternoon</option>
                                </select>
                                <div class="invalid-feedback">
                                    Please select a session.
                                </div>
                            </div>
                        </div>

                        <div class="col-md-12 d-flex gap-2 justify-content-end">
                            <button type="submit" class="btn btn-primary">
                                Update
                            </button>

                            <button
                                type="button"
                                class="btn btn-outline-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { emailValidation, formValidation, msisdnValidation } from "@/util/util";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});

// Participant data
const first_name = ref("");
const middle_name = ref("");
const last_name = ref("");
const msisdn = ref("");
const email = ref("");
const address = ref("");
const gender = ref("");
const occupation = ref("");
const session = ref("");

const emit = defineEmits(["updated", "cancel"]);

const participantIndex = ref(0);
const errorMessage = ref();

const validEmail = ref(false);
const validMsisdn = ref(false);
const validMsisdnMessage = ref("Please provide a phone number");
const validEmailMessage = ref("Please provide a valid email address");

function update() {
    if (
        !first_name.value ||
        !last_name.value ||
        !msisdn.value ||
        !address.value ||
        !session.value ||
        !gender.value
    ) {
        return;
    }

    const updatedParticipant = {
        first_name: first_name.value,
        middle_name: middle_name.value,
        last_name: last_name.value,
        address: address.value,
        email: email.value,
        msisdn: msisdn.value,
        gender: gender.value,
        occupation: occupation.value,
        session: session.value,
    };

    emit("updated", updatedParticipant);
}

watch(
    () => msisdn.value,
    (n) => {
        if (!n) {
            return;
        }
        validateMsisdn(n);
    }
);

watch(
    () => email.value,
    (n) => {
        if (!n) {
            return;
        }
        validateEmail(n);
    }
);

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

function initializeFormData() {
    errorMessage.value = props.data.errorMessage;
    participantIndex.value = props.data.idx + 1;

    first_name.value = props.data.participant?.first_name;
    middle_name.value = props.data.participant?.middle_name;
    last_name.value = props.data.participant?.last_name;
    msisdn.value = props.data.participant?.msisdn;
    email.value = props.data.participant?.email;
    address.value = props.data.participant?.address;
    gender.value = props.data.participant?.gender;
    occupation.value = props.data.participant?.occupation;
    session.value = props.data.participant?.session;
}

// Lifecycle Hooks
onMounted(() => {
    formValidation();
    initializeFormData();
});
</script>

<style scoped>
.show-feedback {
    display: flex;
}

.validated {
    border-color: var(--bs-form-invalid-border-color);
}

.validated:focus {
    border-color: var(--bs-form-invalid-border-color) !important;
}

@media (min-width: 1250px) {
    #editParticipantModalBody {
        max-width: 67% !important;
        margin-left: 24.5% !important;
    }
}

.modal {
    background-color: #1616158f;
}
</style>
