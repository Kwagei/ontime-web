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
                    <div
                        v-if="props.getRoom"
                        class="dropdown w-100 mb-3 col-md-6"
                    >
                        <label for="room" class="form-label is-required"
                            >Room<span class="visually-hidden">
                                (required)</span
                            ></label
                        >

                        <div
                            class="input-group has-validation position-relative"
                        >
                            <input
                                type="text"
                                class="form-select"
                                id="facilitatorInput"
                                :id="roomID"
                                :value="roomValue"
                                v-model="roomValue"
                                aria-expanded="false"
                                data-bs-toggle="dropdown"
                                autocomplete="off"
                                required
                            />

                            <ul class="dropdown-menu w-100">
                                <template v-for="room in roomsData">
                                    <li
                                        class="dropdown-item"
                                        :value="room.id"
                                        @click="updateRoomTerm(room)"
                                    >
                                        {{ room.name }}
                                    </li>
                                </template>
                                <router-link
                                    :to="{ name: 'new-room' }"
                                    class="text-primary"
                                >
                                    <li class="dropdown-item">
                                        Create new room
                                    </li>
                                </router-link>
                            </ul>

                            <div class="invalid-feedback">
                                Please provide a host.
                            </div>
                        </div>
                    </div>
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
import { getRooms } from "@/assets/js";
import { watch, ref, onMounted } from "vue";
const emit = defineEmits(["done", "cancel"]);

const temBelonging = ref("");
const belongings = ref([]);
const institution = ref("");

const props = defineProps({
    getRoom: Boolean,
});

// Rooms Data
const roomValue = ref("");
const roomID = ref("");
const roomsData = ref("");
const roomTem = ref("");

function done() {
    emit("done", {
        selectedRoomId: roomID.value || "",
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

// Lifecycle Hooks
onMounted(async () => {
    const { rooms } = await getRooms();
    roomsData.value = rooms;
    roomTem.value = rooms;
});

const updateRoomTerm = (room) => {
    roomValue.value = room.name;
    roomID.value = room.id;
};

// Local search for rooms
watch(
    () => roomValue.value,
    (n) => {
        roomsData.value = n
            ? roomTem.value.filter((room) =>
                  room.name.toLocaleLowerCase().includes(n.toLocaleLowerCase())
              )
            : roomTem.value;
    }
);
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
