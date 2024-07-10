<template>
    <div id="search" class="col-md-5 p-0">
        <form class="row m-0" action="">
            <input
                type="search"
                class="form-control search"
                placeholder="Search ..."
                v-model="searchTerms"
                ref="inputEl"
            />
        </form>
    </div>
</template>

<style scoped></style>

<script setup>
const searchTerms = defineModel("search");
import { ref, onMounted } from "vue";

const inputEl = ref(null);

onMounted(() => {
    inputEl.value.addEventListener("keyup", handleKeyUp);
});

function handleKeyUp() {
    searchTerms.value = inputEl.value.value;
}
</script>
