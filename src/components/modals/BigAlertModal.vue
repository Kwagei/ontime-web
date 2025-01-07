<template>
    <div
        class="modal fade"
        id="bigAlertModal"
        tabindex="-1"
        aria-hidden="true"
        aria-labelledby="bigAlertModalLabel"
        style="z-index: 2000"
    >
        <div
            class="modal-dialog modal-lg modal-dialog-centered"
            id="modal-dialog"
        >
            <div class="modal-content text-center rounded">
                <div class="modal-header d-flex justify-content-between">
                    <div>
                        <router-link
                            :to="props.data.pageLink"
                            v-if="props.data.pageLink"
                        >
                            <button class="btn btn-link" type="button">
                                View
                            </button>
                        </router-link>
                    </div>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        data-bs-placement="bottom"
                        data-bs-title="Close"
                        style="max-height: 50px"
                    >
                        <span class="visually-hidden">Close</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <Icons
                            :class="
                                props.data.status || 'success' + '-employee'
                            "
                            icon="employees"
                            width="150px"
                            height="150px"
                        />
                    </div>
                    <div>
                        <span class="d-block mb-4 text fw-bold fs-2">
                            {{ props.data.heading }}
                        </span>

                        <span class="fs-4 text text-secondary">
                            {{ props.data.message }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Icons from "../Icons.vue";
import { onMounted } from "vue";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});
</script>

<style scoped>
.success-employee {
    color: #228722;
}
.warning-employee {
    color: #8f7200;
}
.danger-employee {
    color: #cd3c14;
}
</style>
