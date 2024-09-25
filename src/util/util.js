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
    if (!msisdns) return false;

    const contacts = msisdns;
    const serviceCode = [
        "555",
        "880",
        "881",
        "886",
        "887",
        "888",
        "770",
        "772",
        "775",
        "776",
        "777",
        "778",
        "779",
    ];

    for (const contact of contacts) {
        if (!contact.startsWith("0")) {
            if (!contact.startsWith("231")) {
                return {
                    valid: false,
                    message: "Phone number should start with 0",
                };
            }
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

        // Msisdn range must be 9 digits.
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
    const validEmail =
        /^[a-zA-Z0-9.!#$%&'*+/=?^/_`{|}~-]+@[a-z]+(?:\.[a-zA-Z0-9]+)*$/;

    const isValid = mail.match(validEmail);

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
        } else visit.items = "";

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
