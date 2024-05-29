<template>
    <header>
        <nav class="navbar sticky-top">
            <div
                class="container-fluid d-flex align-items-center justify-content-between"
                style="padding-right: 3rem"
            >
                <div class="navbar-brand">
                    <h3 class="m-0 active-section">{{ activeSection }}</h3>
                </div>
                <div
                    class="bg-dark rounded-circle p-1"
                    style="width: 40px; height: 40px"
                >
                    <img
                        class="w-100 f-100"
                        src="../assets/images/user.png"
                        alt=""
                    />
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { ref, defineProps } from "vue";

const props = defineProps({
    activeSection: {
        type: String,
        required: true,
    },
});
</script>

<style scoped>
.active-section {
    text-transform: capitalize !important;
}
</style>
