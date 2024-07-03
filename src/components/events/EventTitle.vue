<template>
    <div
        id="title"
        class="bg-supporting-purple title-bar w-100"
        data-bs-theme="light"
    >
        <div class="container-xxl">
            <h5 class="display-1 py-2">{{ title }}</h5>
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
@media (min-width: 1280px) {
}
</style>
