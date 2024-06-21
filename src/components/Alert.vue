<template>
    <div id="alertWrapper" class="alert alert-danger" role="alert" v-if="title">
        <span
            class="text-danger-emphasis"
            style="font-weight: 800; margin-bottom: 12px; margin-top: -8px"
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
