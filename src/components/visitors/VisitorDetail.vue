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
												v-if="
													key !== 'id' &&
													key !== 'middle_name' &&
													key !== 'created_at' &&
													key !== 'email'
												"
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

		<div>
			<table
				id="visitorVisitsTable"
				class="table table-striped w-100"
			></table>
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
	</div>
</template>
<script setup>
import BreadCrumbs from "../BreadCrumbs.vue";
import Icons from "../Icons.vue";

import DataTables from "datatables.net-dt";
import "datatables.net-responsive-dt";

import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import { RouterLink } from "vue-router";

const loader = ref(true);
const edit = "pencil";

const route = useRoute();
const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);

const id = ref(route.params.id);
const visitorInfo = ref("");
const dataTable = ref(null);

const formatVisitorInfo = (key) => {
	if (!key) return "";

	const v = key.split("_").join(" ");
	const formattedString = v.charAt(0).toUpperCase() + v.slice(1);

	return formattedString;
};

const initializeDataTable = () => {
	dataTable.value = new DataTables("#visitorVisitsTable", {
		serverSide: true,
		ajax: {
			url: `http://localhost:3000/api/visitors/${id.value}/visits`,
			type: "GET",
			data: (query) => {
				return {
					start: 0,
					limit: query.length,
					search: query.search.value,
					sort: "date_time",
					direction: query.order[0].dir,
				};
			},
			dataSrc: (json) => {
				let { visitor, visits } = json.data;
				visitorInfo.value = visitor;

				if (visits) {
					visits = formatDateTime(visits);
					loader.value = false;
					return visits;
				}
				loader.value = false;
			},
			error: (xhr, error, thrown) => {
				console.log("Error fetching data:", error);
			},
		},
		columns: [
			{ data: "date", title: "Date" },
			{ data: "arrival_time", title: "Arrival Time" },
			{ data: "departure_time", title: "Departure Time" },
			{ data: "purpose", title: "Purpose" },
			{ data: "items", title: "Items" },
		],
		responsive: true,
		lengthMenu: [10, 25, 50, 100],
		language: {
			searchPlaceholder: "Search ...",
			search: "",
		},
	});
};

onMounted(async () => {
	initializeDataTable();
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
