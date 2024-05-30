<template>
    <div id="visitor-view" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
            style="margin-top: 0.3rem"
        >
            <BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
        </div>

        <div
            class="mt-4 form-control input"
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
                            class="form-control input"
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
                            class="form-control input"
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
                            class="form-control input"
                            id="middle_name"
                        />
                    </div>
                    <div class="col-md-6">
                        <label for="email" class="form-label">Email </label>
                        <div class="input-group has-validation">
                            <input
                                v-model="email"
                                type="email"
                                class="form-control input"
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
                            class="form-control input"
                            id="last_name"
                            required
                        />
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
                        class="form-control input"
                        name="address"
                        id="address"
                        required
                    ></textarea>
                </div>
                <div class="col-12">
                    <button
                        class="btn btn-primary mt-2 text-white input"
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

<style scoped>
.input {
    border: 0.0125rem solid #ccc;
    border-radius: 0.25rem !important;
}
</style>

<script setup>
import BreadCrumbs from "../BreadCrumbs.vue";
import ModalTemplate from "../ModalTemplate.vue";
import { registerVisitor } from "@/assets/js/index.js";

import { ref, defineProps, onMounted } from "vue";

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

const activeBreadCrumbs = ref([]);

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});

activeBreadCrumbs.value = [...props.breadCrumbs, "new-visitor"];

onMounted(() => {
    document
        .querySelector("aside #visitors")
        .classList.add("router-link-active");
});
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
