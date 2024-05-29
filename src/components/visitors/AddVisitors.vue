<template>
    <div>
        <div class="d-flex justify-content-between align-items-center py-3">
            <BreadCrumbs />
        </div>

        <section class="mt-4 form-control rounded p-4">
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
                            class="form-control"
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
                            class="form-control"
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
                            class="form-control"
                            id="middle_name"
                        />
                    </div>
                    <div class="col-md-6">
                        <label for="email" class="form-label">Email </label>
                        <div class="input-group has-validation">
                            <input
                                v-model="email"
                                type="text"
                                class="form-control"
                                id="email"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="last_name" class="form-label is-required"
                        >Last name<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <input
                        v-model="last_name"
                        type="text"
                        class="form-control"
                        id="last_name"
                        required
                    />
                </div>
                <div class="col-md-12 mb-3">
                    <label for="address" class="form-label is-required"
                        >Address<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <textarea
                        v-model="address"
                        class="form-control"
                        name="address"
                        id="address"
                        required
                    ></textarea>
                </div>
                <div class="col-12">
                    <button
                        class="btn btn-primary mt-2"
                        id="save-form"
                        type="submit"
                    >
                        Save
                    </button>
                </div>
            </form>
        </section>
    </div>
</template>

<script setup>
import BreadCrumbs from "../BreadCrumbs.vue";

import { ref } from "vue";

const first_name = ref("");
const middle_name = ref("");
const last_name = ref("");
const msisdn = ref("");
const address = ref("");

const emit = defineEmits(["visitorFormSubmitted"]);

const onSubmit = () => {
    const visitor = {
        first_name,
        middle_name,
        last_name,
        msisdn,
        address,
    };

    emit("visitorFormSubmitted", visitor);
};
</script>
