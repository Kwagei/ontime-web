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
				<HeaderBar :activeSection="activeSection" />

				<section class="">
					<RouterView :breadCrumbs="breadCrumbs" />
				</section>
			</main>
		</div>
	</div>
</template>

<script setup>
import SideBar from "./components/SideBar.vue";
import HeaderBar from "./components/HeaderBar.vue";

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
	padding-bottom: 3rem;
}

.modal-backdrop {
	display: none !important;
}

@media (max-width: 1440px) {
	aside {
		width: 15rem;
	}

	main {
		margin-left: 15rem;
	}
}
</style>
