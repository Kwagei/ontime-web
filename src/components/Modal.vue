<template>
    <div
        class="modal fade"
        id="alertModal"
        tabindex="-1"
        aria-labelledby="alertModalLabel"
        data-bs-backdrop="static"
        aria-hidden="true"
        style="z-index: 4000"
    >
        <div class="modal-dialog modal-lg" id="alertModalBody">
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
                <div
                    v-if="data.pageLink || data.message"
                    class="modal-body d-flex justify-content-between align-items-center"
                >
                    <div class="mt-2 mb-3" style="padding: 0 1.5rem">
                        {{ data.message }}
                    </div>

                    <router-link
                        @click="handleIdenticalRoute"
                        v-if="data.pageLink"
                        :to="data.pageLink"
                    >
                        <button
                            type="button"
                            class="btn btn-link border border-1"
                        >
                            View
                        </button>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const props = defineProps({
    data: { type: Object, required: true },
});

function handleIdenticalRoute() {
    // reload the page if the new route and
    // the current route are identical
    if (props.data.pageLink == route.fullPath) router.go(0);

    // otherwise do nothing
}
</script>

<style scoped>
.modal {
    background-color: #00000094 !important;
}

a.router-link-active {
    font-weight: 700;
}

a.router-link-active:hover {
    color: #ff7900 !important;
}
</style>
