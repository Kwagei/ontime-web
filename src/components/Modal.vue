<template>
    <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
    >
        <div
            class="modal-dialog modal-lg"
            id="toggleMyModal"
            style="background-color: white"
        >
            <div class="modal-content py-1">
                <div class="modal-header">
                    <div
                        :class="`alert alert-${data.status} mb-0`"
                        style="border: none; padding-right: 0"
                        role="alert"
                    >
                        <span class="alert-icon"></span>
                    </div>
                    <h3 class="mb-0">
                        {{ data.title }}
                    </h3>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        data-bs-title="Close"
                        style="margin-left: auto"
                    >
                        <span class="visually-hidden">Close</span>
                    </button>
                </div>
                <div v-if="data.pageLink || data.message" class="modal-body">
                    <div
                        v-if="data.message && data.message != data.title"
                        class="mt-2 mb-3"
                    >
                        {{ data.message }}
                    </div>
                    <button
                        class="btn btn-primary d-block"
                        @click="goToPage(data.pageLink)"
                    >
                        View
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
    data: { type: Object, required: true },
});

const router = useRouter();

function goToPage(link) {
    // go to a dummy route before to go to the target route
    // because the browser will ignore the routing if the target route
    // is the same as the current route
    router.replace({ path: "/null" }).then(() => {
        router.replace({ path: link });
    });
}
</script>

<style scoped>
.modal {
    background-color: #16161552;
    z-index: 2000;
}

.modal-content {
    background-color: transparent !important;
    border: none !important;
}
</style>
