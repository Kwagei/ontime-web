<template>
	<div
		class="modal fade"
		id="deleteModal"
		tabindex="-1"
		aria-labelledby="deleteModalLabel"
		data-bs-backdrop="static"
		aria-hidden="true"
		style="z-index: 4000"
	>
		<div class="modal-dialog modal-lg modal-dialog-centered">
			<div class="modal-content rounded border-warning">
				<div class="modal-header">
					<div
						:class="`alert alert-warning mb-0`"
						style="border: none; padding-right: 0"
						role="alert"
					>
						<span class="alert-icon"></span>
					</div>
					<p class="mb-0">
						Are you sure you want to delete this user?
					</p>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						data-bs-toggle="tooltip"
						data-bs-placement="bottom"
						data-bs-title="Close"
					>
						<span class="visually-hidden">Close</span>
					</button>
				</div>

				<div class="modal-footer">
					<button class="btn btn-success" @click="$emit('delete')">
						Yes
					</button>
					<button
						class="btn btn-danger"
						data-bs-target="#exampleModalToggle2"
						data-bs-toggle="modal"
					>
						No
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const emit = defineEmits(["delete"]);
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
