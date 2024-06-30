<template>
	<div class="bg-supporting-purple title-bar w-100" data-bs-theme="light">
		<div class="container">
			<h5 class="display-3">{{ title }}</h5>
			<picture>
				<img src="../../assets/images/eventTitleBackdrop.png" />
			</picture>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	title: {
		type: String,
		required: true,
	},
});
</script>

<style scoped>
/* code... */
</style>
