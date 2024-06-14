// Events Components
import Events from "../views/Events.vue";
import AddEvent from "../components/events/AddEvent.vue";
import EventParticipants from "@/components/events/EventParticipants.vue";

// Visits Components
import Visits from "../views/Visits.vue";

// Users Components
import Users from "../views/Users.vue";

// Visitors Components
import AddVisitors from "../components/visitors/AddVisitors.vue";
import Visitors from "../views/Visitors.vue";
import VisitorDetail from "../components/visitors/VisitorDetail.vue";

// Other Components
import Dashboard from "../views/Dashboard.vue";

// Dependencies Imports
import { createRouter, createWebHistory } from "vue-router";

const routes = [
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
                prop: true,
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
        path: "/users",
        component: Users,
        name: "users",
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
                component: Event,
                name: "specific-event",
            },
            {
                path: "/events/:id/participants",
                component: EventParticipants,
                name: "specific-event-participants",
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
