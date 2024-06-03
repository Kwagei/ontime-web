<template>
    <div id="search" class="col-md-5">
        <form action="">
            <input
                type="search"
                class="form-control search"
                id="first_name"
                placeholder="Search ..."
                v-model="searchTerms"
            />
        </form>
    </div>
</template>

<style scoped>
#search {
    padding: 0 !important;
}
</style>

<script setup>
import { ref, watch } from "vue";
const searchTerms = defineModel("term");
</script>
