<template>
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
            <form @submit.prevent="onSubmit" id="visit-form">
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label for="visitor" class="form-label is-required">Visitor <span class="visually-hidden">(required)</span></label>
                        <input
                            v-model="visitor"
                            type="text"
                            class="form-control"
                            id="visitor"
                            required
                        />
                    </div>
                    <div class="col-md-6">
                        <label for="arrival_time" class="form-label">Arrival Time</label>
                        <input
                            class="form-control"
                            type="text"
                            placeholder="readonly"
                            v-model="arrival_time"
                            aria-label="readonly input example"
                            id="arrival_time"
                            readonly
                            disabled
                        />
                    </div>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label for="new_visitor_contact" class="form-label is-required">
                            Contact<span class="visually-hidden">(required)</span>
                        </label>
                        <input
                            v-model="new_visitor_contact"
                            type="text"
                            class="form-control"
                            id="new_visitor_contact"
                            required
                        />
                    </div>
                    <div class="col-md-6">
                        <label for="departural_time" class="form-label">Departure Time</label>
                        <input
                            class="form-control"
                            type="text"
                            placeholder="readonly"
                            v-model="departural_time"
                            aria-label="readonly input example"
                            id="departural_time"
                            readonly
                            disabled
                        />
                    </div>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label for="visit_host" class="form-label is-required">
                            Host<span class="visually-hidden">(required)</span>
                        </label>
                        <input
                            v-model="host"
                            type="text"
                            class="form-control"
                            id="visit_host"
                            required
                        />
                    </div>
                    <div class="col-md-6">
                        <label for="date" class="form-label">Date</label>
                        <input
                            class="form-control"
                            type="date"
                            v-model="date"
                            aria-label="readonly input example"
                            id="date"
                            readonly
                            disabled
                        />
                    </div>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label for="visits_room" class="form-label is-required">Room <span class="visually-hidden">(required)</span></label>
                        <input
                            v-model="room"
                            type="text"
                            class="form-control"
                            id="visits_room"
                            required
                        />
                    </div>
                    <div class="col-md-6">
                        <label for="institution" class="form-label">Institution</label>
                        <input
                            v-model="institution"
                            type="text"
                            class="form-control"
                            id="institution"
                        />
                    </div>
                </div>
                <div class="col-md-12 mb-3">
                    <label for="purpose" class="form-label is-required">Purpose<span class="visually-hidden">(required)</span></label>
                    <textarea
                        v-model="purpose"
                        class="form-control"
                        name="purpose"
                        id="purpose"
                        required
                    ></textarea>
                </div>
                <div class="col-12">
                    <button class="btn btn-primary mt-2" id="save-visit-form" type="submit">
                        Save
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import BreadCrumbs from '../BreadCrumbs.vue';

const visitor = ref('');
const new_visitor_contact = ref('');
const arrival_time = ref('');
const departural_time = ref('');
const host = ref('');
const date = ref('');
const room = ref('');
const institution = ref('');
const purpose = ref('');

const emit = defineEmits(['visitFormSubmitted']);

const onSubmit = () => {
    const visits = {
        visitor: visitor.value,
        new_visitor_contact: new_visitor_contact.value,
        arrival_time: arrival_time.value,
        departural_time: departural_time.value,
        host: host.value,
        date: date.value,
        room: room.value,
        institution: institution.value,
        purpose: purpose.value,
    };
    console.log(visits);

    emit('visitFormSubmitted', visits);
};
</script>
