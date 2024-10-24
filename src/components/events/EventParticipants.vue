<template>
    <ConfirmationModal
        :title="confirmationTitle"
        :message="confirmationMessage"
        @confirmed="deleteParticipant"
    />

    <AlertModal :data="alert" />

    <div
        class="table-responsive container p-0 d-flex flex-column"
        style="gap: 0.7rem"
    >
        <div>
            <DataTable
                id="eventParticipantsTable"
                class="display w-100 table"
                :key="tableKey"
                :columns="columns"
                :options="options"
                ref="table"
                v-if="!showError"
            />
            <h3 class="mt-5 text-center fw-bold" v-if="showError">
                Unable to load event participants, try again!
            </h3>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";
import $ from "jquery";

import { API_KEY, API_URL } from "@/assets/js";
import { capitalize, showModal } from "@/util/util";
import ConfirmationModal from "../modals/ConfirmationModal.vue";
import AlertModal from "../modals/AlertModal.vue";

const router = useRouter();
const eventId = router.currentRoute.value.params.id;
const totalEventParticipants = defineModel("totalEventParticipants");
const showError = ref(false);
const emit = defineEmits(["switch"]);

let allParticipants = [];

const refresh = defineModel("refresh");

const table = ref();
const tableKey = ref(0);

// Alert Modal Data
const alert = ref({
    message: "",
    status: "",
    pageLink: "",
});

const $sectionIsLoading =
    getCurrentInstance().appContext.config.globalProperties.$sectionIsLoading;

const confirmationTitle = ref("");
const confirmationMessage = ref("");
const participantToDelete = ref("");

DataTable.use(DataTablesCore);

const props = defineProps({
    event: Object,
});

const columns = [
    { data: "first_name", title: "First Name" },
    { data: "last_name", title: "Last Name" },
    { data: "gender", title: "Gender" },
    { data: "email", title: "Email" },
    { data: "msisdn", title: "Contact" },
    { data: "address", title: "Address" },
    { data: "occupation", title: "Occupation" },
    {
        data: null,
        title: "Today's Attendance",
        render: (data) => {
            return data.participant_id
                ? `<span class="text-success fw-bold">Attended</span>`
                : `<span class="text-danger fw-bold">Not Attended</span>`;
        },
        visible:
            props.event.type != "Course" ||
            new Date(props.event.start_date) >= new Date() ||
            new Date(props.event.end_date) <= new Date()
                ? false
                : true,
    },
    {
        data: null,
        title: "Action",
        className: "text-center",
        render: (data) => `
			<div class="d-flex justify-content-center gap-2">
				<svg data-name="${data.first_name + " " + data.last_name}" data-id="${
            data.id
        }" class="editParticipantBtn btn btn-success fs-1 p-0 m-0" xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" fill="currentColor" class="solaris-icon si-pencil" viewBox="0 0 1000 1000">
					<path d="m876.2 238.316-51.077-51.108-63.846-63.884a81.08 81.08 0 0 0-68.3-23.078q-1.067.141-2.131.32a81 81 0 0 0-13.825 3.471l-.091.03a80.9 80.9 0 0 0-30.578 19.257L186.663 583.292l-53.526 176.424-13.253 43.678-18.684 61.59a29 29 0 0 0-.485 1.827c-.045.192-.078.383-.119.575-.087.415-.17.83-.238 1.242-.037.227-.066.453-.1.68a26 26 0 0 0-.245 2.931q-.01.345-.013.689.001.564.025 1.123c.008.211.013.422.027.632.027.425.069.847.116 1.267.018.152.028.305.048.456q.111.855.276 1.693c.021.108.05.214.072.322q.143.673.313 1.334c.051.191.11.379.165.568q.15.531.323 1.053.106.31.219.617a27 27 0 0 0 .629 1.586q.207.473.431.935c.095.2.188.393.288.587.164.322.339.638.516.952.095.171.188.343.287.511q.342.576.713 1.134c.059.09.114.183.175.273q.464.685.969 1.341c.1.127.2.248.3.373.246.308.493.614.752.911.135.156.277.307.415.46q.35.387.713.76.233.236.472.467.361.352.736.69.246.227.5.443.39.335.792.655c.167.132.331.266.5.395.3.228.6.445.912.66.147.1.29.21.438.309q.688.463 1.405.885.032.019.065.036.687.4 1.4.759c.162.082.329.156.494.235.337.163.677.323 1.022.472q.298.124.592.241a26 26 0 0 0 1.61.591q.493.162.995.306.317.093.638.177c.352.092.706.172 1.062.249.2.044.4.091.6.129.415.08.835.145 1.256.206.147.021.291.048.438.067q.856.106 1.726.159c.117.007.236.006.353.011.4.019.8.037 1.208.037.056 0 .113-.006.169-.006.358 0 .719-.023 1.08-.04.283-.013.565-.019.85-.041.377-.03.758-.081 1.137-.127.272-.033.542-.056.814-.1.421-.064.845-.153 1.269-.237.233-.047.466-.082.7-.135q.963-.219 1.93-.51c.017 0 .034-.008.051-.014l21.618-6.566 83.587-25.391 176.317-53.56 262.68-262.838L876.2 353.308a80.93 80.93 0 0 0 22.163-41.279q.136-.669.26-1.338.611-3.294.95-6.62c.026-.248.053-.5.076-.744q.342-3.7.35-7.422v-.093a81.08 81.08 0 0 0-23.799-57.496M359.047 755.779l37.419 37.442-176.318 53.559-66.969-67.01 53.527-176.424 37.419 37.441 459.69-459.967 19.154 19.165-459.691 459.968 76.615 76.661 459.691-459.968 19.154 19.166Z" style="fill-rule:evenodd"/>
				</svg>
				<svg data-name="${data.first_name + " " + data.last_name}" data-id="${
            data.id
        }" class="deleteParticipantBtn btn btn-danger fs-1 p-0 m-0" xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" fill="currentColor" class="solaris-icon si-trash" viewBox="0 0 1000 1000">
					<path d="M750 149.959H625V125a50 50 0 0 0-50-50H425a50 50 0 0 0-50 50v24.959H250a75 75 0 0 0-75 75V275h650v-50.041a75 75 0 0 0-75-75M425 125h150v24.959H425zM225 299.959V925h550V299.959zM375 400v425a25 25 0 0 1-50 0V399.959a25 25 0 0 1 50 0zm150 0v425a25 25 0 0 1-50 0V399.959a25 25 0 0 1 50 0zm150 0v425a25 25 0 0 1-50 0V399.959a25 25 0 0 1 50 0z" style="fill-rule:evenodd"/>
				</svg>
			</div>
		`,
    },
];

