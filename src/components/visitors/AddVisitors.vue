<template>
    <ModalTemplate />
    <div>
        <div
            class="d-flex justify-content-between align-items-center"
            style="width: 80%; margin: auto; padding-top: 1rem"
        >
            <BreadCrumbs />
        </div>

        <div
            class="mt-4 form-control rounded"
            style="width: 80%; margin: auto; padding: 3rem"
        >
            <form @submit.prevent="onSubmit" id="visitor-form">
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label for="first_name" class="form-label is-required"
                            >First name<span class="visually-hidden">
                                (required)</span
                            ></label
                        >
                        <input
                            v-model="first_name"
                            type="text"
                            class="form-control rounded"
                            id="first_name"
                            required
                        />
                    </div>
                    <div class="col-md-6">
                        <label for="phone_number" class="form-label is-required"
                            >Phone number<span class="visually-hidden">
                                (required)</span
                            ></label
                        >
                        <input
                            v-model="msisdn"
                            type="text"
                            class="form-control rounded"
                            id="phone_number"
                            required
                        />
                    </div>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label for="middle_name" class="form-label"
                            >Middle name
                        </label>
                        <input
                            v-model="middle_name"
                            type="text"
                            class="form-control rounded"
                            id="middle_name"
                        />
                    </div>
                    <div class="col-md-6">
                        <label for="email" class="form-label">Email </label>
                        <div class="input-group has-validation">
                            <input
                                v-model="email"
                                type="email"
                                class="form-control rounded"
                                id="email"
                            />
                        </div>
                    </div>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label for="last_name" class="form-label is-required"
                            >Last name<span class="visually-hidden">
                                (required)</span
                            ></label
                        >
                        <input
                            v-model="last_name"
                            type="text"
                            class="form-control rounded"
                            id="last_name"
                            required
                        />
                    </div>
                    <div class="col-md-6">
                        <label for="institution" class="form-label"
                            >Institution
                        </label>
                        <div class="input-group has-validation">
                            <input
                                v-model="institution"
                                type="text"
                                class="form-control rounded"
                                id="institution"
                            />
                        </div>
                    </div>
                </div>
                <div class="col-md-12 mb-3">
                    <label for="address" class="form-label is-required"
                        >Address<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <textarea
                        v-model="address"
                        class="form-control rounded"
                        name="address"
                        id="address"
                        required
                    ></textarea>
                </div>
                <div class="col-12">
                    <button
                        class="btn btn-primary mt-2 text-white rounded"
                        style="width: 8rem"
                        id="save-form"
                        type="submit"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import BreadCrumbs from "../BreadCrumbs.vue";
import ModalTemplate from "../ModalTemplate.vue";

import { registerVisitor } from "@/assets/js/index.js";

import { ref } from "vue";

const first_name = ref("");
const middle_name = ref("");
const last_name = ref("");
const msisdn = ref("");
const email = ref("");
const institution = ref("");
const address = ref("");

const emit = defineEmits(["visitorFormSubmitted"]);

const onSubmit = async () => {
    const visitor = {
        first_name: first_name.value,
        middle_name: middle_name.value || "",
        last_name: last_name.value,
        msisdn: msisdn.value,
        institution: institution.value || "",
        email: email.value || "",
        address: address.value,
    };

    const response = await registerVisitor(visitor);
    console.log({ response });

    emit("visitorFormSubmitted", visitor);
};
</script>
