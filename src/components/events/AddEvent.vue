<template>
    <div id="eventsWrapper">
        <div class="d-flex justify-content-between">
            <div>
                <BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
            </div>
            <div>
                <button
                    @click="postEvent"
                    class="border-primary btn btn-primary px-5 py-2"
                    type="submit"
                >
                    Submit
                </button>
            </div>
        </div>
        <form @submit="postEvent" id="eventsFormWrapper" class="my-4 p-5">
            <div>
                <label for="titleInput" class="form-label is-required">
                    Title
                    <span class="visually-hidden">(required)</span>
                </label>
                <input
                    type="text"
                    class="form-control"
                    id="titleInput"
                    placeholder="Title"
                    v-model="title"
                    required
                />
            </div>
            <div>
                <label for="facilitatorInput" class="form-label is-required">
                    Facilitator
                    <span class="visually-hidden">(required)</span>
                </label>
                <input
                    type="text"
                    class="form-control"
                    id="facilitatorInput"
                    placeholder="Facilitator"
                    v-model="facilitator"
                    required
                />
            </div>
            <div>
                <label for="startDateInput" class="form-label is-required">
                    Start Date
                    <span class="visually-hidden">(required)</span>
                </label>
                <input
                    type="date"
                    class="form-control"
                    id="startDateInput"
                    placeholder="Start Date"
                    v-model="startDate"
                    required
                />
            </div>
            <div>
                <label for="endDateInput" class="form-label is-required">
                    End Date
                    <span class="visually-hidden">(required)</span>
                </label>
                <input
                    type="date"
                    class="form-control"
                    id="endDateInput"
                    placeholder="End Date"
                    v-model="endDate"
                    required
                />
            </div>
            <div>
                <label for="typeInput" class="form-label is-required">
                    Type
                    <span class="visually-hidden">(required)</span>
                </label>
                <select
                    class="form-select"
                    v-model="type"
                    aria-label="Select Event Type"
                    required
                >
                    <option value="Select Event Type...">
                        Select Event Type...
                    </option>
                    <option value="Course">Course</option>
                    <option value="Conference">Conference</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Excursion">Excursion</option>
                </select>
            </div>
            <div>
                <label for="detailsTextarea" class="form-label">Details</label>
                <textarea
                    placeholder="Enter details..."
                    class="form-control"
                    id="detailsTextarea"
                    v-model="details"
                    rows="4"
                    required
                ></textarea>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import $ from "jquery";

const activeBreadCrumbs = ref([]);

// Event Creation Data
const title = ref("");
const facilitator = ref("");
const startDate = ref("");
const endDate = ref("");
const type = ref("Select Event Type...");
const details = ref("");

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

    try {
        await $.post(
            "http://localhost:3000/api/events/",
            body,
            (data, status) => {
                console.log("Status: ", status);
                console.log("Data: ", data);
                alert(data.message, data.data);
            }
        );

        clearInputs();
    } catch (error) {
        console.log("Error creating event: ", error);
        alert(error.responseJSON.message);
    }
}

function clearInputs() {
    title.value = "";
    facilitator.value = "";
    startDate.value = "";
    endDate.value = "";
    type.value = "Select Event Type...";
    details.value = "";
}
</script>

<style>
#eventsWrapper {
    margin: 50px 125px;
}

#eventsFormWrapper {
    outline: 1px solid #aaa;
    border-radius: 5px;
    display: grid;
    grid-template-columns: repeat(2, 0.5fr);
    gap: 30px;
    background-color: #fff;
}
</style>
