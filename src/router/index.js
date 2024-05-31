import AddEvent from "../components/events/AddEvent.vue";
import { createRouter, createWebHistory } from "vue-router";
import Events from "../views/Events.vue";

const routes = [
    {
        path: "/dashboard",
        component: () => import("../views/Dashboard.vue"),
        props: true,
    },
    {
        path: "/visitors",
        component: () => import("../views/Visitors.vue"),
    },
    {
        path: "/visits",
        component: () => import("../views/Visits.vue"),
    },
    {
        path: "/users",
        component: () => import("../views/Users.vue"),
    },
    {
        path: "/events",
        children: [
            { path: "", component: Events, name: "events" },
            { path: "/add-event", component: AddEvent, name: "add-event" },
        ],
    },
    {
        path: "/visitors/new-visitor",
        component: () => import("../components/visitors/AddVisitors.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
