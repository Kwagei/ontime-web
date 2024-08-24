import Vuex from "vuex";

const store = new Vuex.Store({
	state: {
		hasVisitedResetPassword: false,
		resetPasswordUser: "",
	},
	mutations: {
		setVisitedResetPassword(state, value) {
			state.hasVisitedResetPassword = value;
		},
	},
	actions: {
		markVisitedResetPassword({ commit }) {
			commit("setVisitedResetPassword", true);
		},
	},
});

export default store;
