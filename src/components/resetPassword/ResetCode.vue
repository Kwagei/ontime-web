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

                    <!-- VERIFICATION FORM -->
                    <form
                        @submit.prevent="onSubmit"
                        class="row justify-content-center"
                        id="reset-form"
                    >
                        <div class="text-center">
                            <h5 class="m-0">Enter verification code</h5>
                            <p>
                                We've sent a code to
                                <b>{{ formattedEmail }}</b>
                            </p>
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

                        <!-- CODE BOX -->
                        <div
                            class="row col-md-12 d-flex justify-content-between align-items-center mb-3"
                        >
                            <input
                                type="text"
                                v-model="codeOne"
                                :class="[
                                    'form-control text-center code-input',
                                    isCodeValue && 'code-value',
                                ]"
                                maxlength="1"
                            />
                            <input
                                type="text"
                                :class="[
                                    'form-control text-center code-input',
                                    isCodeValue && 'code-value',
                                ]"
                                v-model="codeTwo"
                                maxlength="1"
                            />
                            <input
                                type="text"
                                :class="[
                                    'form-control text-center code-input',
                                    isCodeValue && 'code-value',
                                ]"
                                v-model="codeThree"
                                maxlength="1"
                            />
                            <input
                                type="text"
                                :class="[
                                    'form-control text-center code-input',
                                    isCodeValue && 'code-value',
                                ]"
                                v-model="codeFour"
                                maxlength="1"
                            />
                        </div>

                        <div
                            class="col-md-12 d-flex gap-2 justify-content-center mb-3"
                        >
                            <button
                                type="submit"
                                class="btn btn-primary"
                                :disabled="!isCodeComplete || loading"
                                style="flex: 0 0 49%"
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
                                Verify
                            </button>
                            <button
                                class="btn btn-outline-secondary"
                                type="button"
                                @click="cancelVerification"
                                style="flex: 0 0 49%"
                            >
                                Cancel
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
import { useRouter, useRoute } from "vue-router";

import { formValidation } from "@/util/util";
import { resetPassword } from "@/assets/js";
import store from "@/store";
const route = useRoute();
const router = useRouter();
const email = ref(route.query.email);

const loading = ref(false);

const formattedEmail = computed(() => {
    const [local, domain] = email.value.split("@");
    return `${local.split("").fill("*", 1).join("")}@${domain}`;
});

const onSubmit = async () => {
    if (loading.value) return;

    // Check if code is not complete.
    if (!isCodeComplete.value) {
        return;
    }

    loading.value = true;

    // Make an API call to reset user password.
    const { ok, result } = await resetPassword({
        code: code.value,
        email: email.value,
        timestamp: generateSubmissionTimestamp(),
    });

    loading.value = false;

    // Display a warning message based on the API response
    warning(
        result.message,
        ok ? "success" : "danger",
        ok ? "#83d61631" : "#ea060629"
    );

    if (ok) {
        store.state.hasVisitedResetPassword = true;
        store.state.resetPasswordUser = result.data.user_id;

        setTimeout(() => {
            router.push({
                name: "new-password",
            });
        }, 1000);
    }
};

const codeOne = ref("");
const codeTwo = ref("");
const codeThree = ref("");
const codeFour = ref("");
const isCodeValue = ref(false);

const isWarning = ref(false);
const warningMessage = ref("");
const warningStatus = ref("");
const warningBgColor = ref("");

const isCodeComplete = computed(() => {
    return [
        codeOne.value,
        codeTwo.value,
        codeThree.value,
        codeFour.value,
    ].every((code) => code);
});

const code = computed(() => {
    return `${codeOne.value}${codeTwo.value}${codeThree.value}${codeFour.value}`;
});

const generateSubmissionTimestamp = () => {
    return new Date();
};

const signIn = () => {
    router.push("/sign-in");
};

const cancelVerification = () => {
    router.back();
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
.code-input {
    width: 5rem !important;
    height: 4.5rem;
    font-size: 3rem;
    font-weight: 400;
}

.code-value {
    border-color: 1px solid #ff7900 !important;
}
</style>
