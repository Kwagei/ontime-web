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

// Visitors Components
import VisitorDetail from "../components/visitors/VisitorDetail.vue";
import Visitors from "../layouts/Visitors.vue";
import AddVisitors from "../components/visitors/AddVisitors.vue";

// Visit Components
import Visits from "../layouts/Visits.vue";
import AddMeeting from "@/components/visits/AddMeeting.vue";
import AddEvents from "@/components/visits/AddEvents.vue";
import AddWorkspace from "@/components/visits/AddWorkspace.vue";
import AddVisits from "@/components/visits/AddVisits.vue";

// Users Components
import Users from "../layouts/Users.vue";

// Dashboard Components
import Dashboard from "../layouts/Dashboard.vue";
import Hosts from "@/components/hosts/Hosts.vue";
import Rooms from "@/components/Room.vue";

// Dependecies Imports
import { createRouter, createWebHistory } from "vue-router";
import AppView from "@/views/AppView.vue";
import AddUsers from "@/components/users/AddUsers.vue";
import UserDetail from "@/components/users/UserDetail.vue";
import NewPassword from "@/components/resetPassword/NewPassword.vue";

const routes = [
	{
		path: "",
		redirect: "/sign-in",
	},
	{
		path: "/sign-in",
		component: SignIn,
		name: "sign-in",
	},
	{
		path: "/reset-password",
		component: ResetPassword,
		name: "reset-password",
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
				meta: {
					requiresAuth: true,
				},
			},
			{
				path: "new-password",
				component: NewPassword,
				name: "new-password",
				// meta: {
				// 	requiresAuth: true,
				// },
			},
		],
	},
	{
		path: "/app",
		component: AppView,
		name: "app",
		children: [
			{
				path: "/dashboard",
				component: Dashboard,
				name: "dashboard",
				// meta: {
				// 	requiresAuth: true,
				// },
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
				// meta: {
				// 	requiresAuth: true,
				// },
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
				// meta: {
				// 	requiresAuth: true,
				// },
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
				// meta: {
				// 	requiresAuth: true,
				// },
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
				// meta: {
				// 	requiresAuth: true,
				// },
			},
		],
	},
];

export const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
