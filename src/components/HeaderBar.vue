<template>
    <header class="bg-white">
        <nav class="navbar sticky-top container">
            <div
                id="headWrapper"
                class="d-flex align-items-center justify-content-between w-100 px-3 py-2"
            >
                <div
                    id="displaySidebarHamburger"
                    class="d-none p-2 border border-1"
                    style="
                        width: 45px;
                        height: 45px;
                        border-radius: 5px;
                        order: -1 !important;
                        cursor: pointer;
                    "
                >
                    <span class="navbar-toggler-icon"></span>
                </div>
                <div class="navbar-brand order-0">
                    <h3 class="m-0 active-section">
                        {{ activeSection.replace("-", " ") }}
                    </h3>
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
import { onMounted } from "vue";

const props = defineProps({
    activeSection: {
        type: String,
        required: true,
    },
});

onMounted(() => {
    $("#displaySidebarHamburger").on("click", (event) => {
        event.stopPropagation();

        $("#sideBar").css("display", "flex");
        $("#sideBar").css("z-index", "10000");
    });
});
</script>

<style scoped>
header {
    position: sticky;
    top: 0;
    z-index: 2000;
}

@media (max-width: 1250px) {
    #displaySidebarHamburger {
        display: inline-flex !important;
    }
}

@media (max-width: 770px) {
    #headWrapper {
        padding: 0.6rem 0 !important;
    }
}

.active-section {
    text-transform: capitalize !important;
}
</style>
