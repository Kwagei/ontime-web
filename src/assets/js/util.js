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

export const formatDateTime = (dateTime, format = {}) => {
	const { date, time, month, day, year } = format;

	const dateFormat = "ddd, MMM D, YYYY";
	const timeFormat = "h:mm A";
	const parseFormat = "HH:mm:ss";

	// use custom parse format when formatting only time
	if (time) {
		const now = dayjs(dateTime, parseFormat);

		return now.format(timeFormat);
	}

	// otherwise use dayjs without the custom parse format plugin
	else {
		const now = dayjsWithoutPlugin(dateTime);

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

		if (!date && !time) {
			return now.format(`${dateFormat} ${timeFormat}`);
		}
	}
};
