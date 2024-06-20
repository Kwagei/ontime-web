<template>
	<button
		class="btn btn-secondary list-options"
		style="border: 0.125rem solid black"
		type="button"
		data-bs-theme="dark"
	>
		<svg
			width="100"
			height="100"
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g fill="#000000" transform="scale(.1)">
				<circle cx="200" cy="500" r="100" />
				<circle cx="500" cy="500" r="100" />
				<circle cx="800" cy="500" r="100" />
			</g>
		</svg>
	</button>
</template>

<style scoped>
.btn:hover g {
	fill: white;
}
.list-options svg {
	height: 20px !important;
	margin: 0 !important;
}
</style>
