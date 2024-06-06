<template>
    <Modal :data="{ title, message, status }" />
    <div id="visitor-view" class="d-flex flex-column container">
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
                            class="form-control"
                            v-model="msisdn"
                            id="phone_number"
                            aria-describedby="inputGroupPrepend"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide a phone number.
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

                <!-- EMAIL -->
                <div class="col-md-6">
                    <label for="email" class="form-label">Email</label>
                    <input
                        type="email"
                        class="form-control"
                        id="email"
                        v-model="email"
                        aria-describedby="inputGroupPrepend"
                    />
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

                <div class="col-md-12">
                    <button
                        type="submit"
                        class="btn btn-primary"
                        style="
                            padding: 0.7rem 2rem !important;
                            font-weight: 600;
                        "
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import BreadCrumbs from "../BreadCrumbs.vue";
import Modal from "../Modal.vue";
import { registerVisitor } from "@/assets/js/index.js";

import { ref, defineProps, onMounted } from "vue";

const first_name = ref("");
const middle_name = ref("");
const last_name = ref("");
const msisdn = ref("");
const email = ref("");

const status = ref("");
const message = ref("");
const title = ref("");

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

    const response = await registerVisitor(visitor);
    const myModal = new boosted.Modal("#exampleModal", { backdrop: true });
    if (!response.ok) {
        myModal.show(document.querySelector("#toggleMyModal"));
        status.value = "danger";
        message.value = response.result.message;
        title.value = "Error";
    } else {
        myModal.show(document.querySelector("#toggleMyModal"));
        status.value = "success";
        message.value = response.result.message;
        title.value = "Success";
    }

    visuallyHideModalBackdrop();
};

const activeBreadCrumbs = ref([]);

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});

activeBreadCrumbs.value = [...props.breadCrumbs, "new-visitor"];

const formValidation = onMounted(() => {
    (() => {
        "use strict";

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
    })();
});

function visuallyHideModalBackdrop() {
    const modalsBackdrops = document.querySelectorAll(".modal-backdrop");

    if (modalsBackdrops.length) {
        modalsBackdrops.forEach((modal) =>
            modal.classList.add("visually-hidden")
        );
    }
}
</script>

<style scoped>
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

#new-visitor:hover {
    color: white !important;
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
