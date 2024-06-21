<template>
    <div class="table-responsive container p-0">
        <table class="table table-hover has-checkbox">
            <thead>
                <tr>
                    <th scope="col">
                        <div class="form-check mb-0">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="customCheck"
                            />
                            <label class="form-check-label" for="customCheck">
                                <span class="visually-hidden">Select all</span>
                            </label>
                        </div>
                    </th>
                    <th scope="col">First Name</th>
                    <th scope="col">Middle Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Email</th>
                    <th scope="col">Address</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="participant in props.participants"
                    :key="participant.id"
                >
                    <td>
                        <div class="form-check mb-0">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="customCheck3"
                                @click.stop
                            />
                        </div>
                    </td>
                    <td>{{ participant.first_name }}</td>
                    <td>{{ participant.middle_name }}</td>
                    <td>{{ participant.last_name }}</td>
                    <td>{{ participant.msisdn }}</td>
                    <td>{{ participant.email }}</td>
                    <td>{{ participant.address }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
const props = defineProps({
    participants: {
        type: Array,
        required: true,
    },
});
</script>

<style scoped>
/* code... */
</style>
