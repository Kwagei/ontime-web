<template>
    <div class="d-flex flex-column gap-4 text-center">
        <div
            id="checkInTypeWrapper"
            class="d-flex justify-content-center gap-0"
        >
            <router-link to="/check-in">
                <button class="checkInTypeBtn activeCheckInTypeBtn">
                    Visitor
                </button>
            </router-link>
            <router-link to="/check-in/employee">
                <button class="checkInTypeBtn">Employee</button>
            </router-link>
        </div>
        <div>
            <h1 class="text text-primary">Purpose</h1>
            <h3>Why are you here?</h3>
        </div>
        <div
            class="d-flex px-2 justify-content-center flex-wrap align-items-center gap-4"
        >
            <!-- Event -->
            <div
                class="d-flex flex-column align-items-center justify-content-center p-3 checkInOption"
                @click="router.push('/check-in/purpose-event')"
            >
                <Icons
                    :height="'auto'"
                    :width="'80%'"
                    class="optionIcon"
                    icon="calendar-event-agenda"
                />
                <h2 class="text text-large">Event</h2>
            </div>
            <!-- Meeting -->
            <div
                class="d-flex flex-column align-items-center justify-content-center p-3 checkInOption"
                @click="router.push('/check-in/purpose-meeting')"
            >
                <Icons
                    :height="'auto'"
                    :width="'80%'"
                    class="optionIcon"
                    icon="collective-class-training"
                />
                <h2 class="text text-large">Meeting</h2>
            </div>
            <!-- Workspace -->
            <div
                class="d-flex flex-column align-items-center justify-content-center p-3 checkInOption"
                @click="router.push('/check-in/purpose-workspace')"
            >
                <Icons
                    :height="'auto'"
                    :width="'80%'"
                    class="optionIcon"
                    icon="briefcase"
                />
                <h2 class="text text-large">Workspace</h2>
            </div>
        </div>
    </div>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";
import Icons from "../components/Icons.vue";
import { onMounted, getCurrentInstance } from "vue";
import { hideSidebarOnSmallScreen } from "@/util/util";

const router = useRouter();

// section loader flag
const $sectionIsLoading =
    getCurrentInstance().appContext.config.globalProperties.$sectionIsLoading;

onMounted(() => {
    // ensure section loader is not showing
    $sectionIsLoading.value = false;
    hideSidebarOnSmallScreen();
});
</script>

<style scoped>
.checkInOption {
    display: flex;
    align-items: center;
    border-radius: 15px;
    background-color: #eee;
    min-width: 175px;
    max-height: 190px;
    width: 15%;
    text-decoration: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    cursor: pointer;
}
.checkInOption:hover {
    padding: 15px !important;
}

@media (max-width: 500px) {
    .checkInOption {
        min-width: unset;
        min-height: unset;
        width: 40vw !important;
    }
}
</style>
