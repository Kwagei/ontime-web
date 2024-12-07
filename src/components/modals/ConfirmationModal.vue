<template>
    <div id="confirmationModal" class="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mb-2">
                    <h5 class="modal-title">{{ props.title }}</h5>
                </div>
                <div class="modal-body">
                    <p v-html="props.message"></p>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-outline-secondary"
                        data-bs-dismiss="modal"
                    >
                        Cancel
                    </button>
                    <button
                        @click="$emit('confirmed')"
                        data-bs-dismiss="modal"
                        type="button"
                        class="btn btn-primary"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(["confirmed"]);

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    message: String,
});
</script>

<style scoped>
#confirmationModal {
    padding-top: 40vh;
    padding-left: 20vw;
    background-color: rgba(0, 0, 0, 0.5);
}

@media (max-width: 1250px) {
    #confirmationModal {
        padding-left: 0 !important;
    }
}
</style>
