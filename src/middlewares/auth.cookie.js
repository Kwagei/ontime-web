import Cookies from "js-cookie";

export const isAuthenticated = () => getCookie("token");

export const getCookie = (name) => Cookies.get(name);

export const setCookie = (name, value, expires) =>
    Cookies.set(name, value, { expires, sameSite: "Strict" });

export const removeCookie = (name) => Cookies.remove(name);
