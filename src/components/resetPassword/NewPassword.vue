<template>
    <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
                class="card shadow-2-strong boxShadow"
                style="border-radius: 1rem"
            >
                <div id="mobileFormWrapper" class="card-body p-5">
                    <div class="d-flex justify-content-center mb-4">
                        <img
                            src="@/assets/images/ontime_logo.jpg"
                            style="width: 9rem"
                            alt=""
                        />
                    </div>

                    <!-- NEW PASSWORD FORM -->
                    <form
                        @submit.prevent="onSubmit"
                        class="row justify-content-center needs-validation"
                        id="reset-form"
                        novalidate
                    >
                        <div class="text-center mb-3">
                            <h5 class="m-0">Set new Password</h5>
                        </div>

                        <div
                            v-if="isWarning"
                            class="py-2 mb-3 text-center rounded"
                            :style="`background-color: ${warningBgColor};`"
                            id="message"
                        >
                            <span :class="warningStatus">{{
                                warningMessage
                            }}</span>
                        </div>

                        <!-- NEW PASSWORD -->
                        <div class="form-outline mb-3">
                            <label
                                for="new-password"
                                class="form-label is-required"
                                >Password<span class="visually-hidden">
                                    (required)</span
                                ></label
                            >

                            <div class="input-group has-validation">
                                <div class="input-group">
                                    <input
                                        type="password"
                                        :class="[
                                            validPassword && 'validated',
                                            'form-control form-control-lg',
                                        ]"
                                        v-model="newPassword"
                                        id="new-password"
                                        aria-describedby="inputGroupPrepend"
                                        required
                                        autocomplete="on"
                                    />

                                    <div
                                        :class="[
                                            'invalid-feedback',
                                            validPassword && 'show-feedback',
                                        ]"
                                    >
                                        {{ validPasswordMessage }}
                                    </div>
                                </div>
                                <div class="invalid-feedback">
                                    Please provide a new password.
                                </div>
                                <div class="helpMessage form-text">
                                    Password should be min 6 characters with at
                                    least one upper, lower case, digit and
                                    symbol.
                                </div>
                            </div>
                        </div>

                        <div
                            class="col-md-12 d-flex gap-3 justify-content-center mb-3"
                        >
                            <button
                                type="submit"
                                class="btn btn-primary w-100"
                                style="padding: 0.7rem 0.5rem"
                                :disabled="loading"
                            >
                                <div
                                    class="spinner-border submitBtnLoader"
                                    role="status"
                                    v-if="loading"
                                >
                                    <span class="visually-hidden"
                                        >Loading...</span
                                    >
                                </div>
                                Reset Password
                            </button>
                        </div>

                        <!-- Checkbox -->
                        <div
                            class="form-check d-flex justify-content-center align-items-center gap-1"
                        >
                            <div
                                class="d-flex justify-content-end form-check-label"
                            >
                                <p>
                                    Already have an account?
                                    <a @click="signIn" href="#"
                                        ><b>Sign in</b></a
                                    >
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import { formValidation, passwordValidation } from "@/util/util";
import store from "@/store";
import { API_URL, STANDARD_API_KEY } from "@/assets/js";
const router = useRouter();

const isWarning = ref(false);
const warningMessage = ref("");
const warningStatus = ref("");
const warningBgColor = ref("");

const loading = ref(false);

// Passwords
const newPassword = ref("");
const validPassword = ref(false);
const validPasswordMessage = ref(
    "Password should be min 6 characters with at least one upper, lower case, digit and symbol"
);

const validatePassword = (pwd) => {
    if (!pwd) {
        validPassword.value = false;
        validPasswordMessage.value =
            "Password should be min 6 characters with at least one upper, lower case, digit and symbol";
        return;
    }

    const { valid, message } = passwordValidation(pwd);

    if (!valid) {
        validPassword.value = true;
        validPasswordMessage.value = message;
    } else {
        validPassword.value = false;
    }
};

watch(
    () => newPassword.value,
    (n) => {
        validatePassword(n);
    }
);

const onSubmit = async () => {
    if (loading.value) return;

    // Check if code is not complete.
    if (!newPassword.value) {
        return;
    }

    const user_id = store.state.resetPasswordUser;

    loading.value = true;

    // Make an API call to reset user password.
    const { ok, result } = await resetUserPassword(user_id, newPassword.value);

    loading.value = false;

    // // Display a warning message based on the API response
    warning(
        result.message,
        ok ? "success" : "danger",
        ok ? "#83d61631" : "#ea060629"
    );

    if (ok) {
        setTimeout(() => {
            router.push("/sign-in");
        }, 1000);
    }
};

const signIn = () => {
    router.push("/sign-in");
};

onMounted(async () => {
    formValidation();
});

const resetUserPassword = async (id, password) => {
    try {
        const options = {
            method: "PUT",
            headers: {
                authorization: STANDARD_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, password }),
        };

        const response = await fetch(
            `${API_URL}reset-password/change`,
            options
        );

        const result = await response.json();

        return { ok: response.ok, result };
    } catch (error) {
        console.error("Error:", error);
        return {
            ok: false,
            result: { message: "Unable to change password, try again" },
        };
    }
};

/**
 * Displays a warning message with the specified content, class name, and background color.
 * The message will be automatically hidden after 10 seconds.
 *
 * @param {string} message - The message text to display.
 * @param {string} className - The CSS class name to apply to the warning message element.
 * @param {string} bgColor - The background color to apply to the warning message container.
 */
const warning = (message, className, bgColor) => {
    isWarning.value = true;
    warningMessage.value = message;
    warningStatus.value = className;
    warningBgColor.value = bgColor;
};
</script>

<style>
.code-input {
    width: 4rem !important;
    height: 3.5rem;
}

.show-feedback {
    display: flex;
}

.validated {
    border-color: var(--bs-form-invalid-border-color) !important;
}
</style>
