<template>
	<div
		class="modal fade"
		id="alertModal"
		tabindex="-1"
		aria-labelledby="alertModalLabel"
		data-bs-backdrop="static"
		aria-hidden="true"
		style="z-index: 4000"
	>
		<div class="modal-dialog modal-lg" id="alertModalBody">
			<div :class="`modal-content py-1 border-${data.status}`">
				<div class="modal-header">
					<div
						:class="`alert alert-${data.status} mb-0`"
						style="border: none; padding-right: 0"
						role="alert"
					>
						<span class="alert-icon"></span>
					</div>
					<p class="mb-0">
						{{ data.message }}
					</p>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						data-bs-toggle="tooltip"
						data-bs-placement="bottom"
						data-bs-title="Close"
						style="margin-left: auto"
					>
						<span class="visually-hidden">Close</span>
					</button>
				</div>
				<div
					v-if="data.pageLink"
					class="modal-body py-0 d-flex justify-content-between align-items-center"
				>
					<!-- Router Link only works if the route is differentso the -->
					<!-- `handleIdenticalRoute` function will reload the page if the -->
					<!-- route is identical -->
					<router-link
						@click="handleIdenticalRoute"
						v-if="data.pageLink"
						:to="data.pageLink"
					>
						<button type="button" class="btn btn-link">View</button>
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const props = defineProps({
	data: { type: Object, required: true },
});

function handleIdenticalRoute() {
	// reload the page if the new route and
	// the current route are identical
	if (props.data.pageLink == route.fullPath) router.go(0);

	// otherwise do nothing
}
</script>

<style scoped>
.modal {
	background-color: #00000094 !important;
}

a.router-link-active {
	font-size: small;
	font-weight: 400;
}

a.router-link-active:hover {
	color: #ff7900 !important;
}

.view {
	font-weight: 400;
	font-size: small;
}
</style>
