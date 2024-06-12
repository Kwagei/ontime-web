<template>
    <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-lg" id="toggleMyModal">
            <div class="modal-content">
                <div
                    :class="`alert alert-${data.status}`"
                    role="alert"
                    style="background-color: white"
                >
                    <span class="alert-icon"></span>
                    <div>
                        <h4 class="alert-heading">
                            {{ data.message }}
                        </h4>
                        <p v-if="data.title === 'success'">
                            <span style="font-size: small">
                                Please visit link to view detail
                                <a href="#">here</a>
                            </span>
                            <!-- <span v-else>{{ data.message }}</span> -->
                        </p>
                    </div>
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
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
    data: { type: Object, required: true },
});
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
