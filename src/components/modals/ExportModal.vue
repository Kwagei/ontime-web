<template>
	<div
		class="modal fade"
		id="exportModal"
		tabindex="-1"
		aria-labelledby="exportModalLabel"
		style="z-index: 2000"
	>
		<div
			class="modal-dialog modal-lg modal-dialog-centered"
			id="modal-dialog"
		>
			<div class="modal-content py-4 px-3 rounded">
				<div class="modal-header mb-3">
					<span class="fw-bold fs-5">Export {{ exportTitle }}</span>
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
					<form class="row g-3">
						<div class="col-md-6 mb-3">
							<input
								class="form-check-input mx-2"
								type="checkbox"
								name="selectAll"
								id="selectAll"
								:checked="allSelected"
								@change="selectAll"
							/>
							<label class="form-check-label" for="keepLoggedIn">
								All
							</label>
						</div>

						<div class="row">
							<h5 style="font-weight: 400">Select Fields:</h5>
							<div
								class="col-md-6"
								v-for="(field, index) in exportFields"
								:key="index"
							>
								<input
									class="form-check-input mx-2"
									type="checkbox"
									:id="
										field.name
											.split(' ')
											.join('_')
											.toLowerCase()
									"
									v-model="field.selected"
								/>
								<label
									class="form-check-label"
									for="keepLoggedIn"
								>
									{{ field.name }}
								</label>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button
						@click="getSelectedFields"
						class="btn btn-primary"
						data-bs-dismiss="modal"
						data-bs-placement="bottom"
						data-bs-title="Close"
						:disabled="!someSelected"
					>
						Export
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
import { computed, ref, watch } from "vue";

const from = ref("");
const to = ref("");
const fromError = ref(false);
const toError = ref(false);
const emit = defineEmits(["export"]);

const exportFields = defineModel("exportFields");
const exportTitle = defineModel("exportTitle");

const props = defineProps({
	type: Array,
	required: true,
});

const allSelected = computed({
	get() {
		return exportFields.value.every((field) => field.selected);
	},
	set(value) {
		exportFields.value.forEach((field) => {
			field.selected = value;
		});
	},
});

const someSelected = computed(() => {
	return exportFields.value.some((field) => field.selected);
});

const selectAll = (event) => {
	allSelected.value = event.target.checked;
};

const getSelectedFields = () => {
	const selectedFields = exportFields.value
		.filter((field) => field.selected)
		.map((field) => field.name.split(" ").join("_").toLowerCase());
	emit("export", selectedFields);
};
</script>

<style scoped>
.modal {
	background-color: #1616157a;
}

label {
	font-weight: 400;
}

.col-md-6 {
	padding: 0.5rem;
}
</style>
