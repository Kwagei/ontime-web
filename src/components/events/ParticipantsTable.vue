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

function formatAddress(address) {
	if (!address) {
		return "";
	}
	const addressLen = address.length;
	const newAddress =
		addressLen >= MAX_DETAIL_LEN
			? `${address.slice(0, MAX_DETAIL_LEN)}...`
			: address;

	return newAddress;
}

const initializeDataTable = () => {
	dataTable.value = new DataTables("#participantsTable", {
		serverSide: true,
		ajax: {
			url: `http://localhost:3000/api/events/${id}/participants`,
			type: "GET",
			data: (query) => {
				return {
					start: query.start,
					limit: query.length,
					search: query.search.value,
					sort: query.columns[query.order[0].column].data,
					direction: query.order[0].dir,
				};
			},
			dataSrc: (json) => {
				visitors.value = json.data;
				visitors.value.forEach((visitor) => {
					visitor.address = formatAddress(visitor.address);
				});
				return formatDateTime(visitors.value);
			},
			error: (xhr, error, thrown) => {
				console.log("Error fetching data:", error);
			},
		},
		columns: [
			{ data: "created_at", title: "Created At" },
			{ data: "first_name", title: "First name" },
			{ data: "middle_name", title: "Middle name" },
			{ data: "last_name", title: "Last name" },
			{ data: "msisdn", title: "Phone number" },
			{ data: "email", title: "Email" },
			{ data: "address", title: "Address" },
		],
		responsive: true,
		lengthMenu: [10, 25, 50, 100],
		language: {
			searchPlaceholder: "Search ...",
			search: "",
			emptyTable: `
                <div class="d-flex flex-column justify-content-center align-items-center gap-3 p-4">
                    No Visitors to show!
                    <svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M33.8 87.5V69.684A10.02 10.02 0 0126.3 60V48.75a18.7 18.7 0 011.763-7.943 16.64 16.64 0 01-10.72-4.533A15.29 15.29 0 008.8 50v11.912C8.8 65.81 12.001 69 15.9 69v18.5a4.965 4.965 0 004.959 5h14.857a7.47 7.47 0 01-1.916-5m48.958-51.226a16.64 16.64 0 01-10.72 4.533A18.7 18.7 0 0173.8 48.75V60a10.02 10.02 0 01-7.5 9.684V87.5a7.47 7.47 0 01-1.916 5h14.857a4.965 4.965 0 004.959-5V69c3.899 0 7.1-3.19 7.1-7.088V50a15.29 15.29 0 00-8.542-13.726M71.3 12.5a12.44 12.44 0 00-6.538 1.845q.135.286.26.579a16.24 16.24 0 01-2.416 16.644l.723.356a18.8 18.8 0 016.668 5.509A12.5 12.5 0 1071.3 12.5m-7.5 8.75A13.75 13.75 0 1150.05 7.5 13.75 13.75 0 0163.8 21.25m-1.576 12.916a17.747 17.747 0 01-24.348 0A16.25 16.25 0 0028.8 48.75V60a7.5 7.5 0 007.5 7.5v20a5 5 0 005 5h17.5a5 5 0 005-5v-20a7.5 7.5 0 007.5-7.5V48.75a16.25 16.25 0 00-9.076-14.584m-32.12 3.266a18.8 18.8 0 016.667-5.508l.723-.357a16.27 16.27 0 01-2.416-16.643q.125-.292.26-.58A12.5 12.5 0 1028.8 37.5a13 13 0 001.304-.067Z"/></svg>
                    Please click the add visitor button to create new visitors.
                </div>
        `,
			loadingRecords: `<div class="d-flex justify-content-center p-4">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        </div>`,
		},
	});

	// Handle row click event
	dataTable.value.on("click", "tr", function () {
		const rowData = dataTable.value.row(this).data();
		if (rowData) {
			visitorDetail(rowData.id);
		}
	});
};

onMounted(() => {
	initializeDataTable();
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
