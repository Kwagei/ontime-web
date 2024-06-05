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
                <div class="modal-header">
                    <h1
                        class="modal-title h5"
                        :class="{
                            'text-danger': data.status === 'danger',
                            'text-success': data.status === 'success',
                            'text-warning': data.status === 'warning',
                        }"
                        id="exampleModalLabel"
                    >
                        {{ data.title }}:
                    </h1>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        data-bs-title="Close"
                    >
                        <span class="visually-hidden">Close</span>
                    </button>
                </div>
                <div class="modal-body">{{ data.message }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    data: { type: Object, required: true },
});
</script>
