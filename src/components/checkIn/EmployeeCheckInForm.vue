<template>
    <AlertModal :data="alert" />

    <div class="table-responsive p-0 d-flex flex-column" style="gap: 0.7rem">
        <div
            id="checkInTypeWrapper"
            class="d-flex justify-content-center gap-0"
        >
            <router-link to="/check-in">
                <button class="checkInTypeBtn">Visitor</button>
            </router-link>
            <router-link to="/check-in/employee">
                <button class="checkInTypeBtn activeCheckInTypeBtn">
                    Employee
                </button>
            </router-link>
        </div>
        <div id="checkInDigitsWrapper">
            <div class="mt-4">
                <span class="text-secondary fs-5 fw-bold">
                    Please Enter Your:
                </span>
                <span class="d-block text-primary my-3 fs-3 fw-bold">
                    Employee Check In Code
                </span>
            </div>

            <form class="container" @submit.prevent="checkIn">
                <div
                    id="checkInDigitsInputWrapper"
                    class="d-flex justify-content-between gap-2 mb-3"
                >
                    <input
                        autofocus
                        @input="handleCodeInput"
                        @keyup.delete="handleDelete"
                        @focusin="selectedInputIdx = 0"
                        v-model="digits[0]"
                        class="codeInput"
                    />
                    <input
                        @input="handleCodeInput"
                        @keyup.delete="handleDelete"
                        @focusin="selectedInputIdx = 1"
                        v-model="digits[1]"
                        class="codeInput"
                    />
                    <input
                        @input="handleCodeInput"
                        @keyup.delete="handleDelete"
                        @focusin="selectedInputIdx = 2"
                        v-model="digits[2]"
                        class="codeInput"
                    />
                    <input
                        @input="handleCodeInput"
                        @keyup.delete="handleDelete"
                        @focusin="selectedInputIdx = 3"
                        v-model="digits[3]"
                        class="codeInput"
                    />
                </div>

                <div class="d-flex justify-content-evenly gap-2">
                    <button
                        type="submit"
                        class="btn btn-primary"
                        style="width: 70%"
                        :disabled="digits.join('').length < 4"
                    >
                        Check In
                    </button>
                    <button
                        @click="digits = new Array().fill(0)"
                        type="button"
                        class="btn btn-secondary"
                        style="width: 30%"
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { getCurrentInstance, ref } from "vue";
import AlertModal from "../modals/AlertModal.vue";
import { showModal } from "@/util/util";
import { API_KEY, API_URL } from "@/assets/js";

const selectedInputIdx = ref(0);
const digits = ref(new Array().fill(0));

const alert = ref({
    message: "",
    status: "success",
    pageLink: "",
});
const $sectionIsLoading =
    getCurrentInstance().appContext.config.globalProperties.$sectionIsLoading;

function checkIn() {
    const code = digits.value.join("");

    if (code.length < 4) {
        alert.value.message = "Invalid Employee Code";
        alert.value.status = "warning";

        showModal();
        return;
    }

    $sectionIsLoading.value = true;

    try {
        $.ajax(`${API_URL}employee_attendance`, {
            headers: {
                authorization: API_KEY.value,
            },
            data: { code },
            method: "POST",
            ContentType: "application/json",
            success: (res) => {
                console.log("Checked In: ", res);

                alert.value.message = res.message;
                alert.value.status = "success";
                alert.value.pageLink = "/employee-attendance";

                showModal();

                $sectionIsLoading.value = false;
            },
            error: (err) => {
                console.error("error checking employee in: ", err.responseJSON);

                alert.value.message = err.responseJSON.message;
                alert.value.status = "danger";

                showModal();

                $sectionIsLoading.value = false;
            },
        });
    } catch (err) {
        console.error("error checking employee in: ", err.responseJSON);

        alert.value.message = err.responseJSON.message;
        alert.value.status = "danger";

        showModal();
    }
}

function handleDelete() {
    if (selectedInputIdx.value > 0) {
        document
            .querySelectorAll(".codeInput")
            [selectedInputIdx.value - 1].focus();
    }
}

function handleCodeInput(event) {
    const value = event.target.value;

    if (!value) return;

    // ensure single character per input field
    if (value.length > 1) {
        digits.value[selectedInputIdx.value] = value.slice(1);
        event.target.value = value.slice(1);
    }

    // ensure only Integers are typed
    if (value != "0" && !Number(value)) {
        digits.value[selectedInputIdx.value] = "";
        event.target.value = "";
    }
    // move to the next input(if any) if a valid integer was typed
    else if (selectedInputIdx.value < 3) {
        document
            .querySelectorAll(".codeInput")
            [selectedInputIdx.value + 1].focus();
    }
}
</script>

<style scoped>
.codeInput {
    border: 1px solid #aaa;
    outline: 1px solid #aaa;
    height: 100px;
    width: 90px;
    font-size: 45px;
    text-align: center;
    font-weight: 900;
    color: #333;
    cursor: pointer;
    caret-color: transparent;
}

#checkInDigitsWrapper {
    max-width: 700px;
    align-self: center;
    text-align: center;
}

@media (max-width: 419px) {
    .checkInTypeBtn {
        width: 100%;
    }

    #checkInDigitsInputWrapper {
        justify-content: center !important;
    }

    .codeInput {
        width: 20%;
        height: 70px;
    }
}
</style>
