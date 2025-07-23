<template>
    <div>
        <h4>Changes</h4>
        <div v-for="change in changes">
            <div>{{ change }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps(["changes"]);
const changes = ref(props.changes);
</script>

<style scoped>
/* code... */
</style>
