<template>
	<div
		data-v-b3773347=""
		id="visit-view"
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
								<h4 class="">visit Information</h4>
								<router-link
									:to="{
										name: 'edit-visit',
									}"
									v-model:visit-info="visitInfo"
								>
									<button
										type="button"
										class="edit-btn btn btn-secondary"
									>
										<svg
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
								<div class="visit-info">
									<ul>
										<li v-for="(v, key) in visitInfo">
											<!-- First name <br /> -->
											<div
												class="card-body"
												v-if="key !== 'id'"
											>
												<span>{{
													formatvisitInfo(key)
												}}</span
												>:

												<span
													class="card-text fw-bold"
													>{{ v }}</span
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

		
	</div>
</template>
<script setup>
import BreadCrumbs from "../BreadCrumbs.vue";


import { useRoute } from "vue-router";
import { getVisitWithVisits } from "@/assets/js/index"
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

const route = useRoute();

const id = ref(route.params.id);
const visitInfo = ref("");

const fetchvisit = async () => {
	const data = await getVisitWithVisits(id.value);
	visitInfo.value = data;
	return visitInfo;
};

console.log(visitInfo);



onMounted(async () => {
	await fetchvisit();
});

const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);

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

.visit-info {
	margin-top: 0.5rem;
}

.visit-info ul {
	list-style-type: none;
	padding: 0;
	margin: 0;
}

.visit-info li {
	margin-bottom: 0.5rem;
}

.visit-item {
	color: gray;
}

.edit-btn:hover {
	border: 2px solid black !important;
}

.edit-btn svg {
	width: 1.2rem;
	height: 1.2rem;
}

tr {
	cursor: pointer;
}

th,
td {
	padding: 0.9rem;
}
</style>
