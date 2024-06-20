<template>
    <div class="alert alert-danger alertWrapper" role="alert" v-if="title">
        <span class="alert-icon">
            <span class="visually-hidden">Error</span>
        </span>
        <p class="text-danger-emphasis">{{ title }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    title: { type: String, required: true },
});
</script>

<style scoped>
.alertWrapper {
    border: none !important;
    margin-bottom: -15px;
    padding-bottom: 0;
}
</style>
