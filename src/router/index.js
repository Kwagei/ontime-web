// Event Components
import AddEvent from "../components/events/AddEvent.vue";
import Events from "../layouts/Events.vue";
import Event from "../components/events/Event.vue";
import AddParticipant from "@/components/events/AddParticipant.vue";

// Authentications
import SignIn from "../views/SignIn.vue";
import ResetPassword from "../views/ResetPassword.vue";
import ResetCode from "@/components/resetPassword/ResetCode.vue";
import ResetMail from "@/components/resetPassword/ResetMail.vue";
import AppView from "@/views/AppView.vue";
import AddUsers from "@/components/users/AddUsers.vue";
import UserDetail from "@/components/users/UserDetail.vue";
import NewPassword from "@/components/resetPassword/NewPassword.vue";

// Landing Page
import LandingPage from "@/components/LandingPage.vue";

// Visitors Components
import VisitorDetail from "../components/visitors/VisitorDetail.vue";
import Visitors from "../layouts/Visitors.vue";
import AddVisitors from "../components/visitors/AddVisitors.vue";

// Visit Components
import Visits from "../layouts/Visits.vue";

// Check In Components
import AddMeeting from "@/components/checkIn/AddMeeting.vue";
import AddEvents from "@/components/checkIn/AddEvents.vue";
import AddWorkspace from "@/components/checkIn/AddWorkspace.vue";

// Users Components
import Users from "../layouts/Users.vue";

// Employees Components
import Employees from "@/layouts/Employees.vue";
import AddEmployee from "@/components/employees/AddEmployee.vue";
import EmployeeDetails from "@/components/employees/EmployeeDetails.vue";

// Dashboard Components
import Dashboard from "../layouts/Dashboard.vue";

// Other Components
import Hosts from "@/components/hosts/Hosts.vue";
import Rooms from "@/components/Room.vue";

// Dependecies Imports
import { createRouter, createWebHistory } from "vue-router";
import CheckIn from "@/layouts/CheckIn.vue";

const routes = [
    {
        path: "",
        component: LandingPage,
    },
    {
        path: "/sign-in",
        component: SignIn,
        name: "sign-in",
        meta: {
            logOutRequired: true,
        },
    },
    {
        path: "/reset-password",
        component: ResetPassword,
        name: "reset-password",
        meta: {
            logOutRequired: true,
        },
        children: [
            {
                path: "",
                component: ResetMail,
                name: "reset-mail",
            },
            {
                path: "code",
                component: ResetCode,
                name: "reset-code",
                props: true,
            },
            {
                path: "new-password",
                component: NewPassword,
                name: "new-password",
            },
        ],
    },
    {
        path: "/app",
        component: AppView,
        name: "app",
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                path: "",
                component: LandingPage,
                name: "landing-page",
            },
            {
                path: "/dashboard",
                component: Dashboard,
                name: "dashboard",
            },
            {
                path: "/visitors",
                children: [
                    {
                        path: "",
                        component: Visitors,
                        name: "visitors",
                    },
                    {
                        path: "new-visitor",
                        component: AddVisitors,
                        name: "add-visitor",
                        props: true,
                    },
                    {
                        path: ":id",
                        children: [
                            {
                                path: "",
                                component: VisitorDetail,
                                name: "visitorDetail",
                            },
                            {
                                path: "edit-visitor",
                                component: AddVisitors,
                                name: "edit-visitor",
                            },
                        ],
                    },
                ],
            },
            {
                path: "/visits",
                component: Visits,
                name: "visits",
            },
            {
                path: "/check-in",
                children: [
                    {
                        path: "",
                        component: CheckIn,
                        name: "check-in",
                    },
                    {
                        path: "purpose-meeting",
                        component: AddMeeting,
                        name: "visit-meeting",
                    },
                    {
                        path: "purpose-event",
                        component: AddEvents,
                        name: "visit-event",
                    },
                    {
                        path: "purpose-workspace",
                        component: AddWorkspace,
                        name: "visit-workspace",
                    },
                ],
            },
            {
                path: "/users",
                children: [
                    {
                        path: "",
                        component: Users,
                        name: "users",
                    },
                    {
                        path: "new-user",
                        component: AddUsers,
                        name: "add-user",
                    },
                    {
                        path: ":id",
                        children: [
                            {
                                path: "",
                                component: UserDetail,
                                name: "userDetail",
                            },
                            {
                                path: "edit-user",
                                component: AddUsers,
                                name: "edit-user",
                            },
                        ],
                    },
                ],
            },
            {
                path: "/events",
                children: [
                    { path: "", component: Events, name: "events" },
                    {
                        path: "/events/add-event",
                        component: AddEvent,
                        name: "add-event",
                    },
                    {
                        path: "/events/:id",
                        children: [
                            {
                                path: "",
                                component: Event,
                                name: "specific-event",
                            },
                            {
                                path: "edit-event",
                                component: AddEvent,
                                name: "specific-event-participants",
                            },
                            {
                                path: "add-participant",
                                component: AddParticipant,
                                name: "add-event-participant",
                            },
                        ],
                    },
                    {
                        path: "new-host",
                        component: Hosts,
                        name: "new-host",
                    },
                    {
                        path: "new-room",
                        component: Rooms,
                        name: "new-room",
                    },
                ],
            },
            {
                path: "/employees",
                children: [
                    {
                        path: "",
                        component: Employees,
                        name: "employees",
                    },
                    {
                        path: "add-employee",
                        component: AddEmployee,
                        name: "add-employee",
                    },
                    {
                        path: "edit-employee",
                        component: AddEmployee,
                        name: "edit-employee",
                    },
                    {
                        path: ":id",
                        component: EmployeeDetails,
                        name: "employee-details",
                    },
                ],
            },
        ],
    },
];

export const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes,
});

export default router;
