<template>
  <div id="visitor-view" class="d-flex flex-column container">
    <div class="d-flex justify-content-between align-items-center container p-0 mx-auto" style="margin-top: 0.3rem">
      <BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
    </div>

    <div class="mt-4 form-control input" style="margin: auto; padding: 3rem">
      <!-- Button trigger modal -->
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <!-- Modal -->
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title h5" id="exampleModalLabel">Modal title</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">...</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>

      <form class="row g-3 needs-validation" novalidate @submit.prevent="onSubmitNewVisit">
        <!-- NEW VISITOR -->
        <div class="col-md-6">
          <label for="validationCustomNewVisitor" class="form-label is-required">Visitor<span class="visually-hidden"> (required)</span></label>
          <div class="input-group has-validation">
            <input type="text" class="form-control" id="validationCustomNewVisitor" v-model="new_visitor" required />
            <div class="invalid-feedback">Please provide a visitor name.</div>
          </div>
        </div>

        <!-- Arrival Time -->
        <div class="col-md-6">
          <label for="validationCustomVisitorArrivalTime" class="form-label">Arrival Time</label>
          <input type="time" class="form-control" id="validationCustomVisitorArrivalTime" v-model="arrival_time" disabled />
        </div>

        <!-- PHONE NUMBER -->
        <div class="col-md-6">
          <label for="validationCustomVisitorNumber" class="form-label is-required">Phone number<span class="visually-hidden"> (required)</span></label>
          <div class="input-group has-validation">
            <input type="text" class="form-control" id="validationCustomVisitorNumber" v-model="msisdn" required />
            <div class="invalid-feedback">Please provide a valid phone number.</div>
          </div>
        </div>

        <!-- Departure Time -->
        <div class="col-md-6">
          <label for="validationCustomVisitorDepartureTime" class="form-label">Departure Time</label>
          <input type="time" class="form-control" id="validationCustomVisitorDepartureTime" v-model="departure_time" disabled />
        </div>

        <!-- Host -->
        <div class="col-md-6">
          <label for="validationCustomHost" class="form-label is-required">Host<span class="visually-hidden"> (required)</span></label>
          <div class="input-group has-validation">
            <input type="text" class="form-control" id="validationCustomHost" v-model="host_name" required />
            <div class="invalid-feedback">Please provide a host name.</div>
          </div>
        </div>

        <!-- Current Date -->
        <div class="col-md-6 has-validation">
          <label for="validationCustomCurrentDate" class="form-label">Date</label>
          <input type="date" class="form-control" id="validationCustomCurrentDate" v-model="date" required />
          <div class="invalid-feedback">Please provide the current date.</div>
        </div>

        <!-- Room -->
        <div class="col-md-6">
          <label for="validationCustomRoom" class="form-label is-required">Room<span class="visually-hidden"> (required)</span></label>
          <div class="input-group has-validation">
            <input type="text" class="form-control" id="validationCustomRoom" v-model="room_name" required />
            <div class="invalid-feedback">Please provide a room name.</div>
          </div>
        </div>

        <!-- Institution -->
        <div class="col-md-6 has-validation">
          <label for="validationCustomInstitution" class="form-label">Institution</label>
          <input type="text" class="form-control" id="validationCustomInstitution" v-model="institution" />
          <div class="invalid-feedback">Please provide an institution name.</div>
        </div>

        <!-- Belonging -->
        <div class="col-md-6">
          <label for="validationCustomBelonging" class="form-label is-required">Belonging<span class="visually-hidden"> (required)</span></label>
          <div class="input-group has-validation">
            <input type="text" class="form-control" id="validationCustomBelonging" v-model="belonging" required />
            <div class="invalid-feedback">Please provide a belonging.</div>
          </div>
        </div>

        <!-- Purpose -->
        <div class="col-12">
          <label for="validationCustomPurpose" class="form-label is-required">Purpose<span class="visually-hidden"> (required)</span></label>
          <div class="input-group has-validation">
            <textarea class="form-control" id="validationCustomPurpose" v-model="purpose" required></textarea>
            <div class="invalid-feedback">Please provide a purpose.</div>
          </div>
        </div>
        <div class="col-12">
          <button class="btn btn-primary mt-2" type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch } from "vue";
import BreadCrumbs from "../BreadCrumbs.vue";
import { registerVisit } from "@/assets/js/index.js";

const new_visitor = ref("");
const arrival_time = ref("");
const msisdn = ref("");
const departure_time = ref("");
const host_name = ref("");
const date = ref("");
const room_name = ref("");
const institution = ref("");
const purpose = ref("");
const belonging = ref("");

const emit = defineEmits(["visitFormSubmitted"]);

const onSubmitNewVisit = async () => {
  if (!new_visitor.value || !msisdn.value || !room_name.value || !belonging.value || !host_name.value || !purpose.value) {
    return;
  }

  const visit = {
    new_visitor: new_visitor.value,
    arrival_time: arrival_time.value,
    msisdn: msisdn.value,
    departure_time: departure_time.value,
    host_name: host_name.value,
    date: date.value,
    room_name: room_name.value,
    institution: institution.value,
    belonging: belonging.value,
    purpose: purpose.value,
  };

  try {
    const response = await registerVisit(visit);

    if (!response.ok) {
      console.error("Failed to register visit");
      return;
    }

    emit("visitFormSubmitted", visit);
    console.log(visit);
  } catch (error) {
    console.error("Error during visit registration:", error);
  }
};

const activeBreadCrumbs = ref([]);

const props = defineProps({
  breadCrumbs: {
    type: Array,
    required: true,
  },
});

activeBreadCrumbs.value = [...props.breadCrumbs, "new-visit"];

onMounted(() => {
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
.input {
  border: 0.0125rem solid #ccc;
  border-radius: 0.25rem !important;
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
