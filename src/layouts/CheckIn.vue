<template>
    <div class="d-flex flex-column gap-4 text-center mt-5">
        <div>
            <h1 class="text text-primary">Purpose</h1>
            <h3>Why are you here?</h3>
        </div>
        <div class="d-flex justify-content-center flex-wrap gap-4">
            <router-link :to="{ name: 'visit-event' }">
                <div
                    class="d-flex flex-column align-items-center justify-content-center p-3 checkInOption"
                    @click="router.push('/visits/visit-event')"
                >
                    <Icons
                        :height="'auto'"
                        :width="'75%'"
                        class="optionIcon"
                        icon="calendar-event-agenda"
                    />
                    <h2 class="text text-large">Event</h2>
                </div>
            </router-link>
            <router-link :to="{ name: 'visit-workspace' }">
                <div
                    class="d-flex flex-column align-items-center justify-content-center p-3 checkInOption"
                >
                    <Icons
                        :height="'auto'"
                        :width="'75%'"
                        class="optionIcon"
                        icon="briefcase"
                    />
                    <h2 class="text text-large">Workspace</h2>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import Icons from "../components/Icons.vue";
import { onMounted, getCurrentInstance } from "vue";

const router = useRouter();

// section loader flag
const $sectionIsLoading =
    getCurrentInstance().appContext.config.globalProperties.$sectionIsLoading;

onMounted(() => {
    // ensure section loader is not showing
    $sectionIsLoading.value = false;
});
</script>

<style scoped>
a {
    display: flex;
    align-items: center;
    border-radius: 15px;
    background-color: #eee;
    min-width: 175px;
    width: 15%;
    text-decoration: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

@media (min-width: 1251px) {
    a {
        min-height: 175px !important;
    }
}
</style>
