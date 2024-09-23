<template>
    <div
        id="title"
        class="bg-supporting-purple title-bar"
        data-bs-theme="light"
    >
        <div id="eventTitleImageWrapper" class="container-xxl">
            <h5 class="display-1 py-2 my-auto">{{ title }}</h5>
            <picture class="mt-3">
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
@media (max-width: 650px) {
    #eventTitleImageWrapper {
        flex-direction: column !important;
    }

    #eventTitleImageWrapper h5 {
        align-self: flex-start;
    }
}
</style>
