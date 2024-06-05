<template>
    <Modal :data="{ title, message, status }" />
    <div id="visit-view" class="d-flex flex-column container">
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
            <!-- PHONE NUMBER -->
            <div class="col-md-6">
                <label
                    for="validationCustom02"
                    class="form-label is-required"
                    >Phone number<span class="visually-hidden">
                        (required)</span
                    ></label
                >
                <div class="input-group has-validation">
                    <input
                        type="text"
                        class="form-control"
                        v-model="msisdn"
                        id="validationCustomVisitorNumber"
                        aria-describedby="inputGroupPrepend"
                        required
                    />
                    <div class="invalid-feedback">
                        Please provide a valid phone number.
                    </div>
                </div>
            </div>
                <!-- NEW VISITOR -->
                <div class="col-md-6">
                    <label
                        for="validationCustom01"
                        class="form-label is-required"
                        >Visitor<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="validationCustomNewVisitor"
                            aria-describedby="inputGroupPrepend"
                            v-model="new_visitor"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide a visitor name.
                        </div>
                    </div>
                </div>

                <!-- Host -->
                <div class="col-md-6">
                    <label
                        for="validationCustom02"
                        class="form-label is-required"
                        >Host<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="validationCustom02"
                            v-model="host_name"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide a host name.
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <label
                        for="validationCustom02"
                        class="form-label is-required"
                        >Belonging<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="validationCustom02"
                            v-model="belonging"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide a belonging name.
                        </div>
                    </div>
                </div>
                <!-- Institution -->
                <div class="col-md-6">
                    <label
                        for="validationCustom02"
                        class="form-label"
                        >Institution<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="validationCustom02"
                            v-model="institution"
                        />
                    </div>
                </div>
                <!-- Room -->
                <div class="col-md-6">
                    <label
                        for="validationCustom02"
                        class="form-label is-required"
                        >Room<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="validationCustom02"
                            v-model="room"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide a room name.
                        </div>
                    </div>
                </div>
                <!-- Address -->
                <div class="col-md-6">
                    <label
                        for="validationCustom02"
                        class="form-label is-required"
                        >Address<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="validationCustom02"
                            v-model="visit_address"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide a address name.
                        </div>
                    </div>
                </div>
                <!-- Purpose -->
                <div class="col-12">
                    <label
                        for="validationCustom02"
                        class="form-label is-required"
                        >Purpose<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <textarea
                            class="form-control"
                            id="validationCustom02"
                            required
                            v-model="purpose"
                        ></textarea>
                        <div class="invalid-feedback">
                            Please provide an purpose.
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <button class="btn btn-primary mt-2" type="submit">
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
import Modal from "../Modal.vue";

import { ref, defineProps } from "vue";

const msisdn = ref("");
const new_visitor = ref("");
const host_name = ref("");
const belonging = ref("");
const institution = ref("");
const room = ref("");
const visit_address = ref("");
const purpose = ref("");

const activeBreadCrumbs = ref([]);

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});

activeBreadCrumbs.value = [...props.breadCrumbs, "visit-checkin"];



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

#visit-view {
    padding-top: 2rem;
    gap: 1.5rem;
}

@media (min-width: 768px) and (max-width: 1440px) {
    #visit-view {
        padding: 1rem 3rem 0 3rem;
    }
}
</style>
