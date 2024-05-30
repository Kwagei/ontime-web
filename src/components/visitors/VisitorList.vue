<template>
    <div class="table-responsive container p-0">
        <table class="table table-sm table-hover has-checkbox">
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
                    <th scope="col">First name</th>
                    <th scope="col">Middle name</th>
                    <th scope="col">Last name</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Email</th>
                    <th scope="col">Address</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    class=""
                    v-for="visitor in visitors"
                    :key="visitor.id"
                    :id="visitor.id"
                >
                    <td>
                        <div class="form-check mb-0">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="customCheck3"
                            />
                        </div>
                    </td>
                    <td>{{ visitor.first_name }}</td>
                    <td>{{ visitor.middle_name }}</td>
                    <td>{{ visitor.last_name }}</td>
                    <td>{{ visitor.contact }}</td>
                    <td>{{ visitor.email }}</td>
                    <td>{{ visitor.address }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref } from "vue";

const visitors = ref([
    {
        id: 1,
        first_name: "John",
        middle_name: "Adam",
        last_name: "Doe",
        contact: "1234567890",
        address: "1234 Main Street",
        email: "johndoe123@gmail.com",
    },
    {
        id: 2,
        first_name: "Jane",
        middle_name: "Elizabeth",
        last_name: "Smith",
        contact: "2345678901",
        address: "5678 Elm Avenue",
        email: "janesmith456@yahoo.com",
    },
    {
        id: 3,
        first_name: "Michael",
        middle_name: "Robert",
        last_name: "Johnson",
        contact: "3456789012",
        address: "9101 Pine Road",
        email: "michaeljohnson789@hotmail.com",
    },
    {
        id: 4,
        first_name: "Emily",
        middle_name: "Grace",
        last_name: "Brown",
        contact: "4567890123",
        address: "221 Baker Street",
        email: "emilybrown321@outlook.com",
    },
    {
        id: 5,
        first_name: "David",
        middle_name: "Samuel",
        last_name: "Wilson",
        contact: "5678901234",
        address: "333 Oak Lane",
        email: "davidwilson654@example.com",
    },
    {
        id: 6,
        first_name: "Emma",
        middle_name: "Sophia",
        last_name: "Lee",
        contact: "6789012345",
        address: "444 Pineapple Boulevard",
        email: "emmalee987@gmail.com",
    },
    {
        id: 7,
        first_name: "Daniel",
        middle_name: "James",
        last_name: "Taylor",
        contact: "7890123456",
        address: "555 Maple Street",
        email: "danieltaylor876@yahoo.com",
    },
    {
        id: 8,
        first_name: "Olivia",
        middle_name: "Charlotte",
        last_name: "Clark",
        contact: "8901234567",
        address: "666 Cherry Avenue",
        email: "oliviaclark543@hotmail.com",
    },
    {
        id: 9,
        first_name: "Matthew",
        middle_name: "Jacob",
        last_name: "Martinez",
        contact: "9012345678",
        address: "777 Lemon Drive",
        email: "matthewmartinez210@outlook.com",
    },
    // {
    //     id: 10,
    //     first_name: "Sophia",
    //     middle_name: "Ava",
    //     last_name: "Hall",
    //     contact: "0123456789",
    //     address: "888 Banana Street",
    //     email: "sophiahall789@example.com",
    // },
    // {
    //     id: 11,
    //     first_name: "Liam",
    //     middle_name: "William",
    //     last_name: "Turner",
    //     contact: "2345678901",
    //     address: "999 Grapevine Road",
    //     email: "liamturner123@gmail.com",
    // },
    // {
    //     id: 12,
    //     first_name: "Ava",
    //     middle_name: "Grace",
    //     last_name: "Baker",
    //     contact: "3456789012",
    //     address: "1011 Orange Avenue",
    //     email: "avabaker456@yahoo.com",
    // },
    // {
    //     id: 13,
    //     first_name: "Noah",
    //     middle_name: "Alexander",
    //     last_name: "Brooks",
    //     contact: "4567890123",
    //     address: "1213 Water Street",
    //     email: "noahbrooks789@hotmail.com",
    // },
    // {
    //     id: 14,
    //     first_name: "Isabella",
    //     middle_name: "Ella",
    //     last_name: "Hayes",
    //     contact: "5678901234",
    //     address: "1415 Sunflower Lane",
    //     email: "isabellahayes321@outlook.com",
    // },
    // {
    //     id: 15,
    //     first_name: "James",
    //     middle_name: "Benjamin",
    //     last_name: "Foster",
    //     contact: "6789012345",
    //     address: "1617 Moonlight Drive",
    //     email: "jamesfoster654@example.com",
    // },
    // {
    //     id: 16,
    //     first_name: "Sophia",
    //     middle_name: "Mia",
    //     last_name: "Hall",
    //     contact: "7890123456",
    //     address: "1819 Star Avenue",
    //     email: "sophiahall987@gmail.com",
    // },
    // {
    //     id: 17,
    //     first_name: "Ethan",
    //     middle_name: "Lucas",
    //     last_name: "Murphy",
    //     contact: "8901234567",
    //     address: "2021 Rainbow Road",
    //     email: "ethanmurphy876@yahoo.com",
    // },
    // {
    //     id: 18,
    //     first_name: "Mia",
    //     middle_name: "Grace",
    //     last_name: "Reed",
    //     contact: "9012345678",
    //     address: "2223 Cloud Street",
    //     email: "miareed543@hotmail.com",
    // },
    // {
    //     id: 19,
    //     first_name: "Alexander",
    //     middle_name: "Michael",
    //     last_name: "Cooper",
    //     contact: "0123456789",
    //     address: "2425 Thunder Lane",
    //     email: "alexandercooper210@outlook.com",
    // },
    // {
    //     id: 20,
    //     first_name: "Charlotte",
    //     middle_name: "Amelia",
    //     last_name: "Richardson",
    //     contact: "1234567890",
    //     address: "2627 Serenity Drive",
    //     email: "charlotterichardson789@example.com",
    // },
]);
</script>

<style scoped>
th,
td {
    padding: 1rem;
}
</style>
