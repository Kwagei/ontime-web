<template>
    <div>
        <nav aria-label="Page navigation example with icons">
            <ul class="pagination d-flex justify-content-end mt-0">
                <li class="page-item">
                    <a class="page-link" href="#" aria-label="Previous"></a>
                </li>

                <li class="page-item" v-for="page in totalPages" :key="page">
                    <a
                        class="page-link"
                        :class="page === activePage ? 'active' : ''"
                        href="#"
                        >{{ page }}</a
                    >
                </li>

                <li class="page-item">
                    <a class="page-link" href="#" aria-label="Next"></a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style scoped></style>

<script setup>
import { ref, computed } from "vue";

const itemsPerPage = ref(10);
const totalItems = ref(18);
const activePage = ref(1);

const totalPages = computed(() => {
    const pages = Math.ceil(totalItems.value / itemsPerPage.value);
    return pages > 0 ? pages : 1;
});
</script>
