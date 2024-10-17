<template>
    <!-- Nav Section -->
    <nav class="navbar navbar-expand-lg" id="shadow">
        <div
            class="container-fluid d-flex justify-content-between align-items-center p-2"
        >
            <div class="navbar-brand">
                <a class="stretched-link" href="#">
                    <img
                        style="min-height: 50px"
                        src="../assets/images/ontime_logo.jpg"
                        width="50"
                        height="50"
                        alt="Home"
                        loading="lazy"
                    />
                </a>
            </div>

            <button
                id="navBarToggler"
                style="order: 0 !important"
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
                @click="toggleNavBar"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="#about"> About </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" type="submit" href="#features">
                            Features
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" type="submit" href="#demo">
                            Demo
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" type="submit" href="#team">
                            Our Team
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/sign-in">Sign In</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <!-- Hero Section -->
    <div id="app">
        <section class="p-3 mb-2 fw-bold bg-light">
            <div class="container">
                <h1 class="display-2">
                    Stay Connected With <span class="orange">On</span>Time
                </h1>
                <p class="fs-4">
                    <span class="orange">On</span>Time is a check-in and events
                    attendance system designed to streamline the process of
                    recording visitor information, managing attendance for
                    events, data visualization and management.
                </p>
                <router-link :to="{ name: 'dashboard' }">
                    <button
                        type="button"
                        class="btn btn-primary"
                        style="padding: 0.5rem 1.5rem; font-weight: 600"
                    >
                        Dashboard
                    </button>
                </router-link>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="about-section">
            <div class="container fs-4">
                <h2 class="section-title">About OnTime</h2>
                <p>
                    OnTime is a comprehensive platform designed to streamline
                    organizational management, offering robust solutions for
                    attendance tracking, visitor check-ins, and event
                    scheduling. Tailored to enhance productivity and improve
                    team dynamics, OnTime simplifies daily operations with a
                    user-friendly interface, ensuring smooth processes from
                    workforce management to visitor handling. At places like the
                    Orange Digital Center (ODC), where visitors must undergo
                    detailed check-in and check-out procedures to ensure
                    security and prevent theft, OnTime can automate and optimize
                    these processes for greater efficiency.
                </p>
            </div>
        </section>

        <!-- Features Section -->
        <section class="feature-section" id="features">
            <div class="container">
                <h2>Features:</h2>
                <div class="row text-center gap-4">
                    <div class="col-md-5 features">
                        <img
                            src="../assets/images/dashboard.png"
                            alt="Visitor Check-ins"
                            class="img-fluid"
                        />
                        <h3>Dashboard</h3>
                        <p class="fs-5">
                            Easy to track the total number of people visiting
                            the ODC on a weekly basis. Insights on the number of
                            male and female students visiting weekly.Insights on
                            the total visits for the last 3 months.
                        </p>
                    </div>
                    <div class="col-md-5 features">
                        <img
                            src="../assets/images/check-in.png"
                            alt="Attendance Management"
                            class="img-fluid"
                        />
                        <h3>Check-In</h3>
                        <p class="fs-5">
                            Check-in, and check-out processes for visitors,
                            capturing information such as their name, host,
                            reason for visit, arrival time, and departure time.
                            Additionally, it will offer administrators an
                            interface for viewing visitor records, and
                            generating reports for analysis purposes.
                        </p>
                    </div>
                    <div class="col-md-5 features">
                        <img
                            src="../assets/images/events.png"
                            alt="Event Scheduling"
                            class="img-fluid"
                        />
                        <h3>Event Scheduling</h3>
                        <p class="fs-5">
                            Organize and manage events seamlessly with our
                            scheduling tools. Coordinate with your team, send
                            invites, and ensure everyone is on the same page
                            with our collaborative calendar features.
                        </p>
                    </div>
                    <div class="col-md-5 features">
                        <img
                            src="../assets/images/attendance.png"
                            alt="Event Scheduling"
                            class="img-fluid"
                        />
                        <h3>Attendance</h3>
                        <p class="fs-5">
                            Capturing attendance for a course has been done
                            manually on paper so far at the ODC. OnTime
                            automates this by recording attendance for a student
                            once they checked in.
                        </p>
                    </div>
                    <div class="col-md-5 features">
                        <img
                            src="../assets/images/import.png"
                            alt="Event Scheduling"
                            class="img-fluid"
                        />
                        <h3>Data Import</h3>
                        <p class="fs-5">
                            OnTime supports the fast and efficient importing of
                            data using CSV files, which simplifies the process
                            of handling large amounts of information. This
                            feature allows users to quickly upload visitor or
                            event data in bulk, making it easier to manage and
                            update records without manual input.
                        </p>
                    </div>
                    <div class="col-md-5 features">
                        <img
                            src="../assets/images/export.png"
                            alt="Event Scheduling"
                            class="img-fluid"
                        />
                        <h3>Data Export</h3>
                        <p class="fs-5">
                            OnTime supports the fast and efficient exporting of
                            data using CSV files, which simplifies the process
                            of handling large amounts of information. This
                            feature allows users to quickly download visitor or
                            event data in bulk, making it easier to manage and
                            update records without manual input.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Demo Credentials Section -->
        <section id="demo" class="demo-section">
            <div
                id="demoWrapper"
                class="container d-flex justify-content-center gap-3 align-items-center w-100"
            >
                <div class="w-50">
                    <h1 class="section-title">Demo Credentials</h1>
                    <p class="fs-4">
                        Try OnTime with the following credentials <br />
                        to explore the platform's features:
                    </p>
                </div>
                <div class="credentials-img d-flex">
                    <img src="../assets/images/demo2.png" alt="" />
                </div>
            </div>
        </section>

        <!-- Our Team Section -->
        <section id="team" class="team-section p-3 mb-2 fw-bold bg-light">
            <div id="teamWrapper" class="container">
                <h2 class="section-title">Our Team</h2>
                <div class="team-grid">
                    <div class="team-member">
                        <div class="team-img">
                            <img
                                src="../assets/images/peace.jpg"
                                alt="Team Member"
                                class="team-photo"
                            />
                        </div>
                        <div class="team-name">
                            <h3 class="team-name">Emmanuel Peace Browne</h3>
                        </div>
                        <div class="team-role">
                            <p class="team-role">Developer</p>
                        </div>
                    </div>
                    <div class="team-member">
                        <div class="team-img">
                            <img
                                src="../assets/images/dave.jpg"
                                alt="Team Member"
                                class="team-photo"
                            />
                        </div>
                        <div class="team-name">
                            <h3 class="team-name">Dave Wonnah</h3>
                        </div>
                        <div class="team-role">
                            <p class="team-role">Developer</p>
                        </div>
                    </div>
                    <div class="team-member">
                        <div class="team-img">
                            <img
                                src="../assets/images/jeedo.jpg"
                                alt="Team Member"
                                class="team-photo"
                            />
                        </div>
                        <div class="team-name">
                            <h3 class="team-name">Jee-do Gbozee Arkoi</h3>
                        </div>
                        <div class="team-role">
                            <p class="team-role">Developer</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Footer -->
        <footer class="footer navbar" data-bs-theme="dark">
            <h2 class="visually-hidden">Sitemap & information</h2>
            <div class="container-xxl footer-terms">
                <ul class="navbar-nav gap-md-3 py-2">
                    <li class="nav-link fw-bold">
                        © <span class="orange">On</span>Time 2024
                    </li>
                    <li>
                        <a class="nav-link" href="#">Terms and conditions</a>
                    </li>
                    <li><a class="nav-link" href="#">Privacy</a></li>
                    <li>
                        <a class="nav-link" href="#">Accessibility statement</a>
                    </li>
                    <li><a class="nav-link" href="#">Cookie policy</a></li>
                </ul>
            </div>
        </footer>
    </div>
