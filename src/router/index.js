// Event Components
import AddEvent from "../components/events/AddEvent.vue";
import Events from "../views/Events.vue";
import Event from "../components/events/Event.vue";

// Visitors Components
import VisitorDetail from "../components/visitors/VisitorDetail.vue";
import Visitors from "../views/Visitors.vue";
import AddVisitors from "../components/visitors/AddVisitors.vue";

// Visit Components
import Visits from "../views/Visits.vue";
import AddMeeting from "@/components/visits/AddMeeting.vue";
import AddEvents from "@/components/visits/AddEvents.vue";
import AddWorkspace from "@/components/visits/AddWorkspace.vue";
import AddVisits from "@/components/visits/AddVisits.vue";

// Users Components
import Users from "../views/Users.vue";

// Dashboard Components
import Dashboard from "../views/Dashboard.vue";
import Host from "@/components/hosts/Hosts.vue";
import Room from "@/components/Room.vue";

// Dependecies Imports
import { createRouter, createWebHistory } from "vue-router";
import AddParticipant from "@/components/events/AddParticipant.vue";

const routes = [
    {
        path: "",
        redirect: "/visits",
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
                component: Host,
                name: "new-host",
            },
            {
                path: "new-room",
                component: Room,
                name: "new-room",
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
