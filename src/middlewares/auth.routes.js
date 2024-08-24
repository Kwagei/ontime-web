import router from "@/router";
import store from "@/store";
import { isAuthenticated } from "./auth.cookie";

router.beforeEach((to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (to.path === "/reset-password/code") {
			if (!store.state.hasVisitedResetPassword) {
				return next("/reset-password");
			}
			return next();
		}

		if (to.path === "/reset-password/new-password") {
			if (!store.state.hasVisitedResetPassword) {
				return next("/reset-password/code");
			}
			return next();
		}

		if (!isAuthenticated()) {
			return next({ name: "sign-in" });
		}
	}

	next();
});

export default router;
