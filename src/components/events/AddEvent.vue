<template>
    <Modal
        :data="{
            title: successModalData.title,
            message: successModalData.message,
            status: successModalData.status,
            pageLink: successModalData.pageLink,
        }"
    />
    <div id="eventsWrapper" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
            style="margin-top: 0.3rem"
        >
            <BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
        </div>

        <div class="form-control input" style="margin: auto; padding: 3rem">
            <form
                @submit.prevent="postEvent"
                class="row g-3 needs-validation"
                novalidate
            >
                <div class="col-md-6">
                    <label for="titleInput" class="form-label is-required">
                        Title
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <input
                        type="text"
                        class="form-control"
                        :class="{
                            border: titleError,
                            'border-danger': titleError,
                        }"
                        id="titleInput"
                        placeholder="Title"
                        v-model="title"
                        required
                    />

                    <Alert :title="titleError" />
                </div>
                <div class="col-md-6">
                    <label
                        for="facilitatorInput"
                        class="form-label is-required"
                    >
                        Facilitator
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <input
                        type="text"
                        class="form-control"
                        id="facilitatorInput"
                        :class="{
                            border: facilitatorError,
                            'border-danger': facilitatorError,
                        }"
                        placeholder="Facilitator"
                        v-model="facilitator"
                        required
                    />

                    <Alert :title="facilitatorError" />
                </div>
                <div class="col-md-6">
                    <label for="startDateInput" class="form-label is-required">
                        Start Date
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <input
                        type="date"
                        class="form-control"
                        id="startDateInput"
                        :class="{
                            border: startDateError,
                            'border-danger': startDateError,
                        }"
                        placeholder="Start Date"
                        v-model="startDate"
                        required
                    />

                    <Alert :title="startDateError" />
                </div>
                <div class="col-md-6">
                    <label for="endDateInput" class="form-label is-required">
                        End Date
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <input
                        type="date"
                        class="form-control"
                        id="endDateInput"
                        :class="{
                            border: endDateError,
                            'border-danger': endDateError,
                        }"
                        placeholder="End Date"
                        v-model="endDate"
                        required
                    />

                    <Alert :title="endDateError" />
                </div>
                <div class="col-md-6">
                    <label for="typeInput" class="form-label is-required">
                        Type
                        <span class="visually-hidden">(required)</span>
                    </label>
                    <select
                        class="form-select"
                        v-model="type"
                        :class="{
                            border: typeError,
                            'border-danger': typeError,
                        }"
                        aria-label="Select Event Type"
                        required
                    >
                        <option value="Course">Course</option>
                        <option value="Conference">Conference</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Excursion">Excursion</option>
                    </select>

                    <Alert :title="typeError" />
                </div>
                <div class="col-md-6"></div>
                <div class="col-md-6">
                    <label for="detailsTextarea" class="form-label"
                        >Details</label
                    >
                    <textarea
                        placeholder="Enter details..."
                        class="form-control"
                        id="detailsTextarea"
                        :class="{
                            border: detailsError,
                            'border-danger': detailsError,
                        }"
                        v-model="details"
                        rows="4"
                    ></textarea>

                    <Alert :title="detailsError" />
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
import { ref, defineProps, onMounted } from "vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import $ from "jquery";
import Modal from "../Modal.vue";
import Alert from "../Alert.vue";

const activeBreadCrumbs = ref([]);

// Event Creation Data
const title = ref("");
const facilitator = ref("");
const startDate = ref("");
const endDate = ref("");
const type = ref("");
const details = ref("");

// Modal Data
const successModalData = ref({
    title: "",
    status: "",
    message: "",
    pageLink: "",
});

// Error Alert Data
const titleError = ref("");
const facilitatorError = ref("");
const startDateError = ref("");
const endDateError = ref("");
const typeError = ref("");
const detailsError = ref("");

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});

activeBreadCrumbs.value = [...props.breadCrumbs, "add-event"];

async function postEvent() {
    const body = {
        title: title.value,
        facilitator: facilitator.value,
        start_date: startDate.value,
        end_date: endDate.value,
        type: type.value,
        details: details.value,
    };

    const modal = new boosted.Modal("#exampleModal");

    try {
        await $.post("http://localhost:3000/api/events/", body, (data) => {
            console.log("Data: ", data);

            // show modal
            modal.show(document.querySelector("#toggleMyModal"));

            // set modal data
            successModalData.value.message = data.message;
            successModalData.value.status = "success";
            successModalData.value.title = "Event Created";
            successModalData.value.pageLink = "/events/";

            visuallyHideModalBackdrop();
        });

        clearInputs();
        clearErrors();
    } catch (error) {
        console.log("Error creating event: ", error);
        clearErrors();
        displayErrorMessage(error.responseJSON.message);
    }
}

function visuallyHideModalBackdrop() {
    const modalsBackdrops = document.querySelectorAll(".modal-backdrop");

    if (modalsBackdrops.length) {
        modalsBackdrops.forEach((modal) =>
            modal.classList.add("visually-hidden")
        );
    }
}

function displayErrorMessage(msg) {
    const tmpMsg = msg.toLowerCase();

    if (tmpMsg.includes("title")) titleError.value = msg;
    else if (tmpMsg.includes("facilitator")) facilitatorError.value = msg;
    else if (tmpMsg.includes("start date")) startDateError.value = msg;
    else if (tmpMsg.includes("end date")) endDateError.value = msg;
    else if (tmpMsg.includes("type")) typeError.value = msg;
    else if (tmpMsg.includes("details")) detailsError.value = msg;
}

function clearInputs() {
    // clear inputs
    title.value = "";
    facilitator.value = "";
    startDate.value = "";
    endDate.value = "";
    type.value = "";
    details.value = "";

    document
        .querySelector(".needs-validation")
        .classList.remove("was-validated");
}

function clearErrors() {
    // clear errors
    titleError.value = "";
    facilitatorError.value = "";
    startDateError.value = "";
    endDateError.value = "";
    typeError.value = "";
    detailsError.value = "";
}

onMounted(() => {
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

#eventsWrapper {
    padding-top: 2rem;
    gap: 1.5rem;
}

@media (min-width: 768px) and (max-width: 1440px) {
    #eventsWrapper {
        padding: 1rem 3rem 0 3rem;
    }
}
</style>
