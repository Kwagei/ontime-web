<template>
	<div
		class="col-md-1 sort bg-white d-flex justify-content-between"
		style="border: 0.125rem solid black"
	>
		<button
			class="btn btn-secondary w-100 d-flex gap-1"
			@click="toggleDirection"
			type="button"
			data-bs-theme="dark"
		>
			<span>Sort</span>
			<div class="d-flex flex-column justify-content-center">
				<Icons v-show="ascending" v-model:icon="ascendingSvg" />
				<Icons v-show="descending" v-model:icon="descendingSvg" />
			</div>
		</button>
	</div>
</template>

<script setup>
import { ref } from "vue";
const sortTerm = defineModel("term");
const directionTerm = defineModel("direction");
const ascending = ref(true);
const descending = ref(false);
import Icons from "@/components/Icons.vue";

const ascendingSvg = "form-triangle-up";
const descendingSvg = "form-triangle-down";

const updateSortTerm = (sort) => {
	sortTerm.value = sort.term;
	sortType.value = sort.type;
};

const toggleDirection = () => {
	directionTerm.value = directionTerm.value !== "asc" ? "asc" : "desc";
	ascending.value = !ascending.value;
	descending.value = !descending.value;
};
</script>

<style scoped>
button {
	padding: 0;
}

.dropdown-item {
	cursor: pointer;
}
.sort {
	padding: 0 !important;
}
.sort svg {
	margin: 0 !important;
}
</style>
