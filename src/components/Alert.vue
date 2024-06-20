<template>
    <div class="alert alert-danger alertWrapper" role="alert" v-if="title">
        <span
            class="text-danger-emphasis"
            style="font-weight: 800; margin-top: -10px; margin-bottom: 12px"
        >
            {{ title }}
        </span>
    </div>
</template>

<script setup>
const props = defineProps({
	title: { type: String, required: true },
});
</script>

<style scoped>
#alertWrapper {
    border: none !important;
    margin-bottom: -15px;
    padding-bottom: 0;
}
</style>
