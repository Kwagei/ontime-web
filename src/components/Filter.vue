<template>
    <div
        class="col-md-3 filter bg-white d-flex justify-content-between"
        style="border: 0.0125rem solid #ccc; border-radius: 0.25rem"
    >
        <button
            class="btn hover-btn"
            style="
                width: 80%;
                height: 100%;
                border: none;
                border-radius: 0.25rem;
                border-right: 0.0125rem solid #ccc;
                padding: 0.8rem;
                font-weight: 400;
                color: black;
            "
        >
            <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill="#000000"
                    fill-rule="evenodd"
                    d="M90 12.5V20L57.5 52.5v40l-15-15v-25L10 20v-7.5a5 5 0 015-5h70a5 5 0 015 5"
                />
            </svg>
            Filter
        </button>
        <button
            class="flex-grow-1 hover-btn"
            style="
                border: none;
                background-color: white;
                border-radius: 0.25rem;
            "
        >
            <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill="#000000"
                    fill-rule="evenodd"
                    d="M81.75 67.617a5 5 0 010 7.066l-7.067 7.066a5 5 0 01-7.067 0L49.95 64.083 32.283 81.749a5 5 0 01-7.066 0l-7.066-7.066a5 5 0 010-7.067L35.817 49.95 18.151 32.283a5 5 0 010-7.066l7.066-7.066a5 5 0 017.067 0L49.95 35.817l17.667-17.666a5 5 0 017.066 0l7.066 7.066a5 5 0 010 7.067L64.083 49.95Z"
                />
            </svg>
        </button>
    </div>
</template>

<style>
.filter {
    padding: 0 !important;
}
.filter svg {
    height: 20px !important;
    margin: 0 !important;
}
</style>
