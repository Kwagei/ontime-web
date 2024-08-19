import Cookies from "js-cookie";

export const isAuthenticated = () => getCookie("token");

export const getCookie = (name) => Cookies.get(name);

export const setCookie = (name, value) => {
	var in30Minutes = 1 / 60;
	Cookies.set(name, value, { expires: in30Minutes });
};

export const removeCookie = (name) => Cookies.remove(name);
