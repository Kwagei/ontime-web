<template>
	<div>
		<nav aria-label="Page navigation example with icons">
			<ul class="pagination d-flex justify-content-end mt-0">
				<li class="page-item">
					<span
						@click="pagination"
						class="page-link"
						data-value="previous"
						aria-label="Previous"
					></span>
				</li>

				<li class="page-item" v-for="page in pages" :key="page">
					<span
						@click="pagination"
						:data-value="page"
						class="page-link"
						:class="page === activePage ? 'active' : ''"
					>
						{{ page }}
					</span>
				</li>

				<li class="page-item">
					<span
						@click="pagination"
						class="page-link"
						data-value="next"
						aria-label="Next"
					></span>
				</li>
			</ul>
		</nav>
	</div>
</template>

<style scoped>
.page-item {
	cursor: pointer;
}
</style>

<script setup>
import { ref, computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const activePage = ref(1);
const pages = ref(5);
const position = ref(0);
const rows = ref(10);
const start = defineModel();

const pagination = (event) => {
	const target = event.target;
	let page = target.dataset.value;

	switch (page) {
		case "next":
			page = ++position.value;
			break;
		case "previous":
			page = --position.value;
			break;
	}

	position.value = page;
	page = page < 0 ? 0 : page - 1;
	activePage.value = page + 1;

	start.value = +page * rows.value;
};
</script>
