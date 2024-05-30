<template>
    <div>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0">
                <li
                    class="breadcrumb-item"
                    v-for="(breadcrumb, index) in breadcrumbs"
                    :key="breadcrumb"
                    style="font-weight: 400"
                >
                    <template v-if="breadcrumbs[index + 1]">
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
import { ref, defineProps } from "vue";
import { RouterLink } from "vue-router";

const breadcrumbs = ref([]);

const props = defineProps({
    breadcrumbs: {
        type: Array,
        required: true,
    },
});
</script>
