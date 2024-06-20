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
    const countryCode = contact.slice(0, 3);

    if (countryCode !== "231")
      return { valid: false, message: "Phone number should start with 231" };

    // Remove country code from the msisdn if added to the msisdn.
    const contactNumber = contact.slice(3);

    // Getting the range of the msisdn
    const contactRange = contactNumber.length;

    // Check if contact number starts with either of the serviceCode elements.
    const validCode = serviceCode.some((val) => contactNumber.startsWith(val));

    // Msisdn range must be 9 digits.
    if (contactRange !== 9 || !validCode || !+contactNumber) {
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
  return mail.match(validEmail) ? true : false;
};
