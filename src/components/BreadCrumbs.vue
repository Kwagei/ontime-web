<template>
    <div>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
                <li
                    class="breadcrumb-item"
                    v-for="(breadcrumb, index) in breadCrumbs"
                    :key="breadcrumb"
                    style="font-weight: 600"
                >
                    <template v-if="breadCrumbs[index + 1]">
                        <router-link :to="`/${breadcrumb}`">
                            <span>{{ breadcrumb }}</span>
                        </router-link>
                    </template>
                    <span v-else>{{ breadcrumb }}</span>
                </li>
            </ol>
        </nav>
    </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { ref, defineProps } from "vue";

const props = defineProps({
    breadCrumbs: {
        type: Array,
        required: true,
    },
});
</script>

<style scoped>
.breadcrumb-item span {
    text-transform: capitalize;
}
</style>
