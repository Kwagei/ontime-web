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
					<th scope="col">Visitor</th>
					<th scope="col">Arrival time</th>
					<th scope="col">Contact</th>
					<th scope="col">Departural time</th>
					<th scope="col">Host</th>
					<th scope="col">Date</th>
					<th scope="col">Room</th>
					<th scope="col">Institution</th>
					<th scope="col">Belonging</th>
					<th scope="col">Purpose</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="visit in visits" :key="visit.id" :id="visit">
					<td>
						<div class="form-check mb-0">
							<input
								class="form-check-input"
								type="checkbox"
								id="customCheck3"
							/>
						</div>
					</td>
					<td>{{ visit.name }}</td>
					<td>{{ visit.arrival_time }}</td>
					<td>{{ visit.contact }}</td>
					<td>{{ visit.departural_time }}</td>
					<td>{{ visit.host }}</td>
					<td>{{ visit.date }}</td>
					<td>{{ visit.room }}</td>
					<td>{{ visit.institution }}</td>
					<td>{{ visit.belonging }}</td>
					<td>{{ visit.purpose }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup>
import { ref } from "vue";

const visits = ref([
	{
		id: 1,
		name: "John Doe",
		arrival_time: "08:00 AM",
		contact: "1234567890",
		departural_time: "09:00 AM",
		host: "Alice Johnson",
		date: "2024-05-29",
		room: "101",
		institution: "ABC Corp",
		belonging: "Laptop",
		purpose: "Meeting",
	},
	{
		id: 2,
		name: "Jane Smith",
		arrival_time: "09:30 AM",
		contact: "2345678901",
		departural_time: "10:30 AM",
		host: "Bob Brown",
		date: "2024-05-29",
		room: "102",
		institution: "XYZ Inc",
		belonging: "Notebook",
		purpose: "Interview",
	},
	{
		id: 3,
		name: "Michael Johnson",
		arrival_time: "10:00 AM",
		contact: "3456789012",
		departural_time: "11:00 AM",
		host: "Carol White",
		date: "2024-05-29",
		room: "103",
		institution: "Tech Solutions",
		belonging: "Tablet",
		purpose: "Presentation",
	},
	{
		id: 4,
		name: "Emily Brown",
		arrival_time: "11:30 AM",
		contact: "4567890123",
		departural_time: "12:30 PM",
		host: "David Black",
		date: "2024-05-29",
		room: "104",
		institution: "Health Corp",
		belonging: "Documents",
		purpose: "Consultation",
	},
	{
		id: 5,
		name: "David Wilson",
		arrival_time: "12:00 PM",
		contact: "5678901234",
		departural_time: "01:00 PM",
		host: "Eve Green",
		date: "2024-05-29",
		room: "105",
		institution: "Edu Academy",
		belonging: "Briefcase",
		purpose: "Training",
	},
	{
		id: 6,
		name: "Emma Lee",
		arrival_time: "01:30 PM",
		contact: "6789012345",
		departural_time: "02:30 PM",
		host: "Frank Brown",
		date: "2024-05-29",
		room: "106",
		institution: "Finance Ltd",
		belonging: "Folder",
		purpose: "Discussion",
	},
	{
		id: 7,
		name: "Daniel Taylor",
		arrival_time: "02:00 PM",
		contact: "7890123456",
		departural_time: "03:00 PM",
		host: "Grace Davis",
		date: "2024-05-29",
		room: "107",
		institution: "Govt Office",
		belonging: "ID Card",
		purpose: "Inspection",
	},
	{
		id: 8,
		name: "Olivia Clark",
		arrival_time: "03:30 PM",
		contact: "8901234567",
		departural_time: "04:30 PM",
		host: "Henry Adams",
		date: "2024-05-29",
		room: "108",
		institution: "Legal Firm",
		belonging: "Files",
		purpose: "Legal Advice",
	},
	{
		id: 9,
		name: "Matthew Martinez",
		arrival_time: "04:00 PM",
		contact: "9012345678",
		departural_time: "05:00 PM",
		host: "Ivy Smith",
		date: "2024-05-29",
		room: "109",
		institution: "Retail Co",
		belonging: "Package",
		purpose: "Delivery",
	},
]);
</script>

<style scoped>
th,
td {
	padding: 1rem;
}
</style>
