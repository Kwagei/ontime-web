<template>
	<button
		class="btn btn-secondary list-options"
		style="border: 0.125rem solid black"
		type="button"
		data-bs-theme="dark"
		data-bs-toggle="dropdown"
		aria-expanded="false"
	>
		<Icons v-model:icon="dots" />
	</button>
</template>

<script setup>
import Icons from "./Icons.vue";
const dots = "more-dots";
</script>

<style scoped>
.btn:hover g {
	fill: white;
}

.list-options {
	padding: 0.5rem;
}

.list-options svg {
	height: 20px !important;
	margin: 0 !important;
}
</style>
