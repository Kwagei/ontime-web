<template>
    <div
        class="d-flex flex-column text-center h-100 w-100 justify-content-center align-items-center"
    >
        <img
            class="my-4"
            src="../assets/images/ontime_logo.jpg"
            draggable="false"
            width="200"
        />
        <h2>This is Our Landing Page!</h2>
        <h4>It will tell you all about our application.</h4>
        <div class="d-flex gap-2 justify-content-center w-100">
            <router-link :to="{ name: 'sign-in' }">
                <button class="btn btn-primary" style="min-width: 120px">
                    Sign In
                </button>
            </router-link>
            <router-link :to="{ name: 'dashboard' }">
                <button class="btn btn-primary">Dashboard</button>
            </router-link>
        </div>
    </div>
</template>

<script setup>
// code...
</script>

<style scoped>
/* code... */
</style>
