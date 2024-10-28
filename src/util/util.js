import { API_KEY, API_URL } from "@/assets/js";
import validator from "validator";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

/**
 * Checks if the given msisdn is valid or not.
 * @param {Array} msisdns - An array of msisdn (Contacts) to be validated.
 * @returns {void}
 *
 * @throws Will throw an error if the contact doesn't start with 231.
 * @throws Will throw an error if the contact number or email is invalid.
 */
export const msisdnValidation = (msisdns) => {
    if (!msisdns.length) return false;

    let contacts = msisdns;
    const serviceCode = ["555", "88", "77"];

    for (let contact of contacts) {
        if (!contact.startsWith("0") && !contact.startsWith("231")) {
            contact = "231" + contact;
        }

        // Remove country code from the msisdn if added to the msisdn.
        let contactNumber;

        if (contact.startsWith("0")) {
            contactNumber = contact.slice(1);
        } else if (contact.startsWith("231")) {
            contactNumber = contact.slice(3);
        }

        const contactRange = contactNumber.length;

        // Check if contact number starts with either of the serviceCode elements.
        const validCode = serviceCode.some((val) =>
            contactNumber.startsWith(val)
        );

        // Msisdn range must be 9 digits and a valid code.
        if (contactRange !== 9 || !validCode || !contactNumber) {
            return { valid: false, message: "Invalid phone number!" };
        }
    }

    return { valid: true };
};

/**
 * Validating a valid email address, if email address is valid return true else return false
 *
 * @param {String} - User email address to be validated.
 * @returns {boolean} - true / false
 */
export const emailValidation = (mail) => {
    if (!mail) return { valid: false };

    const isValid = validator.isEmail(mail.trim());

    if (!isValid) {
        return { valid: false, message: "Invalid email address!" };
    } else {
        return { valid: true };
    }
};

/**
 * Validating a valid password. If password is valid return true else return false.
 * Password should be greater than 4 character and it should include atleast one Upper case letter, Lower case letter, digit and symbol.
 *
 * @param {String} password - User password to be validated.
 * @returns {Boolean} - True or False
 */

