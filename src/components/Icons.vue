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
        height: props.height || "20px",
        width: props.width || "20px",
    });
});
</script>

<style scoped></style>
