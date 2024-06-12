<template>
  <div
    data-v-b3773347=""
    id="visitor-view"
    class="d-flex flex-column container"
  >
    <div
      class="d-flex justify-content-between align-items-center container p-0 mx-auto"
      style="margin-top: 0.3rem"
    >
      <BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
    </div>
    <div
      class="mt-4 form-control"
      style="
        margin: auto;
        padding: 0 !important;
        border: none;
        background-color: transparent;
      "
    >
      <div class="row g-3">
        <div class="col-md-6">
          <div class="input-group">
            <div class="form-control" style="padding: 2rem">
              <div class="d-flex justify-content-between align-items-center">
                <h4 class="">Visitor Information</h4>
                <button type="button" class="btn btn-outline-secondary">
                  <svg
                    width=".5rem"
                    height=".5rem"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                    class="me-1"
                  >
                    <use
                      xlink:href="../../assets/svg/solaris-icons-sprite.svg#pencil"
                    />
                  </svg>
                  Edit
                </button>
              </div>
              <div
                class="d-flex align-items-center"
                style="gap: 1.5rem; padding-top: 1rem"
              >
                <div>
                  <div class="profile-container">
                    <img
                      src="../../assets/images/user.png"
                      alt="User"
                      class="profile-image"
                    />
                  </div>
                </div>
                <div class="visitor-info">
                  <ul>
                    <li v-for="(v, key) in visitorInfo">
                      <!-- First name <br /> -->
                      <div class="card-body" v-if="key !== 'id'">
                        <span>{{ formatVisitorInfo(key) }}</span
                        >:

                        <span class="card-text fw-bold">{{ v }}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="input-group"></div>
        </div>
      </div>
    </div>

    <div class="row justify-content-between container p-0 mx-auto">
      <Search v-model:search="searchTerms" />
      <Filter />
      <Sort
        :sortTerms="sortTerms"
        v-model:term="sortTerm"
        v-model:direction="directionTerm"
      />
    </div>

    <div class="table-responsive container p-0">
      <table class="table table-sm table-hover has-checkbox">
        <thead>
          <tr>
            <th scope="col">
              <div class="form-check mb-0">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="customCheck"
                />
                <label class="form-check-label" for="customCheck">
                  <span class="visually-hidden">Select all</span>
                </label>
              </div>
            </th>
            <th scope="col">Date</th>
            <th scope="col">Arrival Time</th>
            <th scope="col">Departure Time</th>
            <th scope="col">Purpose</th>
            <th scope="col">Items</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="visit in visitsInfo">
            <td>
              <div class="form-check mb-0">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="customCheck3"
                  @click.stop
                />
              </div>
            </td>
            <td>{{ visit.date }}</td>
            <td>{{ visit.arrival_time }}</td>
            <td>{{ visit.departure_time }}</td>
            <td>{{ visit.purpose }}</td>
            <td>{{ visit.items }}</td>
          </tr>
        </tbody>
      </table>
      <div id="spinner" v-if="loader" class="d-flex justify-content-center p-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <Pagination v-model="start" />
  </div>
</template>
<script setup>
import BreadCrumbs from "../BreadCrumbs.vue";
import Pagination from "../Pagination.vue";
import Search from "../Search.vue";
import Filter from "../Filter.vue";
import Sort from "../Sort.vue";

import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import { getVisitorWithVisits } from "../../assets/js/index";

const start = ref(0);
const limit = ref(20);
const loader = ref(true);
const sort = ref("");

const activeBreadCrumbs = ref([]);

const props = defineProps({
  breadCrumbs: {
    type: Array,
    required: true,
  },
});

const searchTerms = ref("");
const sortTerms = ref([
  { type: "Date", term: "date_time" },
  { type: "Arrival Time", term: "date_time" },
  { type: "Departure Time", term: "date_time" },
  { type: "Purpose", term: "purpose" },
  { type: "Items", term: "items" },
]);

const sortTerm = defineModel("term");
sortTerm.value = "created_at";
const directionTerm = defineModel("direction");
directionTerm.value = "desc";

const route = useRoute();

const id = ref(route.params.id);
const visitorInfo = ref("");
const visitsInfo = ref("");

watch(
  () => [searchTerms.value, sortTerm.value, directionTerm.value, start.value],
  async ([searchValue, sortValue, directionValue, startValue]) => {
    const data = await getVisitorWithVisits(id.value, {
      start: startValue,
      search: searchValue,
      sort: sortValue,
      direction: directionValue,
      limit: limit.value,
    });
    const { visits } = data;
    visitsInfo.value = formatDateTime(visits);
  }
);

const fetchVisitor = async () => {
  const data = await getVisitorWithVisits(id.value, {
    start: start.value,
    sort: sort.value,
    limit: limit.value,
  });
  const { visitor, visits } = data;
  visitorInfo.value = {
    name: `${visitor.first_name} ${visitor?.middle_name || ""} ${
      visitor.last_name
    }`,
    phone_number: visitor.msisdn,
    email: visitor.email,
    created: visitor.created_at.split("T")[0],
  };

  if (visits.length) {
    loader.value = false;
  } else if (!visits.length) loader.value = false;
  visitsInfo.value = formatDateTime(visits);

  activeBreadCrumbs.value = [...props.breadCrumbs, visitor.id];
};

const formatVisitorInfo = (key) => {
  if (!key) return "";

  const v = key.split("_").join(" ");
  const formattedString = v.charAt(0).toUpperCase() + v.slice(1);

  return formattedString;
};

onMounted(async () => {
  await fetchVisitor();
});

const formatDateTime = (visits) => {
  return visits.map((visit) => {
    if (visit.date_time) {
      const [date, time] = visit.date_time.split("T");
      const arrival_time = time.split(".")[0];
      visit.items = visit.items ? visit.items.join(", ") : "";
      delete visit.date_time;
      return { ...visit, date, arrival_time };
    } else {
      return visit;
    }
  });
};

const visitDetail = () => {};
</script>

<style scoped>
.profile-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8rem;
  height: 8rem;
  padding: 0.5rem;
  background-color: black;
  border-radius: 50%;
  overflow: hidden;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.visitor-info {
  margin-top: 0.5rem;
}

.visitor-info ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.visitor-info li {
  margin-bottom: 0.5rem;
}

.visitor-item {
  color: gray;
}
</style>
