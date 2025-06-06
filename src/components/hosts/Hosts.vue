<template>
    <Modal
        :data="{
            title: alert.title,
            message: alert.message,
            status: alert.status,
            pageLink: alert.pageLink,
        }"
    />
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

                <!-- HOST TYPE -->
                <div class="col-md-6">
                    <label for="host_type" class="form-label is-required"
                        >Host Type<span class="visually-hidden">
                            (required)</span
                        ></label
                    >

                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                            @click="updateHostTypeTerm('Company')"
                            checked
                        />
                        <label class="form-check-label" for="flexRadioDefault1">
                            Company
                        </label>
                    </div>
                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            @click="updateHostTypeTerm('Individual')"
                            id="flexRadioDefault2"
                        />
                        <label class="form-check-label" for="flexRadioDefault2">
                            Individual
                        </label>
                    </div>
                </div>

                <!-- DETAILS -->
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

                <div class="col-md-12 d-flex gap-2 justify-content-end">
                    <button
                        type="submit"
                        class="btn btn-primary px-5"
                        style="margin-left: auto"
                        :disabled="loading"
                    >
                        <div
                            class="spinner-border submitBtnLoader"
                            role="status"
                            v-if="loading"
                        >
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        {{ buttonLabel }}
                    </button>
                    <button
                        class="btn btn-secondary px-5"
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import BreadCrumbs from "@/components/BreadCrumbs.vue";
import Modal from "@/components/modals/AlertModal.vue";
import { registerHost, editHost, getHosts } from "@/assets/js/index.js";
import {
    formValidation,
    getElement,
    removeClass,
    showModal,
} from "@/util/util.js";
import router from "@/router";

// Route and State
const route = useRoute();
const name = ref("");
const details = ref("");
const type = ref("Company");

// Modal Data
const alert = ref({
    title: "",
    status: "",
    message: "",
    pageLink: "",
});

const buttonLabel = ref("Save");
let hostInfo;

const loading = ref(false);

// Form status and breadcrumbs
const activeBreadCrumbs = ref([]);
const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);
activeBreadCrumbs.value = breadCrumbs.value;
const tem = [...breadCrumbs.value];
const formStatus = tem.pop();

// Functions
const onSubmit = async () => {
    if (loading.value) return;

    if (!name.value) {
        return;
    }

    loading.value = true;

    const host = {
        name: name.value,
        details: details.value,
        type: type.value,
    };

    const response = formStatus.startsWith("new")
        ? await registerHost(host)
        : await editHost(hostInfo.id, host);

    showModal("#alertModal", "#alertModalBody");
    alert.value.status = response.ok ? "success" : "danger";
    alert.value.message = response.result.message;

    loading.value = false;

    // Reset form if the response is successful
    if (response.ok) {
        resetForm();
    }
};

const updateHostTypeTerm = (t) => {
    type.value = t;
};

const fetchHost = async () => {
    if (formStatus.startsWith("edit")) {
        buttonLabel.value = "Update";
        const id = breadCrumbs.value[1];
        hostInfo = await getHosts({ id });

        name.value = hostInfo.name;
        details.value = hostInfo.details;
    }
};

const resetForm = () => {
    name.value = "";
    details.value = "";
    buttonLabel.value = "Save";

    // Remove validation classes
    const form = getElement(".needs-validation");
    removeClass(form, "was-validated");
};

// Lifecycle Hooks
onMounted(() => {
    fetchHost();
    formValidation();
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
