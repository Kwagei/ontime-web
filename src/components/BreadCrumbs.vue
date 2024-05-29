<template>
    <div>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
                <li
                    class="breadcrumb-item lead"
                    v-for="(breadcrumb, index) in breadcrumbs"
                    :key="breadcrumb"
                    style="padding: 0.8rem 0.5rem"
                >
                    <template v-if="breadcrumbs[index + 1]">
                        <router-link :to="`/${breadcrumb}`">
                            {{ breadcrumb }} >
                        </router-link>
                    </template>
                    <span v-else>{{ breadcrumb }}</span>
                </li>
            </ol>
        </nav>
    </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { RouterLink } from "vue-router";

const breadcrumbs = ["Visitors"];

const props = defineProps({
    breadcrumbs: {
        type: Array,
        required: true,
    },
});
</script>