const options = {
    responsive: true,
    select: true,
    serverSide: true,
    ajax: {
        url: `${API_URL}events/${eventId}/participants/`,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("authorization", API_KEY);
        },
        data: (query) => {
            const order =
                query.columns[query.order[0].column].data === "date"
                    ? "date_time"
                    : query.columns[query.order[0].column].data;

            return {
                start: query.start,
                limit: query.length,
                search: query.search.value,
                sort: order,
                direction: query.order[0].dir,
            };
        },
        dataSrc: (json) => {
            $("#eventParticipantsTable").show();
            showError.value = false;
            refresh.value = false;

            const { participants, totalLength } = json.data;

            json.recordsTotal = totalLength;
            json.recordsFiltered = totalLength;
            totalEventParticipants.value = totalLength;

            participants.forEach((participant) => {
                participant.msisdn = participant.msisdn
                    ? `0${participant.msisdn.slice(3)}`
                    : "";

                participant.gender = capitalize(participant.gender);
            });

            allParticipants = participants;

            return participants;
        },
        error: (error) => {
            console.log("Error fetching data:", error.responseJSON);
            $("#eventParticipantsTable").hide();
            showError.value = true;
            refresh.value = false;
        },
    },
    responsive: true,
    lengthMenu: [10, 25, 50, 100],
    language: {
        searchPlaceholder: "Search ...",
        search: "",
        emptyTable: `
			<div class="d-flex flex-column justify-content-center align-items-center gap-3 p-4">
				No Event Participants to show!
				<svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M80 17.5H70v-3.8c0-2.071-1.679-3.7-3.75-3.7a3.75 3.75 0 00-3.75 3.75v3.75H35.001L35 13.75a3.75 3.75 0 00-7.5 0v3.75H10V80a7.5 7.5 0 007.5 7.5h70V25a7.5 7.5 0 00-7.5-7.5m2.5 65H18.75A3.75 3.75 0 0115 78.75V40h63.75a3.75 3.75 0 013.75 3.75zM25 26.25a6.24 6.24 0 012.5-5v5a3.75 3.75 0 007.5 0V25h.001v-3.75a6.25 6.25 0 11-10.001 5m35 0a6.24 6.24 0 012.5-5v5a3.75 3.75 0 007.5 0L69.999 25H70v-3.7a6.15 6.15 0 012.5 4.95 6.25 6.25 0 01-12.5 0M23.75 45a3.75 3.75 0 103.75 3.75A3.75 3.75 0 0023.75 45m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55M23.75 57.5a3.75 3.75 0 103.75 3.75 3.75 3.75 0 00-3.75-3.75m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55M23.75 70a3.75 3.75 0 103.75 3.75A3.75 3.75 0 0023.75 70m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55"/></svg>
				<button
					class="btn btn-secondary"
					onclick="document.getElementById('addParticipantBtn').click()"
				>
					<svg style="width: 1rem; height: 2rem;" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" d="M85 40H60V15a5 5 0 00-5-5H45a5 5 0 00-5 5v25H15a5 5 0 00-5 5v10a5 5 0 005 5h25v25a5 5 0 005 5h10a5 5 0 005-5V60h25a5 5 0 005-5V45a5 5 0 00-5-5"/></svg>
                    New
				</button>
			</div>
        `,
        zeroRecords: `
			<div class="d-flex flex-column justify-content-center align-items-center gap-3 p-4">
				No match found!
				<svg style="width: 5rem; height: 5rem;" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" fill-rule="evenodd" d="M80 17.5H70v-3.8c0-2.071-1.679-3.7-3.75-3.7a3.75 3.75 0 00-3.75 3.75v3.75H35.001L35 13.75a3.75 3.75 0 00-7.5 0v3.75H10V80a7.5 7.5 0 007.5 7.5h70V25a7.5 7.5 0 00-7.5-7.5m2.5 65H18.75A3.75 3.75 0 0115 78.75V40h63.75a3.75 3.75 0 013.75 3.75zM25 26.25a6.24 6.24 0 012.5-5v5a3.75 3.75 0 007.5 0V25h.001v-3.75a6.25 6.25 0 11-10.001 5m35 0a6.24 6.24 0 012.5-5v5a3.75 3.75 0 007.5 0L69.999 25H70v-3.7a6.15 6.15 0 012.5 4.95 6.25 6.25 0 01-12.5 0M23.75 45a3.75 3.75 0 103.75 3.75A3.75 3.75 0 0023.75 45m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55M23.75 57.5a3.75 3.75 0 103.75 3.75 3.75 3.75 0 00-3.75-3.75m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55M23.75 70a3.75 3.75 0 103.75 3.75A3.75 3.75 0 0023.75 70m48.75 1.2H35c-1.38 0-2.5 1.17-2.5 2.55s1.12 2.45 2.5 2.45h37.5c1.38 0 2.5-1.07 2.5-2.45s-1.12-2.55-2.5-2.55"/></svg>
			</div>
		`,
        loadingRecords: `
			<div class="d-flex justify-content-center p-4">
				<div class="spinner-border" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		`,
    },
    order: [[2, "desc"]],
    destroy: true,
};

