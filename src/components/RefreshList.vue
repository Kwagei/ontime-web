<template>
	<button
		class="btn btn-secondary refresh"
		style="border: 0.125rem solid black"
		type="button"
		data-bs-theme="dark"
	>
		<Icons v-model:icon="reload" />
	</button>
</template>

<script setup>
import Icons from "@/components/Icons.vue";
const reload = "reload";
</script>

<style scoped>
.btn {
	padding: 0.5rem !important;
}
.btn:hover {
	border: 0.125rem solid black !important;
}

.btn:hover path {
	fill: white;
}
.refresh svg {
	height: 20px !important;
	margin: 0 !important;
}
</style>
