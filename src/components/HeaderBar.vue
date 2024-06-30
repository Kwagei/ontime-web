<template>
	<header class="bg-white">
		<nav class="navbar sticky-top container">
			<div
				class="container-fluid d-flex align-items-center justify-content-between"
			>
				<div class="navbar-brand">
					<h3 class="m-0 active-section">{{ activeSection }}</h3>
				</div>
				<div
					class="bg-dark rounded-circle p-1"
					style="width: 40px; height: 40px"
				>
					<img
						class="w-100 f-100"
						src="../assets/images/user.png"
						alt=""
					/>
				</div>
			</div>
		</nav>
	</header>
</template>

<script setup>
const props = defineProps({
	activeSection: {
		type: String,
		required: true,
	},
});
</script>

<style scoped>
header {
	position: sticky;
	top: 0;
	z-index: 2000;
}
.active-section {
	text-transform: capitalize !important;
}

/* @media (min-width: 768px) and (max-width: 1440px) {
	header {
		padding: 1rem 3rem 0 3rem;
	}
} */
</style>
