<template>
	<section class="vh-100" style="background-color: #ececec">
		<div class="container py-5 h-100">
			<RouterView />
		</div>
	</section>
</template>

<script setup>
import { RouterView } from "vue-router";
</script>

<style>
.danger {
	color: #cd3c14 !important;
}
.success {
	color: #228722 !important;
}

.code-input {
	width: 4rem !important;
	height: 3.5rem;
}
</style>
