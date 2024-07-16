import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import dayjsWithoutPlugin from "./dayjsWithoutPlugin.js";

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

export const showModal = (parent = "#alertModal", child = "alertModalBody") => {
    const modal = new boosted.Modal(parent, { backdrop: false });
    modal.show(document.querySelector(child));
};

// remove duplicates from an array of object passed
export function removeDuplicateParticipants(arrOfObjs) {
    // use a map to avoid duplicacy
    const seenParticipants = new Map();

    // store unique records
    const newArr = [];

    // loop from the end of the array to the beginning of the array
    // because the records that will be retrieved from the API will have
    // the participant record with the departure time before the records without
    // departure time, so by looping from the end of the array, i'll get
    // the records without the departure time (if any) before reaching the records
    // with departure time and the records with departure time will be skipped.
    //
    // This will ensure I don't have participant duplicated in the table with one records
    // having a departure time making it possible to check that participant in,
    // and that same participant will have another records without a departure time
    // but will display an error saying "Visitor is still checked in" when you try
    // to check the participant in
    for (let i = arrOfObjs.length - 1; i > -1; i--) {
        const obj = arrOfObjs[i];
        const id = obj.id;

        if (seenParticipants.has(id)) continue;
        else {
            seenParticipants.set(id, true);
            newArr.push(obj);
        }
    }

    return newArr;
}

export const formatDateTime = (dateTime, format = {}) => {
    const { date, time } = format;

    const dateFormat = "ddd, MMM D, YYYY";
    const timeFormat = "h:mm A";

    // use custom parse format when formatting only time
    if (time) {
        const parseFormat = "HH:mm:ss";
        const now = dayjs(dateTime, parseFormat);

        return now.format(timeFormat);
    }
    // otherwise use dayjs without the custom parse format plugin
    else {
        const now = dayjsWithoutPlugin(dateTime);

        if (!date && !time) {
            return now.format(`${dateFormat} ${timeFormat}`);
        }

        if (date) {
            return now.format(dateFormat);
        }
    }
};
