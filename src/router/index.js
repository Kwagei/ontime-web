import AddEvent from "../components/events/AddEvent.vue";
import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Visitors from "../views/Visitors.vue";
import Visits from "../views/Visits.vue";
import Users from "../views/Users.vue";
import Events from "../views/Events.vue";
import AddVisitors from "../components/visitors/AddVisitors.vue";
import AddMeeting from "../components/visits/AddMeeting.vue";
import AddEvents from "../components/visits/AddEvents.vue";
import AddWorkspace from "../components/visits/AddWorkspace.vue";

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
            },
            {
                path: "purpose-event",
                component: AddVisitors,
                name: "add-visitor",
            },
        ],
    },
    {
        path: "/visits",
        children: [
            {
                path: "",
                component: Visits,
                name: "visits",
            },
            {
                path: "purpose-meeting",
                component: AddMeeting,
                name: "add-meeting",
            },
            {
                path: "purpose-event",
                component: AddEvents,
                name: "visits-event",
            },
            {
                path: "purpose-workspace",
                component: AddWorkspace,
                name: "add-workspace",
            },
        ], 
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
        ],
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
