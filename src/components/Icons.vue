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
const icon = defineModel("icon");
</script>

<style>
svg.solaris-icon {
    width: 1.875rem;
    height: 1.875rem;
}
</style>
