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
			<BreadCrumbs v-model:breadCrumbs="breadCrumbs" />
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
							<div
								class="d-flex justify-content-between align-items-center"
							>
								<h4 class="m-0">Visitor Information</h4>
								<router-link
									:to="{
										name: 'edit-visitor',
									}"
									v-model:visitor-info="visitorInfo"
								>
									<button
										class="btn btn-secondary editBtn"
										style="border: 0.125rem solid black"
										type="button"
										data-bs-theme="dark"
									>
										<Icons v-model:icon="edit" />
									</button>
								</router-link>
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
										<li v-for="(info, key) in visitorInfo">
											<!-- First name <br /> -->
											<div
												class="card-body"
												v-if="key !== 'id'"
											>
												<span>{{
													formatVisitorInfo(key)
												}}</span
												>:

												<span
													class="card-text fw-bold"
													>{{ info }}</span
												>
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

		<div class="row justify-content-between container p-0 my-4 mx-auto">
			<Search v-model:search="searchTerms" />
			<!-- <Filter /> -->
			<Sort v-model:term="sortTerm" v-model:direction="directionTerm" />
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
								<label
									class="form-check-label"
									for="customCheck"
								>
									<span class="visually-hidden"
										>Select all</span
									>
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
			<div
				id="spinner"
				v-if="loader"
				class="d-flex justify-content-center p-4"
			>
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
import Sort from "../Sort.vue";
import Icons from "../Icons.vue";

import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import { RouterLink } from "vue-router";

import { getVisitorWithVisits } from "../../assets/js/index";

const start = ref(0);
const limit = ref(20);
const loader = ref(true);
const sort = ref("");
const edit = "pencil";

const searchTerms = ref("");

const sortTerm = defineModel("term");
sortTerm.value = "date_time";
const directionTerm = defineModel("direction");
directionTerm.value = "desc";

const route = useRoute();
const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);
console.log(breadCrumbs.value);

const id = ref(route.params.id);
const visitorInfo = ref("");
const visitsInfo = ref("");
let visitorData = "";

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

	if (!data) {
		loader.value = false;
		return;
	}

	const { visitor, visits } = data;
	visitorData = visitor;
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

.btn {
	padding: 0.5rem !important;
}
.btn:hover {
	border: 0.125rem solid black !important;
}

.btn:hover path {
	fill: white;
}
.editBtn svg {
	height: 1.5rem !important;
	margin: 0 !important;
}
</style>