export const passwordValidation = (password) => {
    const upperCase = /[A-Z]/,
        lowerCase = /[a-z]/,
        digitCase = /[0-9]/,
        symbolCase = /[.!#$%&'*+/=?^/_`{|}~-]/;
    let upper, lower, digit, symbol;

    const minPasswordLen = 5;

    if (password.length >= minPasswordLen) {
        for (const char of password) {
            if (char.match(upperCase)) upper = true;
            if (char.match(lowerCase)) lower = true;
            if (char.match(digitCase)) digit = true;
            if (char.match(symbolCase)) symbol = true;
            if (upper && lower && digit && symbol) {
                return { valid: true };
            }
        }
    }

    return { valid: false, message: "Invalid password!" };
};

export const showModal = (parent = "#alertModal", child = "alertModalBody") => {
    const modal = new boosted.Modal(parent, { backdrop: false });

    modal.show(getElement(child));
};

export const formatDateTime = (dateTime, format = {}) => {
    if (!dateTime) {
        return;
    }

    const { date, time, month, day, year } = format;

    const dateFormat = "ddd, MMM D, YYYY";
    const timeFormat = "h:mm A";

    // Create a dayjs instance from the dateTime
    const now = dayjs(dateTime);

    // Return only the time if time is true
    if (time) {
        return now.format(timeFormat);
    }

    // Return formatted date based on the format object
    if (date) {
        return now.format(dateFormat);
    }

    if (month) {
        return now.format("MMM");
    }

    if (day) {
        return now.format("DDD");
    }

    if (year) {
        return now.format("YYYY");
    }

    // Default case: return both date and time
    return now.format(`${dateFormat} ${timeFormat}`);
};

export function validateFromAndToDate(from, to) {
    const newFrom = new Date(from);
    const newTo = new Date(to);

    return newFrom > newTo ? false : true;
}

export const formatDepartureTime = (time) => {
    // Destructuring the hour, minutes and seconds from the departure time.
    const [hour, minutes, seconds] = time.split(":");

    // Create a custom date and add the departure time to be able to format the date time to get only time format
    const departure_time = new Date();
    departure_time.setHours(hour, minutes, seconds);

    return formatDateTime(departure_time, {
        time: true,
    });
};

const MAX_ITEMS_LEN = 30;
const MAX_DETAIL_LEN = 30;

export const formatVisitData = (visits) => {
    return visits.map((visit) => {
        if (visit.date_time) {
            visit.date_time = formatDateTime(visit.date_time);
        }

        if (visit.items.length) {
            visit.items = formatItems(visit.items);
        } else visit.items = [];

        if (visit.purpose) {
            const purpose = visit.purpose.split(" ");
            visit.purpose =
                purpose.length > MAX_ITEMS_LEN
                    ? `${purpose.slice(0, MAX_ITEMS_LEN).join(" ")}...`
                    : visit.purpose;
        }

        if (visit.departure_time) {
            visit.departure_time = formatDepartureTime(visit.departure_time);
        }

        return {
            ...visit,
            visitor: `${visit.first_name} ${visit.last_name}`,
        };
    });
};

export const formatItems = (belonging) => {
    const items = belonging.join(", ");

    return items.length > MAX_ITEMS_LEN
        ? `${items.slice(0, MAX_ITEMS_LEN)}...`
        : items;
};

export const formatDetails = (detail) => {
    return detail.length > MAX_DETAIL_LEN
        ? `${detail.slice(0, MAX_DETAIL_LEN)}...`
        : detail;
};

/**
 * Retrieves an element from the document by matching its selector value.
 *
 * @param {string} selector - The value of the selector to match when retrieving the element.
 * @returns {Element | null} - The element found with the matching selector value, or null if no element is found.
 */
export const getElement = (selector) => document.querySelector(selector);

/**
 * Retrieves a collection of elements from the document based on the provided selector.
 *
 * @param {string} selector - The CSS selector or element name to match when retrieving elements.
 * @returns {NodeList | null} - A collection of elements matching the selector, or null if no elements are found.
 */
export const getElementAll = (selector) => document.querySelectorAll(selector);

/**
 * Removes a classname from an html element
 * @param {Element} element - The HTML element to which the class name should be removed.
 * @param {string} className - The class name to be removed
 */
export const removeClass = (element, className) =>
    element.classList.remove(className);

/**
 * Adds the specified class name to the provided HTML element.
 *
 * @param {Element} element - The HTML element to which the class name should be added.
 * @param {string} className - The class name to add.
 */
export const addClass = (element, className) =>
    element.classList.add(className);

/**
 * Toggles the visibility of an element by adding or removing the specified class name.
 *
 * @param {Element} element - The element whose visibility should be toggled.
 * @param {string} className - The class name to toggle.
 */
export const toggleVisibility = (element, className) =>
    element.classList.toggle(className);

export const formValidation = () => {
    "use strict";

    const form = getElement(".needs-validation");

    if (form) {
        form.addEventListener(
            "submit",
            (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                addClass(form, "was-validated");
            },
            false
        );
    }
};

export function hideSidebarOnSmallScreen() {
    // hide the side bar if were on a tablet or mobile phone
    if (window.innerWidth <= 1250) {
        $("#sideBar").css("display", "none");
        $("main").css("margin-left", "0");
    }
}

export async function getTodaysVisits() {
    let todaysVisits;

    await $.ajax(`${API_URL}visits?today=1`, {
        method: "GET",
        headers: {
            authorization: API_KEY,
        },
        success: (res) => {
            todaysVisits = res.data;
        },
        error: (err) => {
            console.error("error fetching today's visits: ", err);
            todaysVisits = "error";
        },
    });

    return todaysVisits;
}

export async function getCurrentWeekData() {
    let currentWeekVisits;

    await $.ajax(`${API_URL}visits?currentWeek=1`, {
        method: "GET",
        headers: {
            authorization: API_KEY,
        },
        success: (res) => {
            currentWeekVisits = res.data;
        },
        error: (err) => {
            console.error("error fetching today's visits: ", err);
        },
    });

    return currentWeekVisits;
}

// ensure there are no quotes in values about to be inserted into the database
export const removeQuotes = (data, isString = false) => {
    if (!data) return;

    // remove quotes from a single string
    if (isString) return data.replace(/['"]/g, "");

    // Map over each element of the array
    return data.map((item) => {
        // Check if the element is a string
        if (typeof item === "string") {
            // Remove single and double quotes from the string and return the modified string
            return item.replace(/['"]/g, "");
        }
        // Return non-string elements as they are
        return item;
    });
};

export const capitalize = (str) => {
    if (str) return str.charAt(0).toUpperCase() + str.slice(1);
};

// format msisdn to 231777123456 from 0777123456 or anything else
// msisdn should validated with the `msisdnValidation()` method
// before formatting it with this method
export const formatMsisdn = (tmpMsisdn) => {
    if (!tmpMsisdn) return "";

    let msisdn = "";

    for (let digit of tmpMsisdn) {
        if (digit == "0" || Number(digit)) msisdn += digit;
    }

    if (msisdn.startsWith("231")) return "231" + msisdn.slice(3, 12);
    else if (msisdn.startsWith("0")) return "231" + msisdn.slice(1, 10);
    return "231" + msisdn.slice(0, 9);
};
