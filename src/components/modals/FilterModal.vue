<template>
	<AlertModal :data="modalData" />
	<div
		class="modal fade"
		id="filterModal"
		tabindex="-1"
		aria-labelledby="filterModalLabel"
		style="z-index: 2000"
	>
		<div
			class="modal-dialog modal-lg modal-dialog-centered"
			id="modal-dialog"
		>
			<div class="modal-content py-4 px-3 rounded">
				<div class="modal-header mb-3">
					<span class="fw-bold fs-5">Date Range</span>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						data-bs-placement="bottom"
						data-bs-title="Close"
					>
						<span class="visually-hidden">Close</span>
					</button>
				</div>
				<div class="modal-body">
					<form
						class="row g-3"
						@submit.prevent="$emit('done', { from, to })"
					>
						<div>
							<label for="from" class="form-label">From</label>
							<div class="input-group">
								<input
									type="date"
									class="form-control"
									id="from"
									aria-describedby="inputGroupPrepend"
									v-model="from"
								/>
							</div>
						</div>
						<div>
							<label for="to" class="form-label">To</label>
							<div class="input-group">
								<input
									type="date"
									class="form-control"
									id="to"
									aria-describedby="inputGroupPrepend"
									v-model="to"
								/>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button
						@click="$emit('done', { from, to })"
						class="btn btn-primary"
						data-bs-dismiss="modal"
						data-bs-placement="bottom"
						data-bs-title="Close"
					>
						Done
					</button>
					<button
						type="button"
						class="btn btn-outline-secondary"
						data-bs-dismiss="modal"
						@click="resetForm"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import AlertModal from "@/components/modals/AlertModal.vue";
import { showModal, validateFromAndToDate } from "@/assets/js/util";

import { ref, watch } from "vue";

const from = ref("");
const to = ref("");
const fromError = ref(false);
const toError = ref(false);

const emit = defineEmits(["done"]);

const modalData = ref({
	message: "",
	status: "danger",
});

// validate and update dates whenever they change
watch(
	() => [from.value, to.value],
	([newFrom, newTo]) => {
		// quit the values are empty
		if (!newFrom && !newTo) return;

		// ensure dates are valid
		if (newFrom && new Date(from.value) == "Invalid Date") {
			fromError.value = true;
			modalData.value.message = "Invalid From Date";
			// wait a bit for God knows why
			setTimeout(() => showModal(), 1000);
		}

		// ensure dates are valid
		if (newTo && new Date(newTo) == "Invalid Date") {
			toError.value = true;
			modalData.value.message = "Invalid To Date";
			// wait a bit for God knows why
			setTimeout(() => showModal(), 1000);
		}

		if (newFrom && newTo && !validateFromAndToDate(newFrom, newTo)) {
			modalData.value.message =
				"'From' date must be on or before 'To' date";
			setTimeout(() => showModal(), 500);
		}
	}
);

const resetForm = () => {
	from.value = "";
	to.value = "";
};
</script>

<style scoped>
.modal {
	background-color: #1616157a;
}
</style>
