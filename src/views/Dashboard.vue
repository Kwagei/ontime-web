<template>
	<div class="">
		<div class="container text-center">
			<div class="row gap-2 mb-5">
				<div class="form-control col">
					<Line v-model:totalVisits="totalVisits" />
				</div>
				<div class="form-control col">.col .</div>

				<!-- Force next columns to break to new line at md breakpoint and up -->
				<div class="w-100 d-none d-md-block"></div>

				<div class="form-control col col">
					<Bar v-model:totalVisits="totalVisits" />
				</div>
				<div class="form-control col col">
					<Calender />
				</div>
			</div>

			<h4>Last 5 Check In</h4>
			<div class="row">
				<div class="col p-0">
					<VisitList
						v-model:lengthMenu="lengthMenu"
						v-model:recordsFiltered="recordsFiltered"
						v-model:totalVisits="totalVisits"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import Bar from "../components/dashboard/charts/Bar.vue";
import Line from "../components/dashboard/charts/Line.vue";
import Calender from "../components/dashboard/Calender.vue";

import VisitList from "@/components/visits/VisitList.vue";

const totalVisits = defineModel("totalVisits");
const lengthMenu = defineModel("recordsTotal");
const recordsFiltered = defineModel("recordsFiltered");
lengthMenu.value = [5];
recordsFiltered.value = 5;
</script>

<style>
.col {
	padding: 3rem;
}

h4 {
	text-align: left;
}
</style>
