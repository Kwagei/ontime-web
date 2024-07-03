<template>
    <div class="table-responsive container p-0">
        <table class="table table-hover has-checkbox">
            <thead>
                <tr>
                    <!-- Select Check Box -->
                    <th scope="col">
                        <input class="form-check-input" type="checkbox" />
                    </th>
                    <!-- First Name -->
                    <th @click="emit('newSortTerm', 'first_name')" scope="col">
                        <div
                            class="d-flex justify-content-between align-items-center"
                        >
                            <div>First Name</div>
                            <div>
                                <AscIcon @click="setAsc" />
                                <DescIcon @click="setDesc" />
                            </div>
                        </div>
                    </th>
                    <!-- Middle Name -->
                    <th @click="emit('newSortTerm', 'middle_name')" scope="col">
                        Middle Name
                    </th>
                    <!-- Last Name -->
                    <th @click="emit('newSortTerm', 'last_name')" scope="col">
                        Last Name
                    </th>
                    <!-- Contact -->
                    <th @click="emit('newSortTerm', 'contact')" scope="col">
                        Contact
                    </th>
                    <!-- Email -->
                    <th @click="emit('newSortTerm', 'email')" scope="col">
                        Email
                    </th>
                    <!-- Address -->
                    <th @click="emit('newSortTerm', 'address')" scope="col">
                        Address
                    </th>
                </tr>
            </thead>
            <tbody>
                <!-- Display All Participants -->
                <tr
                    v-if="props.participants.length >= 1"
                    v-for="participant in props.participants"
                    :key="participant.id"
                >
                    <td>
                        <input class="form-check-input" type="checkbox" />
                    </td>
                    <td>{{ participant.first_name }}</td>
                    <td>{{ participant.middle_name }}</td>
                    <td>{{ participant.last_name }}</td>
                    <td>{{ participant.msisdn }}</td>
                    <td>{{ participant.email }}</td>
                    <td>{{ participant.address }}</td>
                </tr>
                <!-- No Participant to Show -->
                <tr v-else>
                    <td class="text-center" colspan="9">
                        <div
                            class="m-2 d-flex flex-column w-25 mx-auto align-items-center"
                        >
                            <img
                                style="
                                    border-radius: 50%;
                                    overflow: auto;
                                    object-fit: cover;
                                    width: 125px;
                                    height: 125px;
                                "
                                src="../../assets/images/user.png"
                            />

                            <h4 class="my-4">No participant to show</h4>

                            <button
                                class="btn btn-secondary w-100"
                                @click="
                                    emit('addParticipant', 'addParticipant')
                                "
                            >
                                Add Participant
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import DescIcon from "../DescIcon.vue";
import AscIcon from "../AscIcon.vue";

const props = defineProps({
    participants: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits([
    "addParticipant",
    "newSortTerm",
    "ascend",
    "descend",
]);

function setAsc() {
    emit("ascend");
}

function setDesc() {
    emit("descend");
}
</script>

<style scoped>
/* code... */
</style>
