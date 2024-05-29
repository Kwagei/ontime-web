import { createRouter, createWebHistory } from "vue-router";
import App from "../App.vue";

const routes = [
    {
        path: "/dashboard",
        component: () => import("../views/dashboard/DashboardView.vue"),
    },
    {
        path: "/visitors",
        component: () => import("../views/visitors/VisitorView.vue"),
    },
    {
        path: "/visits",
        component: () => import("../views/visits/VisitsList.vue"),
    },
    {
        path: "/users",
        component: () => import("../views/users/UsersList.vue"),
    },
    {
        path: "/events",
        component: () => import("../views/events/EventsList.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
