<template>
    <button id="list-options" class="hover-btn btn mx-2 bg-white">
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
#list-options {
    padding: 0.6rem 0.5rem;
    font-weight: 400;
    border: 0.0125rem solid #ccc;
    border-radius: 0.25rem !important;
}
svg {
    height: 20px !important;
    margin: 0 !important;
}
</style>
