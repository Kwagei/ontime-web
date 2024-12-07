<template>
    <AlertModal :data="alert" />

    <ConfirmationModal
        title="Permanently Delete User"
        :message="confirmationMessage"
        @confirmed="deleteUser"
    />

    <div id="visitor-view" class="d-flex flex-column container">
        <div
            class="d-flex justify-content-between align-items-center container p-0 mx-auto"
            style="margin-top: 0.3rem"
        >
            <BreadCrumbs :breadCrumbs="activeBreadCrumbs" />
        </div>

        <div
            class="mt-1 form-control input rounded"
            style="margin: auto; padding: 3rem"
        >
            <form
                class="row g-3 needs-validation"
                novalidate
                @submit.prevent="onSubmit"
            >
                <!-- USERNAME -->
                <div class="col-md-6">
                    <label for="username" class="form-label is-required">
                        Username
                        <span class="visually-hidden"> (required) </span>
                    </label>
                    <div class="input-group has-validation">
                        <input
                            type="text"
                            class="form-control"
                            id="username"
                            aria-describedby="inputGroupPrepend"
                            v-model="username"
                            required
                        />
                        <div class="invalid-feedback">
                            Please provide a Username.
                        </div>
                    </div>
                </div>

                <!-- PASSWORD -->
                <div class="col-md-6" v-if="!route.params.id">
                    <label for="password" class="form-label is-required">
                        {{ route.params.id ? "New " : "" }} Password
                        <span class="visually-hidden"> (required) </span>
                    </label>
                    <div class="input-group">
                        <input
                            type="password"
                            :class="[
                                validPassword && 'validated',
                                'form-control',
                            ]"
                            v-model="password"
                            id="password"
                            aria-describedby="inputGroupPrepend"
                            autocomplete="off"
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
                    <div class="helpMessage form-text">
                        Password should be min 6 characters with at least one
                        upper, lower case, digit and symbol.
                    </div>
                </div>

                <!-- EMAIL -->
                <div class="col-md-6">
                    <label for="email" class="form-label is-required"
                        >Email</label
                    >
                    <div class="input-group">
                        <input
                            type="email"
                            :class="[validEmail && 'validated', 'form-control']"
                            v-model="email"
                            id="email"
                            aria-describedby="inputGroupPrepend"
                        />
                        <div
                            :class="[
                                'invalid-feedback',
                                validEmail && 'show-feedback',
                            ]"
                        >
                            {{ validEmailMessage }}
                        </div>
                    </div>
                    <div class="helpMessage form-text">
                        Enter a valid email address. For example:
                        john12@gmail.com
                    </div>
                </div>

                <div class="col-md-12 d-flex gap-2 justify-content-end">
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="loading"
                    >
                        <div
                            class="spinner-border submitBtnLoader"
                            role="status"
                            v-if="loading"
                        >
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        {{ route.params.id ? "Update" : "Save" }}
                    </button>
                    <button
                        @click="confirmDeletion"
                        class="btn btn-danger"
                        v-if="route.params.id"
                        type="button"
                    >
                        <div
                            class="spinner-border submitBtnLoader"
                            role="status"
                            v-if="loading"
                        >
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        Delete
                    </button>
                    <button
                        type="button"
                        class="btn btn-outline-secondary"
                        data-bs-dismiss="modal"
                        @click="router.push('/users')"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import BreadCrumbs from "../BreadCrumbs.vue";
import AlertModal from "../modals/AlertModal.vue";
import {
    getSingleUser,
    registerUser,
    editUser,
    API_URL,
    API_KEY,
} from "@/assets/js/index.js";
import {
    emailValidation,
    showModal,
    getElement,
    removeClass,
    formValidation,
    passwordValidation,
} from "@/util/util.js";
import ConfirmationModal from "../modals/ConfirmationModal.vue";

// Route and State
const route = useRoute();
const router = useRouter();

