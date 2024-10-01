<template>
    <svg
        style="margin-right: 0"
        class="solaris-icon"
        aria-hidden="true"
        focusable="false"
    >
        <use :href="`${path}#${icon}`" />
    </svg>
</template>

<script setup>
import path from "@/assets/svg/solaris-icons-sprite.svg";
import { onMounted } from "vue";
const icon = defineModel("icon");

const props = defineProps({
    width: String,
    height: String,
});

onMounted(() => {
    $("svg.solaris-icon").css({
        height: props.height || "1.875rem",
        width: props.width || "1.875rem",
    });
});
</script>

<style scoped></style>