onMounted(() => {
    handleEventDetail();

    // delegate event listener on edit participant button
    $(document).on("click", ".editParticipantBtn", (event) => {
        const id = event.currentTarget.dataset.id;

        emit(
            "editParticipant",
            allParticipants.filter((participant) => participant.id == id)[0]
        );
    });

    // delegate event listener on delete participant button
    $(document).on("click", ".deleteParticipantBtn", (event) => {
        const participant = event.currentTarget.dataset;
        participantToDelete.value = participant.id;

        confirmationTitle.value = "Parmently Delete";
        confirmationMessage.value = `Are you sure you want to permanently delete <b>'${participant.name}'</b>?`;

        showModal("#confirmationModal", ".modal-dialog");
    });
});

async function deleteParticipant() {
    $sectionIsLoading.value = true;

    $.ajax(`${API_URL}event_participants/${participantToDelete.value}`, {
        method: "DELETE",
        headers: {
            authorization: API_KEY,
        },
        success: (res) => {
            $sectionIsLoading.value = false;

            showModal();

            setTimeout(() => {
                $("#alertMessageParagraph").text(res.message);
                $("#alertStatusDiv").removeClass("alert-undefined");
                $("#alertStatusDiv").removeClass("alert-warning");
                $("#alertStatusDiv").removeClass("alert-danger");
                $("#alertStatusDiv").addClass("alert-success");
                $("#alertModalBody > .modal-content").removeClass(
                    "border-undefined"
                );
                $("#alertModalBody > .modal-content").addClass(
                    "border-success"
                );
            }, 150);

            tableKey.value += 1;
        },
        error: (error) => {
            $sectionIsLoading.value = false;

            showModal();

            setTimeout(() => {
                $("#alertMessageParagraph").text(error.responseJSON.message);
                $("#alertStatusDiv").removeClass("alert-undefined");
                $("#alertStatusDiv").removeClass("alert-warning");
                $("#alertStatusDiv").removeClass("alert-danger");
                $("#alertStatusDiv").addClass("alert-danger");
                $("#alertModalBody > .modal-content").removeClass(
                    "border-undefined"
                );
                $("#alertModalBody > .modal-content").addClass("border-danger");
            }, 150);

            tableKey.value += 1;
        },
    });
}

const handleEventDetail = () => {
    // don't add click event listener on table rows
    // if there are no participants to show
    if (!allParticipants.length) return;

    const dt = table.value.dt;

    dt.on("click", "tr", function () {
        const { id } = dt.row(this).data();
        displayEventPage(id);
    });
};

function displayEventPage(eventId) {
    router.push({ name: "specific-event", params: { id: eventId } });
}

watch(
    () => refresh.value,
    () => {
        // update table Key to force data table to re render
        tableKey.value += 1;
    }
);
</script>

<style scoped>
.cursorPointer {
    cursor: pointer;
}

th,
td {
    padding: 0.9rem;
    font-size: 0.9rem;
}
</style>
