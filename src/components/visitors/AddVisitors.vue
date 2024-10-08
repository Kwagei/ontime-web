<template>
    <AlertModal :data="alert" />

    <BelongingModal @done="checkInVisitor" :getRoom="true" />

    <div id="visitor-view" class="d-flex flex-column container">
        <div
            id="entitiesBreadCrumbsWrapper"
            class="d-flex justify-content-between align-items-center container p-0 mx-auto mt-4"
        >
            <BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
        </div>

        <div
            id="mobileFormWrapper"
            class="mt-1 form-control input rounded"
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
                            autofocus="true"
                            v-model="first_name"
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
                    <label for="phone_number" class="form-label is-required"
                        >Phone number<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <input
                            v-model="msisdn"
                            type="tel"
                            :class="[
                                validMsisdn && 'validated',
                                'form-control',
                            ]"
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
                            type="text"
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

                <!-- GENDER -->
                <div class="col-md-6">
                    <label for="gender" class="form-label is-required"
                        >Gender<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <select
                            class="form-select"
                            aria-label="Default select example"
                            required
                            id="gender"
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

                <!-- OCCUPATION -->
                <div class="col-md-6">
                    <label for="occupation" class="form-label">
                        Occupation
                    </label>
                    <input
                        class="form-control"
                        id="occupation"
                        v-model="occupation"
                        aria-describedby="inputGroupPrepend"
                    />
                </div>

                <!-- ADDRESS -->
                <div class="col-md-6">
                    <label for="address" class="form-label"> Address </label>
                    <div class="input-group">
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

                <div class="col-md-12 d-flex gap-2 justify-content-end">
                    <button type="submit" class="btn btn-primary">Save</button>
                    <button
                        type="submit"
                        v-if="formStatus.startsWith('new')"
                        @click="action = 'checkIn'"
                        class="btn btn-success"
                    >
                        Check In
                    </button>
                    <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="router.back()"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import BreadCrumbs from "../BreadCrumbs.vue";
import AlertModal from "../modals/AlertModal.vue";
import BelongingModal from "../modals/BelongingModal.vue";
import {
    registerVisitor,
    editVisitor,
    getSingleVisitor,
    API_URL,
    API_KEY,
    registerVisit,
} from "@/assets/js/index.js";
import {
    msisdnValidation,
    emailValidation,
    showModal,
    getElement,
    removeClass,
    formValidation,
} from "@/util/util.js";

// Route and State
const route = useRoute();
const router = useRouter();

// visitor data
const first_name = ref("");
const last_name = ref("");
const msisdn = ref("");
const email = ref("");
const address = ref("");
const gender = ref("");
const occupation = ref("");

const alert = ref({
    status: "",
    title: "",
    message: "",
    pageLink: "",
});

let visitorInfo;
const createdVisitor = ref({});

const action = ref("");

// Form status and breadcrumbs
const activeBreadCrumbs = ref([]);
const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);
activeBreadCrumbs.value = breadCrumbs.value;
const tem = [...breadCrumbs.value];
const formStatus = tem.pop();

// Functions
const onSubmit = async () => {
    if (
        !first_name.value ||
        !last_name.value ||
        !msisdn.value ||
        !gender.value
    ) {
        return;
    }

    const visitor = {
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
    };

    const response = formStatus.startsWith("new")
        ? await registerVisitor(visitor)
        : await editVisitor(visitorInfo.id, visitor);

    showModal("#alertModal", "#alertModalBody");
    alert.value.status = response.ok ? "success" : "danger";
    alert.value.message = response.result.message;
    alert.value.pageLink = `/visitors/${response.result.data[0].id}`;

    // Reset form if the response is successful
    if (response.ok) {
        if (action.value == "checkIn") {
            createdVisitor.value = response.result.data[0];
            showModal("#visitModal", "#modal-dialog");
        } else resetForm();
    }
};

async function checkInVisitor(modalResponse) {
    const checkInData = {
        visitor_id: createdVisitor.value.id,
        purpose: "Workspace",
        room_id: modalResponse.selectedRoomId,
        institution: modalResponse.institution,
        items: modalResponse.belongings,
    };

    const checkInResponse = await registerVisit(checkInData);

    alert.value.message = checkInResponse.result.message;
    alert.value.status = checkInResponse.ok ? "success" : "danger";

    showModal();

    if (checkInResponse.ok) {
        // hide belongings and institution modal
        const visitModal = getElement("#visitModal");
        removeClass(visitModal, "show");
        visitModal.style.display = "none";

        resetForm();
    }
}

const fetchVisitor = async () => {
    if (formStatus.startsWith("edit")) {
        const id = breadCrumbs.value[1];
        visitorInfo = await getSingleVisitor({ id });

        // update references for input fields
        first_name.value = visitorInfo.first_name;
        last_name.value = visitorInfo.last_name;
        msisdn.value = visitorInfo.msisdn;
        email.value = visitorInfo.email;
        address.value = visitorInfo.address;
        gender.value = visitorInfo.gender;
        occupation.value = visitorInfo.occupation;
    }
};

const validEmail = ref(false);
const validMsisdn = ref(false);
const validMsisdnMessage = ref("Please provide a phone number");
const validEmailMessage = ref("Please provide a valid email address");

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
    occupation.value = "";

    // Remove validation classes
    const form = getElement(".needs-validation");
    removeClass(form, "was-validated");
};

// Lifecycle Hooks
onMounted(async () => {
    await fetchVisitor();
    formValidation();

    $("#breadCrumbs").css("display", "block");
    const breadCrumbsOl = $("#breadCrumbsOl")[0];

    if (window.innerWidth <= 1070) {
        breadCrumbsOl.innerHTML = `
			<li>
				<span class="text fw-bold">
					Add Visitor
				</span>
			</li>
		`;
    }
});
</script>

<style scoped>
.show-feedback {
    display: flex;
}

.validated {
    border-color: var(--bs-form-invalid-border-color) !important;
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
</style>
