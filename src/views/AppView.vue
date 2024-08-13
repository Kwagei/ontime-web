<template>
	<div id="wrapper">
		<div class="d-flex gap-4 px-0" style="height: 100%">
			<aside class="flex-grow-0 bg-info">
				<SideBar
					v-model:activeSection="activeSection"
					v-model:breadCrumbs="breadCrumbs"
				/>
			</aside>
			<main class="flex-grow-1" style="background-color: #ececec">
				<HeaderBar class="" :activeSection="activeSection" />

				<section class="container">
					<RouterView :breadCrumbs="breadCrumbs" />
				</section>
			</main>
		</div>
	</div>
</template>

<script setup>
import SideBar from "../components/SideBar.vue";
import HeaderBar from "../components/HeaderBar.vue";

import { ref } from "vue";
import { RouterView } from "vue-router";

const activeSection = ref("");
const breadCrumbs = ref([]);
</script>

<style>
#wrapper {
	height: 100vh;
	width: 100vw;
}

/* Section Scrolling Media Query */
@media (min-width: 1700px) and (min-height: 920px) {
	#wrapper {
		position: fixed;
	}
}

aside {
	width: 20rem;
	height: 100vh;
	position: fixed;
	z-index: 1700;
}

main {
	margin-left: 20rem;
	overflow-y: scroll;
	overflow-x: hidden;
	padding-bottom: 3rem;
}

.modal-backdrop {
	display: none !important;
}

section {
	padding: 2rem 0;
}

@media (max-width: 1440px) {
	aside {
		width: 15rem;
	}

	main {
		margin-left: 15rem;
	}

	section {
		padding: 0 2rem !important;
	}

	header {
		padding: 0 1.275rem !important;
	}
}
</style>
