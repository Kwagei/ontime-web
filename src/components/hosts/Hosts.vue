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
                <!-- NAME -->
                <div class="col-md-6">
                    <label for="name" class="form-label is-required"
                        >Name<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="name"
                            aria-describedby="inputGroupPrepend"
                            v-model="name"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide a host name.
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
                            @blur="contactValidation"
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
                        For example: 0778456789
                    </div>
                </div>

                <!-- HOST TYPE -->
                <div class="">
                    <label for="host_type" class="form-label is-required"
                        >Host Type<span class="visually-hidden">
                            (required)</span
                        ></label
                    >
                    <div class="form-check mb-0">
                        <input class="form-check-input" type="checkbox" />
                        <label for="">Individual</label>
                    </div>
                    <div class="form-check mb-0">
                        <input class="form-check-input" type="checkbox" />
                        <label for="">Company</label>
                    </div>
                </div>

                <!-- Details -->
                <div class="col-md-6">
                    <label for="detailsTextarea" class="form-label"
                        >Details</label
                    >
                    <textarea
                        placeholder="Enter details..."
                        class="form-control"
                        id="detailsTextarea"
                        v-model="details"
                        rows="4"
                    ></textarea>
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
                        {{ buttonLabel }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import BreadCrumbs from "@/components/BreadCrumbs.vue";
import Modal from "@/components/Modal.vue";
import { registerHost, editHost, getHosts } from "@/assets/js/index.js";
import { msisdnValidation } from "@/assets/js/util.js";

// Route and State
const route = useRoute();
const name = ref("");
const msisdn = ref("");
const details = ref("");
const status = ref("");
const message = ref("");
const title = ref("");

const buttonLabel = ref("Save");
let hostInfo;

// Form status and breadcrumbs
const activeBreadCrumbs = ref([]);
const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);
activeBreadCrumbs.value = breadCrumbs.value;
const tem = [...breadCrumbs.value];
const formStatus = tem.pop();

// Functions
const onSubmit = async () => {
    if (!name.value || !msisdn.value) {
        return;
    }

    const host = {
        name: name.value,
        msisdn:
            msisdn.value[0] == "0"
                ? `231${msisdn.value.slice(1)}`
                : msisdn.value,
        details: details.value,
    };

    const response = formStatus.startsWith("new")
        ? await registerHost(host)
        : await editHost(hostInfo.id, host);

    console.log(response);

    const myModal = new boosted.Modal("#exampleModal", { backdrop: true });
    myModal.show(document.querySelector("#toggleMyModal"));
    status.value = response.ok ? "success" : "danger";
    message.value = response.result.message;
    title.value = response.ok ? "Success" : "Error";

    visuallyHideModalBackdrop();

    // Reset form if the response is successful
    if (response.ok) {
        resetForm();
    }
};

const fetchHost = async () => {
    if (formStatus.startsWith("edit")) {
        buttonLabel.value = "Update";
        const id = breadCrumbs.value[1];
        hostInfo = await getHosts({ id });

        name.value = hostInfo.name;
        msisdn.value = hostInfo.msisdn;
        details.value = hostInfo.details;
    }
};

const visuallyHideModalBackdrop = () => {
    document
        .querySelectorAll(".modal-backdrop")
        .forEach((modal) => modal.classList.add("visually-hidden"));
};

const validMsisdn = ref(false);
const validMsisdnMessage = ref("Please provide a phone number");

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

const resetForm = () => {
    name.value = "";
    msisdn.value = "";
    details.value = "";
    buttonLabel.value = "Save";

    // Remove validation classes
    const form = document.querySelector(".needs-validation");
    form.classList.remove("was-validated");
};

// Lifecycle Hooks
onMounted(() => {
    fetchHost();

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
