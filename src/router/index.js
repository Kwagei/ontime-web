import AddEvent from "../components/events/AddEvent.vue";
import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Visitors from "../views/Visitors.vue";
import Visits from "../views/Visits.vue";
import Users from "../views/Users.vue";
import Events from "../views/Events.vue";
import AddVisitors from "../components/visitors/AddVisitors.vue";
import VisitorDetail from "../components/visitors/VisitorDetail.vue";

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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
