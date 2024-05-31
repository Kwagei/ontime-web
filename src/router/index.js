import { createRouter, createWebHistory } from "vue-router";
import App from "../App.vue";
import Dashboard from "../views/Dashboard.vue";
import Visitors from "../views/Visitors.vue";
import Visits from "../views/Visits.vue";
import Users from "../views/Users.vue";
import Events from "../views/Events.vue";
import AddVisitors from "../components/visitors/AddVisitors.vue";
import AddVisits from "../components/visits/AddVisits.vue";

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
        ],
    },
    {
        // path: "/visits",
        // component: Visits,
        // name: "visits",
        path: "/visits",
        children: [
            {
                path: "",
                component: Visits,
                name: "visits",
            },
            {
                path: "new-visit",
                component: AddVisits,
                name: "add-visit",
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
        component: Events,
        name: "events",
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
