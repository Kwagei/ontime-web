<template>
    <Modal :data="{ title, message, status, pageLink }" />
    <div id="visitor-view" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
        >
            <BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
        </div>

        <div class="mt-1 p-4 form-control input">
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
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide a first name.
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
                    <label for="email" class="form-label">Email</label>
                    <div class="input-group">
                        <input
                            type="email"
                            :class="[validEmail && 'validated', 'form-control']"
                            v-model="email"
                            id="email"
                            aria-describedby="inputGroupPrepend"
                            @blur="validateEmail"
                        />
                        <div
                            :class="[
                                'invalid-feedback',
                                validEmail && 'show-feedback',
                            ]"
                        >
                            Please provide a valid email address
                        </div>
                    </div>
                    <div id="emailHelp" class="form-text">
                        Please enter a valid email address. For example:
                        example@example.com
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
                    <div id="emailHelp" class="form-text">
                        Enter descriptive address. For example: Congo Town,
                        Adjacent Satcom, Monrovia, Liberia
                    </div>
                </div>

                <!-- Submit and Cancel Buttons -->
                <div class="col-md-12 d-flex gap-3">
                    <button
                        type="submit"
                        class="btn btn-primary px-5"
                        style="margin-left: auto"
                    >
                        Save
                    </button>
                    <button
                        class="px-5 btn btn-secondary"
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
import { watch, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BreadCrumbs from "../BreadCrumbs.vue";
import Modal from "../Modal.vue";
import {
    registerVisitor,
    editVisitor,
    getSingleVisitor,
    visuallyHideModalBackdrop,
} from "@/assets/js/index.js";
import {
	msisdnValidation,
	emailValidation,
	showModal,
} from "@/assets/js/util.js";

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

let visitorInfo;

// Form status and breadcrumbs
const activeBreadCrumbs = ref([]);
const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);
activeBreadCrumbs.value = breadCrumbs.value;
const tem = [...breadCrumbs.value];
const formStatus = tem.pop();

const router = useRouter();

// Functions
const onSubmit = async () => {
    if (!first_name.value || !last_name.value || !msisdn.value) {
        return;
    }

    const visitor = {
        first_name: first_name.value,
        middle_name: middle_name.value,
        last_name: last_name.value,
        msisdn: msisdn.value,
        email: email.value,
    };

    const response = formStatus.startsWith("new")
        ? await registerVisitor(visitor)
        : await editVisitor(visitorInfo.id, visitor);

    const myModal = new boosted.Modal("#exampleModal", { backdrop: true });
    myModal.show(document.querySelector("#toggleMyModal"));
    status.value = response.ok ? "success" : "danger";
    message.value = response.result.message;
    title.value = response.ok ? "Success" : "Error";
    console.log("Result: ", response.result);
    pageLink.value = response.result.data
        ? `/visitors/${response.result.data[0].id}`
        : undefined;

    visuallyHideModalBackdrop();

    // Reset form if the response is successful
    if (response.ok) {
        resetForm();
    }
};

const fetchVisitor = async () => {
    if (formStatus.startsWith("edit")) {
        const id = breadCrumbs.value[1];
        visitorInfo = await getSingleVisitor({ id });
        first_name.value = visitorInfo.first_name;
        middle_name.value = visitorInfo.middle_name;
        last_name.value = visitorInfo.last_name;
        msisdn.value = visitorInfo.msisdn;
        email.value = visitorInfo.email;
        address.value = visitorInfo.address;
    }
};

const validEmail = ref(false);
const validMsisdn = ref(false);
const validMsisdnMessage = ref("Please provide a phone number");
const validEmailMessage = ref("Please provide a valid email address");

const contactValidation = () => {
    if (!msisdn.value) {
        validMsisdn.value = false;
        validMsisdnMessage.value = "Please provide a phone number";

        return;
    }

    const isvalid = msisdnValidation([msisdn.value]);

    if (!isvalid.valid) {
        validMsisdn.value = true;
        validMsisdnMessage.value = isvalid.message;
    } else {
        validMsisdn.value = false;
    }
};

const validateEmail = () => {
    validEmail.value = emailValidation(email.value) ? false : true;
};

const resetForm = () => {
    first_name.value = "";
    middle_name.value = "";
    last_name.value = "";
    msisdn.value = "";
    email.value = "";
    address.value = "";

    // Remove validation classes
    const form = document.querySelector(".needs-validation");
    form.classList.remove("was-validated");
};

// Lifecycle Hooks
onMounted(() => {
    fetchVisitor();

    const form = document.querySelector(".needs-validation");
    form.addEventListener(
        "submit",
        (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add("was-validated");
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

@media (min-width: 768px) and (max-width: 1440px) {
    #visitor-view {
        padding: 1rem 3rem 0 3rem;
    }
}
</style>
