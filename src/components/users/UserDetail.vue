<template>
	<DeleteModal @delete="handleDeleteUser" />
	<AlertModal :data="alert" />

	<div id="user-view" class="d-flex flex-column container">
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
				<div class="col-md-8">
					<div class="input-group">
						<div class="form-control rounded" style="padding: 2rem">
							<div
								class="d-flex align-items-start"
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
								<div class="user-info">
									<div>
										<h4 class="m-0">
											{{ userInfo.username }}
										</h4>
									</div>
									<div v-if="userInfo.address">
										<Icons
											class="icons"
											v-model:icon="locationIcon"
										/>
										<span class="user-item">
											{{ userInfo.address }}
										</span>
									</div>
									<div
										v-if="userInfo.email"
										class="d-flex gap-3"
									>
										<div>
											<Icons
												class="icons"
												v-model:icon="emailIcon"
											/>
											<span class="user-item">
												{{ userInfo.email }}
											</span>
										</div>

										<div>
											<Icons
												class="icons"
												v-model:icon="phoneIcon"
											/>
											<span class="user-item">
												{{
													`0${userInfo.msisdn[0].slice(
														3
													)}`
												}}
											</span>
										</div>
									</div>
									<div
										v-if="userInfo.email"
										class="d-flex gap-3"
									>
										<div>
											<Icons
												class="icons"
												v-model:icon="genderIcon"
											/>
											<span
												class="user-item"
												style="
													text-transform: capitalize;
												"
											>
												{{ userInfo.gender }}
											</span>
										</div>

										<div>
											<Icons
												class="icons"
												v-model:icon="roleIcon"
											/>
											<span
												style="
													text-transform: capitalize;
												"
												class="user-item"
											>
												{{ userInfo.roles[0] }}
											</span>
										</div>
									</div>
								</div>
								<div
									class="d-flex gap-2"
									style="margin-left: auto"
								>
									<router-link
										:to="{
											name: 'edit-user',
										}"
										v-model:user-info="userInfo"
									>
										<button
											type="button"
											class="btn btn-outline-secondary"
											style="
												--bs-btn-font-size: 0.75rem;
												padding: 0.25rem 2rem;
											"
										>
											<Icons
												class="icons"
												v-model:icon="editIcon"
											/>
										</button>
									</router-link>
									<button
										type="button"
										class="btn btn-outline-secondary"
										style="
											--bs-btn-font-size: 0.75rem;
											padding: 0.25rem 2rem;
										"
										@click="displayFilterModal"
									>
										<Icons
											class="icons"
											v-model:icon="deleteIcon"
										/>
									</button>
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
import Icons from "../Icons.vue";
import { deleteUser, getSingleUser } from "@/assets/js";
import { useRouter } from "vue-router";

import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import DeleteModal from "../modals/DeleteModal.vue";
import { getElement, removeClass, showModal } from "@/util/util.js";
import AlertModal from "../modals/AlertModal.vue";

const route = useRoute();

const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);
const refresh = defineModel("refresh");

const id = ref(route.params.id);
const userInfo = ref("");
const router = useRouter();

const locationIcon = "mahali";
const emailIcon = "email";
const genderIcon = "adult";
const phoneIcon = "device-smartphone";
const editIcon = "pencil";
const deleteIcon = "delete";
const roleIcon = "administrator";

// Modal Data
const alert = ref({
	status: "",
	title: "",
	message: "",
	pageLink: "",
});

const fetchUser = async () => {
	const [user] = await getSingleUser({ id: id.value });
	userInfo.value = user;
};

const displayFilterModal = () => {
	showModal("#deleteModal", "#modal-dialog");
};

const handleDeleteUser = async () => {
	const response = await deleteUser(id.value);

	getElement("body").removeAttribute("style");

	showModal("#alertModal", "#alertModalBody");
	alert.value.status = response.ok ? "success" : "danger";
	alert.value.message = response.result.message;

	if (response.ok) {
		const deleteModal = getElement("#deleteModal");
		removeClass(deleteModal, "show");
		deleteModal.style.display = "none";

		setTimeout(() => {
			router.push("/users");
		}, 2000);
	}
};

onMounted(async () => {
	await fetchUser();
});
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
	border-radius: 0.5rem;
	overflow: hidden;
}

.profile-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.user-info {
	margin-top: 0.5rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
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

.icons {
	width: 1.3rem;
	height: 1rem !important;
}

.user-item {
	font-weight: 400;
	font-size: small;
}
</style>