// visitor data
const username = ref("");
const email = ref("");
const password = ref("");

const alert = ref({
    status: "",
    title: "",
    message: "",
    pageLink: "",
});

let userInfo;
const confirmationMessage = ref("");

// Form status and breadcrumbs
const activeBreadCrumbs = ref([]);
const breadCrumbs = defineModel("breadCrumbs");
breadCrumbs.value = route.path.split("/").slice(1);
activeBreadCrumbs.value = breadCrumbs.value;

const loading = ref(false);

// Functions
const onSubmit = async () => {
    if (loading.value) return;

    if (!username.value || !email.value) return;

    // ensure password is given when creating a new user
    if (!route.params.id && !password.value) return;

    const user = {
        username: username.value,
        email: email.value,
        roles: ["standard"],
    };

    if (!route.params.id) user.password = password.value;

    loading.value = true;

    const response = !route.params.id
        ? await registerUser(user)
        : await editUser(userInfo.id, user);

    loading.value = false;

    alert.value.status = response.ok ? "success" : "danger";
    alert.value.message = response.result.message;
    showModal();

    // Reset form if the response is successful
    if (response.ok) {
        resetForm();

        if (route.params.id) router.push("/users");
    }
};

const fetchUser = async () => {
    if (route.params.id) {
        const id = route.params.id;
        const user = await getSingleUser({ id });

        if (user.status != 200) {
            alert.value.message = user.message;
            alert.value.status = "danger";

            showModal();
            return;
        }

        userInfo = user.data.users;

        // update references for input fields
        username.value = userInfo.username;
        email.value = userInfo.email;
    }
};

const validEmail = ref(false);
const validPassword = ref(false);
const validEmailMessage = ref("Please provide a valid email address");
const validPasswordMessage = ref(
    "Password should be min 6 characters with at least one upper, lower case, digit and symbol"
);

const validateEmail = (mail) => {
    if (!mail) {
        validEmail.value = false;
        validEmailMessage.value = "Please provide a valid email address";
        return;
    }
    const { valid, message } = emailValidation(mail);

    if (!valid) {
        validEmail.value = true;
        validEmailMessage.value = message;
    } else {
        validEmail.value = false;
    }
};

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
    () => email.value,
    (n) => {
        validateEmail(n);
    }
);

watch(
    () => password.value,
    (n) => {
        validatePassword(n);
    }
);

const resetForm = () => {
    username.value = "";
    email.value = "";
    password.value = "";

    // Remove validation classes
    const form = getElement(".needs-validation");
    removeClass(form, "was-validated");
};

function confirmDeletion() {
    confirmationMessage.value = `Are you sure you want to permanently delete the <strong>${userInfo.username}</strong>?`;
    showModal("#confirmationModal");
}

// Lifecycle Hooks
onMounted(async () => {
    formValidation();
    await fetchUser();
});

async function deleteUser() {
    $.ajax(`${API_URL}users/${route.params.id}`, {
        method: "DELETE",
        headers: {
            authorization: API_KEY.value,
        },
        success: () => {
            alert.value.message = "User Successfully Deleted";
            alert.value.status = "success";

            showModal();

            setTimeout(() => router.push("/users"), 1000);
        },
        error: (err) => {
            console.error("error deleting user: ", err);

            alert.value.message = err.responseJSON.message;
            alert.value.status = "danger";

            showModal();
        },
    });
}
</script>

<style scoped>
.show-feedback {
    display: flex;
}

.validated {
    border-color: var(--bs-form-invalid-border-color) !important;
}

#list-options {
    padding: 0.6rem 0.5rem;
    font-weight: 400;
    border: 0.0125rem solid #ccc;
    border-radius: 0.25rem !important;
}
svg {
    height: 20px !important;
    margin: 0 !important;
}

#visitor-view {
    gap: 1.5rem;
}

select {
    padding: calc(1rem - 1px) 1rem calc(0.5rem + 1px);
}
</style>
