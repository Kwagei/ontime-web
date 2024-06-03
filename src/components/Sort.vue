<template>
    <div
        class="col-md-3 sort bg-white d-flex justify-content-between"
        style="border: 0.125rem solid black"
    >
        <!-- <div class="dropdown">
            <button
                class="btn btn-dropdown dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                Dropdown button
            </button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li>
                    <a class="dropdown-item" href="#">Something else here</a>
                </li>
            </ul>
        </div>  -->
        <button
            class="btn btn-secondary w-25"
            type="button"
            data-bs-theme="dark"
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
                    d="M85 82.5H42.4a5 5 0 010-10H85a5 5 0 010 10M69.9 67.4H42.3a5 5 0 010-10h27.6a5 5 0 010 10M55 52.5H42.5a5 5 0 010-10H55a5 5 0 010 10M37.43 36.082l-4.93-4.93V77.35a5.05 5.05 0 01-5.05 5.05c-2.789 0-4.95-2.261-4.95-5.05V31.154l-4.937 4.937a4.85 4.85 0 11-6.859-6.86l12.828-12.827a4.84 4.84 0 013.841-1.4Q27.436 15 27.5 15c.096 0 .205-.005.3 0a4.8 4.8 0 013.668 1.42L44.28 29.232a4.844 4.844 0 11-6.85 6.85"
                />
            </svg>
        </button>
        <button
            class="btn hover-btn"
            style="
                width: 80%;
                height: 100%;
                border: none;
                border-radius: 0.25rem;
                border-left: 0.0125rem solid #ccc;
                font-weight: 400;
                color: black;
            "
        >
            Last Updated On
        </button>
    </div>
</template>

<style scoped>
.sort {
    padding: 0 !important;
}
.sort svg {
    height: 20px !important;
    margin: 0 !important;
}
</style>
