<template>
  <div id="visit-view" class="d-flex flex-column container">
    <div
      class="d-flex justify-content-between align-items-center container p-0 mx-auto"
      style="margin-top: 0.3rem"
    >
      <BreadCrumbs />
    </div>

    <div
      class="mt-4 form-control input"
      style="margin: auto; padding: 3rem; width: 80%"
    >
      <form class="row g-3 needs-validation" novalidate @submit.prevent="onSubmit">
        <!-- Visitor Information -->
        <div class="col-md-6">
          <label for="visit" class="form-label is-required">Visitor</label>
          <input
            type="text"
            class="form-control"
            id="visit"
            v-model="visit"
            required
          />
        </div>
        <div class="col-md-6">
          <label for="arrival_time" class="form-label">Arrival Time</label>
          <input
            type="text"
            class="form-control"
            id="arrival_time"
            placeholder="Readonly"
            v-model="arrival_time"
            disabled
          />
        </div>

        <!-- Contact Information -->
        <div class="col-md-6">
          <label for="visit_contact" class="form-label is-required">Contact</label>
          <input
            type="text"
            class="form-control"
            id="visit_contact"
            v-model="visit_contact"
            required
          />
        </div>
        <div class="col-md-6">
          <label for="departural_time" class="form-label">Departure Time</label>
          <input
            type="text"
            class="form-control"
            id="departural_time"
            placeholder="Readonly"
            v-model="departural_time"
            disabled
          />
        </div>

        <!-- Host and Date Selection -->
        <div class="col-md-6">
          <label for="visit_host" class="form-label is-required">Host</label>
          <button
            type="button"
            class="form-control btn btn-dropdown dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            id="visit_host"
          >
            Select Host
          </button>
          <!-- Dropdown Menu for Host -->
          <ul class="dropdown-menu dropdown-menu-end">
            <li><button class="dropdown-item" type="button">Action</button></li>
            <li><button class="dropdown-item" type="button">Another action</button></li>
            <li><button class="dropdown-item" type="button">Something else here</button></li>
          </ul>
        </div>
        <div class="col-md-6">
          <label for="date" class="form-label">Date</label>
          <input
            type="date"
            class="form-control"
            id="date"
            v-model="date"
            disabled
          />
        </div>

        <!-- Room and Institution -->
        <div class="col-md-6">
          <label for="visit_room" class="form-label is-required">Room</label>
          <button
            type="button"
            class="form-control btn btn-dropdown dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            id="visit_room"
          >
            Select Room
          </button>
          <!-- Dropdown Menu for Room -->
          <ul class="dropdown-menu dropdown-menu-end">
            <li><button class="dropdown-item" type="button">Action</button></li>
            <li><button class="dropdown-item" type="button">Another action</button></li>
            <li><button class="dropdown-item" type="button">Something else here</button></li>
          </ul>
        </div>
        <div class="col-md-6">
          <label for="institution" class="form-label">Institution</label>
          <input
            type="text"
            class="form-control"
            id="visit_institution"
            v-model="institution"
          />
        </div>

        <!-- Belongings and Purpose -->
        <div class="col-md-6">
          <label for="belonging" class="form-label is-required">Belonging</label>
          <input
            type="text"
            class="form-control"
            id="visit_belonging"
            v-model="belonging"
            required
          />
        </div>
        <div class="col-md-12">
          <label for="purpose" class="form-label is-required">Purpose</label>
          <textarea
            class="form-control"
            id="purpose"
            v-model="purpose"
            required
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="col-12">
          <button class="btn btn-primary mt-2" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import BreadCrumbs from '../BreadCrumbs.vue';

const visit = ref('');
const visit_contact = ref('');
const arrival_time = ref('');
const departural_time = ref('');
const host = ref('');
const date = ref('');
const room = ref('');
const institution = ref('');
const belonging = ref('');
const purpose = ref('');

const emit = defineEmits(['visitFormSubmitted']);

const onSubmit = () => {
  const visits = {
    visit: visit.value,
    visit_contact: visit_contact.value,
    arrival_time: arrival_time.value,
    departural_time: departural_time.value,
    host: host.value,
    date: date.value,
    room: room.value,
    institution: institution.value,
    belonging: belonging.value,
    purpose: purpose.value,
  };

  emit('visitFormSubmitted', visits);
  console.log(visits);
};
</script>

<style scoped>
.input {
  border: 0.0125rem solid #ccc;
  border-radius: 0.25rem !important;
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