</template>

<script>
$("#navBarToggler").on("click", () => {
    setTimeout(() => {
        if (window.innerWidth >= 1021) {
            $("#navbarNavDropdown").removeClass("show");
            $("#navbarNavDropdown").removeClass("collapsed");
        } else {
            $("#navbarNavDropdown").addClass("show");
            $("#navbarNavDropdown").addClass("collapsed");
        }
    }, 500);
});
</script>

<style>
/* General Styling */
body {
    font-family: "Arial", sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

#wrapper {
    position: relative !important;
}

#shadow {
    position: sticky;
    top: 0;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

@media (max-width: 1251px) {
    #demoWrapper {
        flex-direction: column !important;
    }

    .team-grid {
        justify-content: center !important;
        gap: 3rem !important;
    }
}

/* Hero Section */
.hero-section {
    color: white;
    text-align: center;
    padding: 100px 0;
}

.cta-button {
    background-color: #ff9800;
    border: none;
    padding: 15px 30px;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;
}

#flexlayout {
    display: flex;
}
.cta-button:hover {
    background-color: #e68900;
}

.row {
    display: flex;
    justify-content: space-between;
}

/* About Section */
.about-section {
    padding: 60px 0;
    background-color: #f9f9f9;
}

/* Features Section */
.feature-section {
    padding: 60px 0;
    margin-bottom: 10px;
    margin-top: 10px;
    background-color: #f9f9f9;
}

.features {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 25px;
    padding: 1.5rem;
}

.features img {
    margin-bottom: 18px;
}

/* Demo Credentials Section */
.demo-section {
    padding: 60px 0;
    margin-bottom: 10px;
    margin-top: 10px;
    background-color: #f9f9f9;
}

.credentials-img {
    justify-content: space-between;
}

.features img,
.features,
.credentials-img img {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.demo-credentials ul {
    list-style-type: none;
    padding-left: 0;
}

.demo-credentials li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.credential-icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
}

/* Our Team Section */
.team-section {
    padding: 60px 0;
    text-align: center;
    background-color: #f5f5f5;
}

.team-grid {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
}

.section-title {
    margin-bottom: 40px;
}

.team-photo {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: auto;
    object-fit: cover;
    margin-bottom: 10px;
}

.orange {
    color: #e68900;
}
</style>

