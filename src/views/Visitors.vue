<template>
	<div id="visitor-view" class="d-flex flex-column container">
		<div
			class="d-flex justify-content-between align-items-center container p-0 mx-auto"
		>
			<BreadCrumbs :breadCrumbs="breadCrumbs" />

			<div class="d-flex" style="gap: 0.521rem">
				<RefreshList />
				<Options />

				<router-link :to="{ name: 'add-visitor' }">
					<button
						type="button"
						class="btn btn-primary"
						id="new-visitor"
						style="
							padding: 0.7rem 2rem !important;
							font-weight: 600;
						"
					>
						Add Visitor
					</button>
				</router-link>
			</div>
		</div>

		<VisitorList />
		<RouterView :breadCrumbs="breadCrumbs" />
	</div>
</template>

<script setup>
import BreadCrumbs from "../components/BreadCrumbs.vue";
import VisitorList from "../components/visitors/VisitorList.vue";
import RefreshList from "../components/RefreshList.vue";
import Options from "@/components/Options.vue";

import { RouterLink, RouterView } from "vue-router";

const breadCrumbs = defineModel("breadCrumbs");

// const props = defineProps({
//   breadCrumbs: {
//     type: Array,
//     required: true,
//   },
// });
</script>

<style scoped>
svg {
	height: 20px !important;
	margin: 0 !important;
}

#new-visitor:hover {
	color: white !important;
}

#visitor-view {
	padding-top: 2rem;
	gap: 1.5rem;
}

.btn {
	padding: 0.5rem !important;
}
.btn:hover {
	border: 0.125rem solid black !important;
}

.btn:hover g {
	fill: white;
}
.list-options svg {
	height: 20px !important;
	margin: 0 !important;
}

@media (min-width: 768px) and (max-width: 1440px) {
	#visitor-view {
		padding: 1rem 3rem 0 3rem;
	}
}
</style>
