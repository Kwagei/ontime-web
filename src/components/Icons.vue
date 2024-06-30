<template>
	<svg class="solaris-icon" aria-hidden="true" focusable="false">
		<use :href="`/src/assets/svg/solaris-icons-sprite.svg#${icon}`" />
	</svg>
</template>

<script setup>
const icon = defineModel("icon");
</script>

<style>
svg.solaris-icon {
	width: 1.875rem;
	height: 1.875rem;
}
</style>
