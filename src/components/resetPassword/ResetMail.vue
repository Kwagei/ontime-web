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

                    <!-- RESET PASSWORD FORM -->
                    <form
                        @submit.prevent="onSubmit"
                        class="needs-validation"
                        novalidate
                        id="reset-form"
                    >
                        <div class="text-center">
                            <h5 class="m-0">Reset password</h5>
                            <p>Enter email for verification code</p>
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

                        <!-- EMAIL -->
                        <div data-mdb-input-init class="form-outline mb-3">
                            <label class="form-label is-required" for="email"
                                >Email<span class="visually-hidden">
                                    (required)</span
                                ></label
                            >
                            <div class="input-group has-validation">
                                <input
                                    type="email"
                                    id="email"
                                    class="form-control form-control-lg"
                                    aria-describedby="inputGroupPrepend"
                                    v-model="email"
                                    required
                                />

                                <div class="invalid-feedback">
                                    Please provide an email.
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
                            >
                                Submit
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
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

import { formValidation, getElement, removeClass } from "@/util/util";
import { resetPassword } from "@/assets/js";
import store from "@/store";
const email = ref("");
const router = useRouter();
const isWarning = ref(false);
const warningMessage = ref("");
const warningStatus = ref("");
const warningBgColor = ref("");

const onSubmit = async () => {
    // Check if email is not empty.
    if (!email) {
        return;
    }

    // Make an API call to reset user password.
    const { ok, result } = await resetPassword({
        email: email.value,
    });

    isWarning.value = true;

    // Display a warning message based on the API response
    warning(
        result.message,
        ok ? "success" : "danger",
        ok ? "#83d61631" : "#ea060629"
    );

    // After 1 second, perform further actions based on the API response
    if (ok) {
        store.state.hasVisitedResetPassword = true;

        setTimeout(() => {
            router.push({
                name: "reset-code",
                query: { email: email.value },
            });
        }, 1000);
    }
};

const signIn = () => {
    router.push("/sign-in");
};

onMounted(async () => {
    formValidation();
});

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

<style scoped>
.hide {
    display: none !important;
}
</style>
