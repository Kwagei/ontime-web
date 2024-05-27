<template>
    <div style="height: 100vh">
        <div class="d-flex container gap-4 px-0" style="height: 100%">
            <aside class="flex-grow-0 bg-info" style="width: 18rem">
                <SideBar />
            </aside>
            <main
                class="flex-grow-1"
                style="height: 100%; background-color: #ececec"
            >
                <HeaderBar />

                <section style="padding: 0.5rem 4rem">
                    <AddVisitors
                        @visitorFormSubmitted="handleVisitorSubmitted"
                    />
                </section>
            </main>
        </div>
    </div>
</template>

<script setup>
import AddVisitors from "./components/visitors/AddVisitors.vue";
import SideBar from "./components/SideBar.vue";
import HeaderBar from "./components/HeaderBar.vue";

import { ref } from "vue";

const visitors = ref([]);

const handleVisitorSubmitted = (visitor) => {
    visitors.value.push(visitor);
    console.log(visitors.value);
};
</script>
