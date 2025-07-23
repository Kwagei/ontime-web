<template>
    <div class="overflow-hidden">
        <!-- Nav Section -->
        <nav class="navbar navbar-expand-lg" id="shadow">
            <div
                class="container-fluid d-flex justify-content-between align-items-center p-2"
            >
                <div class="navbar-brand">
                    <a class="stretched-link" href="/">
                        <img
                            style="min-height: 50px"
                            src="../assets/images/ontime_logo.jpg"
                            width="80"
                            height="80"
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
                            <a class="nav-link" href="#problem">
                                The Problem
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#features"> Features </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#test"> Test App </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#team"> Our Team </a>
                        </li>
                        <li @click="signOut" v-if="loggedIn" class="nav-item">
                            <a class="nav-link" style="cursor: pointer">
                                Sign Out
                            </a>
                        </li>
                        <li @click="signOut" v-else class="nav-item">
                            <a class="nav-link" href="/sign-in">Sign In</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <!-- Hero Section -->
        <div id="app">
            <section id="section">
                <div id="sectionOverlay"></div>
                <div id="sectionWrapper" class="mx-auto">
                    <p class="sectionText fw-bold">
                        <span class="orange">On</span>Time is a visitors and
                        events management system designed to streamline the
                        process of recording visitor information, managing
                        events attendance, scheduling events, employees
                        attendance, data visualization &amp; management, etc.
                    </p>
                    <router-link :to="{ name: 'dashboard' }">
                        <button type="button" class="btn btn-primary">
                            Dashboard
                        </button>
                    </router-link>
                </div>
            </section>

            <!-- About Section -->
            <section id="about" class="about-section aboutWrapper">
                <div class="container mx-auto fs-4">
                    <h2 class="section-title">
                        About <span class="orange">On</span>Time
                    </h2>
                    <p>
                        OnTime is a comprehensive platform designed to
                        streamline organizational management, offering robust
                        solutions for tracking events attendance, visitor
                        check-ins, employees check-in and event scheduling.
                        Tailored to enhance productivity and improve team
                        dynamics, OnTime simplifies daily operations with a
                        user-friendly interface, ensuring smooth processes from
                        workforce management to visitor handling.
                    </p>
                </div>
            </section>

            <!-- The Problem Section -->
            <section id="problem" class="problem-section problemWrapper">
                <div class="container mx-auto fs-4">
                    <h2 class="section-title">The Problem</h2>
                    <p>
                        At most entities, using our partner Orange Digital
                        Center (ODC) as a case study, visitors, employees, event
                        attendees or guests must undergo a lengthy procedure
                        before entering and leaving the premises. The procedure
                        involves the collection of personal information (name,
                        phone number, address, arrival time, departure time,
                        etc), the purpose of their visit, and a detailed account
                        of the items in the visitor's possession (backpack,
                        laptop, etc). This is done as a measure to mitigate the
                        risk of theft. When checking out, the items in the
                        visitor's possession are verified to ensure they match
                        the items declared upon check-in. OnTime provides a
                        holistic solution for managing the entry and exit of
                        visitors, employees, event attendees and guests to the
                        ODC. <span class="orange">On</span>Time simplifies the
                        registration, check-in, and check-out processes for
                        visitors, capturing relevant information such as their
                        name, host, reason for visit, arrival time, and
                        departure time. The bio-data of the visitors are stored
                        in the system effectively effectively factoring out the
                        repetitive step of entering bio-data on each visit.
                        Employees are assigned check-in code to avoid repeatedly
                        entering their bio-data and arrival time, which the
                        system automatically inputs.
                        <span class="orange">On</span>Time also eases event
                        attendees / participants check-in by providing a feature
                        to import participants prior to the event. In this way,
                        when the participant arrives, the events managers just
                        need to confirm whether their name is on the list.
                        Additionally, it will offer administrators a web-based
                        interface for viewing visitor records and generating
                        reports for analysis purposes.
                    </p>
                </div>
            </section>

            <!-- Features Section -->
            <section class="feature-section" id="features">
                <div class="container mx-auto">
                    <h2 class="section-title">Features</h2>
                    <div class="row text-center gap-5 justify-content-center">
                        <!-- Dashboard -->
                        <div class="col-md-5 features">
                            <img
                                src="../assets/images/features/dashboard.png"
                                alt="Visitor Check-ins"
                                class="img-fluid"
                            />
                            <h3>Dashboard</h3>
                            <p class="fs-5">
                                Track the total number of visits, visitors, and
                                events. Insights on the number of male and
                                female visitors for a week or the last 3 months.
                            </p>
                        </div>

                        <!-- Check In -->
                        <div class="col-md-5 features">
                            <img
                                src="../assets/images/features/visitor-check-in.png"
                                alt="Visitor Check In"
                                class="img-fluid"
                            />
                            <h3>Visitor Check-In</h3>
                            <p class="fs-5">
                                Check-in, and check-out processes for visitors
                                after their their first visit when their
                                bio-data are captured, will be as easy as
                                searching for their name or contact then,
                                entering their reason for visit and items if
                                necessary. Additionally, it will offer
                                administrators an interface for viewing visitor
                                records, and generating reports for analysis
                                purposes.
                            </p>
                        </div>

                        <!-- Event - Check In -->
                        <div class="col-md-5 features">
                            <img
                                src="../assets/images/features/events.png"
                                alt="Event Check In"
                                class="img-fluid"
                            />
                            <h3>Event Check-In</h3>
                            <p class="fs-5">
                                Seamlessly checks registered participants in for
                                an event, keeping track of necessary information
                                for all participant checking in. This process
                                synchronizes with the event's attendance.
                            </p>
                        </div>

                        <!-- Event Attendance -->
                        <div class="col-md-5 features">
                            <img
                                src="../assets/images/features/attendance.png"
                                alt="Event Attendance"
                                class="img-fluid"
                            />
                            <h3>Event Attendance</h3>
                            <p class="fs-5">
                                At most entities, capturing attendance for an
                                event has been done manually on paper so far.
                                <span class="orange">On</span>Time automates
                                this process by recording attendance for each
                                participant after being checked in.
                            </p>
                        </div>

                        <!-- Employee Check In -->
                        <div class="col-md-5 features">
                            <img
                                src="../assets/images/features/employee-check-in.png"
                                alt="Employee Check In"
                                class="img-fluid"
                            />
                            <h3>Employee Check In</h3>
                            <p class="fs-5">
                                With <span class="orange">On</span>Time, on each
                                day of work, an employee can simply enter their
                                personal check in code, not having to bother
                                with the stress of repetitively writing name,
                                contact, arrival time, etc daily.
                            </p>
                        </div>

                        <!-- Visit / Check In Purpose -->
                        <div class="col-md-5 features">
                            <img
                                src="../assets/images/features/visit-purposes.png"
                                alt="Visit Purposes"
                                class="img-fluid"
                            />
                            <h3>Visit / Check In Purposes</h3>
                            <p class="fs-5">
                                <span class="orange">On</span>Time handles
                                visitors with different purposes while keeping
                                record of each person entering or leaving the
                                facility.
                            </p>
                        </div>

                        <!-- Participants Data Import -->
                        <div class="col-md-5 features">
                            <img
                                src="../assets/images/features/import.png"
                                alt="Event Participants Import"
                                class="img-fluid"
                            />
                            <h3>Data Import</h3>
                            <p class="fs-5">
                                OnTime supports the importation of data using
                                CSV files, which simplifies the process of
                                handling large amounts of information. For
                                example, importing participants for an event
                                through a CSV file downloaded from a google
                                form. This feature allows users to quickly
                                upload data in bulk, significantly eradicating
                                the manual process of typing in participants
                                information individually which is liable to
                                delay in check-in process, mistakes and
                                oversights.
                            </p>
                        </div>

                        <!-- Data Export -->
                        <div class="col-md-5 features">
                            <img
                                src="../assets/images/features/export.png"
                                alt="Data Export"
                                class="img-fluid"
                            />
                            <h3>Data Export</h3>
                            <p class="fs-5">
                                OnTime supports the exportation of data such as,
                                attendance, visits, visitors, participants into
                                CSV files, simplifying the sharing of
                                information and generating reports with just few
                                clicks.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Test Credentials -->
            <section id="test" class="team-section p-3 fw-bold pb-5">
                <div
                    id="testWrapper"
                    class="container d-flex justify-content-between gap-3"
                >
                    <div
                        class="d-flex justify-content-start flex-column border-3 align-self-center"
                    >
                        <h2 class="section-title">Test Credentials</h2>
                        <p>
                            Test the application to better understand how it
                            fits your needs.
                        </p>
                    </div>
                    <div class="credentials-photo-wrapper">
                        <img
                            src="../assets/images/credentials.png"
                            alt="Test Credentials Photo"
                            class="credentials-photo"
                        />
                    </div>
                </div>
            </section>

            <!-- Our Team Section -->
            <section id="team" class="team-section p-3 fw-bold bg-light">
                <div id="teamWrapper" class="container">
                    <h2 class="section-title">Our Team</h2>
                    <div class="team-grid">
                        <div class="team-member">
                            <div class="team-img">
                                <img
                                    src="../assets/images/people/peace.jpg"
                                    alt="Emmanuel Peace Browne"
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
                                    src="../assets/images/people/dave.jpg"
                                    alt="Dave Wonnah"
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
                                    src="../assets/images/people/jeedo.jpg"
                                    alt="Jee-do Gbozee Arkoi"
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
                            © <span class="orange">On</span>Time
                            {{ new Date().getFullYear() }}
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { isAuthenticated, removeCookie } from "@/middlewares/auth.cookie";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loggedIn = computed(() => isAuthenticated());

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

