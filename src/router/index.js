import { createRouter, createWebHistory } from "vue-router";
import App from "../App.vue";

const routes = [
    {
        path: "/dashboard",
        component: () => import("../views/Dashboard.vue"),
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
        component: () => import("../views/Events.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
