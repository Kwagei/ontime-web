<template>
    <div
        class="modal fade"
        id="visitModal"
        tabindex="-1"
        aria-hidden="true"
        aria-labelledby="visitModalLabel"
        style="z-index: 2000"
    >
        <div
            class="modal-dialog modal-lg modal-dialog-centered"
            id="modal-dialog"
        >
            <div class="modal-content rounded">
                <div class="modal-header">
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        data-bs-placement="bottom"
                        data-bs-title="Close"
                    >
                        <span class="visually-hidden">Close</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="belongings" class="form-label"
                            >Belongings</label
                        >
                        <div class="input-group has-validation">
                            <input
                                type="text"
                                class="form-control"
                                autofocus="true"
                                id="belongings"
                                aria-describedby="inputGroupPrepend"
                                v-model="temBelonging"
                                @keyup.prevent="addBelongings"
                            />
                        </div>
                        <div
                            v-for="belonging in belongings"
                            :key="belonging"
                            @click="deleteBelongings(belonging)"
                            class="belonging"
                        >
                            {{ belonging }}
                        </div>
                    </div>
                    <div>
                        <label for="institution" class="form-label"
                            >Institution</label
                        >
                        <div class="input-group">
                            <input
                                type="text"
                                class="form-control"
                                id="institution"
                                aria-describedby="inputGroupPrepend"
                                v-model="institution"
                            />
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="done" class="btn btn-primary">
                        Check In
                    </button>

                    <button
                        type="button"
                        class="btn btn-outline-secondary"
                        data-bs-dismiss="modal"
                        @click="$emit('cancel')"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["done", "cancel"]);

const temBelonging = ref("");
const belongings = ref([]);
const institution = ref("");

function done() {
    emit("done", {
        institution: institution.value || "",
        belongings: belongings.value.length ? belongings.value : [],
    });
}

const addBelongings = (event) => {
    const { key } = event;

    if (key === "Enter" && temBelonging.value) {
        if (!belongings.value.includes(temBelonging.value)) {
            belongings.value.push(temBelonging.value);
        }
        temBelonging.value = "";
    }
};

const deleteBelongings = (item) => {
    belongings.value = belongings.value.filter((val) => val !== item);
};
</script>

<style scoped>
.belonging {
    text-transform: capitalize;
    display: inline-block;
    margin: 20px 10px 0 0;
    padding: 6px 12px;
    background-color: #eee;
    border-radius: 20px;
    font-size: 12px;
    letter-spacing: 1px;
    font-weight: bold;
    color: #777;
    cursor: pointer;
}
</style>