function signOut() {
    console.log("-------- LOGGING OUT ---------");
    removeCookie("token");
    router.go(0);
}
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

#section {
    background: url("@/assets/images/landingPageBackDrop.png");
    background-position: center;
    background-size: cover;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

#sectionOverlay {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100%;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
}

#sectionWrapper {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    z-index: 2;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    width: 100%;
    max-width: 1320px;
}

.sectionText {
    max-width: 62rem;
    font-size: 2.5em;
}

@media (max-width: 1010px) and (min-width: 450px) {
    .sectionText {
        font-size: 2em;
    }

    .credentials-photo {
        max-width: 80% !important;
    }
}

@media (max-width: 449px) {
    .sectionText {
        font-size: 1.5em;
    }

    .credentials-photo {
        max-width: 100% !important;
    }
}

#shadow {
    position: sticky;
    top: 0;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (min-width: 1020px) and (max-width: 1550px) {
    #problem > div,
    #features > div,
    #about > div {
        padding-left: 2rem !important;
        padding-right: 2rem !important;
    }

    #sectionWrapper {
        margin-left: 2rem !important;
    }
}

/* Tablet and Mobile */
@media (max-width: 1020px) {
    #features > div > .section-title {
        margin-left: 1.5rem !important;
    }

    #demoWrapper {
        flex-direction: column !important;
    }

    .team-grid {
        justify-content: center !important;
        gap: 3rem !important;
    }

    .problemWrapper,
    .aboutWrapper {
        padding: 1rem 1.5rem !important;
    }

    #sectionWrapper {
        padding-left: 1.5rem !important;
        padding-right: 1.5rem !important;
    }

    #testWrapper {
        flex-direction: column;
    }
}

/* Large Screen */
@media (min-width: 1021px) {
    .features {
        width: 47%;
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
.problem-section,
.about-section {
    padding: 30px 0;
    background-color: #f9f9f9;
}

/* Features Section */
.feature-section {
    padding: 30px 0;
    background-color: #f9f9f9;
}

.features img {
    margin-bottom: 18px;
}

.credentials-img {
    justify-content: space-between;
}

.features img,
.features,
.credentials-img img {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

.credentials-photo {
    max-width: 600px;
    border-radius: 15px;
}

.orange {
    color: #ff7900;
}
</style>
