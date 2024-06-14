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
                        class="modal-title h3"
                        :class="{
                            'text-danger': data.status === 'danger',
                            'text-success': data.status === 'success',
                            'text-warning': data.status === 'warning',
                        }"
                        id="exampleModalLabel"
                    >
                        {{ data.title }}
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
                <div v-if="data.pageLink || data.message" class="modal-body">
                    <div v-if="data.message != data.title" class="mt-2 mb-3">
                        {{ data.message }}
                    </div>
                    <router-link v-if="data.pageLink" :to="data.pageLink">
                        <button class="btn btn-primary d-block">View</button>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    data: { type: Object, required: true },
});
</script>
