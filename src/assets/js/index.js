import $ from "jquery";
import { mkConfig, generateCsv, download } from "export-to-csv";

// mkConfig merges your options with the defaults
// and returns WithDefaults<ConfigOptions>
const csvConfig = mkConfig({ useKeysAsHeaders: true });

export const csvExport = (data) => {
	// Converts your Array<Object> to a CsvOutput string based on the configs
	const csv = generateCsv(csvConfig)(data);

	// `download` takes `csvConfig` and the generated `CsvOutput`
	download(csvConfig)(csv);
};

export const API_URL = import.meta.env.VITE_API_URL;
export const API_KEY = import.meta.env.VITE_API_KEY;

// Visits functions
export const registerVisit = async (data) => {
	try {
		const options = {
			method: "POST",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API_URL}/visits`, options);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.error("Error: ", error);
	}
};

/**
 * @typedef {Object} GetVisitsQueryParams
 * @property {number} [start=0] - The index of the first visit to return.
 * @property {number} [limit=20] - The maximum number of visits to return.
 * @property {string} [search=''] - The search string to filter the returned visits.
 * @property {string} [sort=''] - The field to sort the visits by.
 * @property {string} [order=''] - The order of the sort.
 */

/**
 * Gets a paginated list of visits.
 *
 * @param {GetVisitsQueryParams} [queryParams={}] - The query parameters for the request.
 * @returns {Promise<Object[]>} - The list of visits.
 */
export const getVisits = async (queryParams = {}) => {
	try {
		const {
			search = "",
			start = 0,
			limit = 20,
			sort = "",
			order = "",
		} = queryParams;

		const apiUrl = `${API_URL}/visits`;
		let url = `${apiUrl}?start=${start}&limit=${limit}`;

		if (search) {
			url += `&search=${search}`;
		}

		if (sort) {
			url += `&sort=${sort}&order=${order}`;
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(
				"Failed to fetch visits. Please try again after a few seconds."
			);
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateDepartureTime = async (id, data) => {
	try {
		// Update departure time
		const options = {
			method: "PUT",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API_URL}/visits/${id}`, options);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.error("Error in updateDepartureTime: ", error);
		return { ok: false, result: error.message };
	}
};

// Visitors functions
export const registerVisitor = async (data) => {
	try {
		const options = {
			method: "POST",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API_URL}/visitors`, options);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.error("Error:", error);
	}
};

export const getVisitors = async (query = {}) => {
	try {
		const {
			search = "",
			start = 0,
			limit = 20,
			sort = "",
			order = "",
		} = query;

		let url = `${API_URL}/visitors?start=${start}&limit=${limit}`;

		if (search) {
			url += `&search=${search}`;
		}

		if (sort) {
			url += `&sort=${sort}&order=${order}`;
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const result = await response.json();
		return result.data;
	} catch (error) {
		throw error;
	}
};

/**
 * Get a single visitor by id or phone number.
 *
 * @param {{ id?: number, msisdn?: string }} query - The query parameters.
 * @returns {Promise<Object>} - The visitor object.
 */
export const getSingleVisitor = async ({ id, msisdn }) => {
	try {
		const url = id
			? // Get by id
			  `${API_URL}/visitors/${id}`
			: // Get by phone number
			  `${API_URL}/visitors?search=${msisdn}`;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const { data } = await response.json();
		return data.data[0];
	} catch (error) {
		throw error;
	}
};

export const editVisitor = async (id, data) => {
	try {
		const options = {
			method: "PUT",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API_URL}/visitors/${id}`, options);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.error("Error:", error);
	}
};

/**
 * Retrieves a visitor along with their associated visits.
 *
 * @param {number} id - The id of the visitor.
 * @param {Object} query - The query parameters for the request.
 * @param {string} [query.search=''] - The search string to filter the returned visits.
 * @param {number} [query.start=0] - The starting index for the returned visits.
 * @param {number} [query.limit=20] - The maximum number of visits to return.
 * @param {string} [query.sort=''] - The field to sort the visits by.
 * @param {string} [query.order=''] - The order of the sort.
 *
 * @returns {Promise<Object[]>} - The list of visits associated with the visitor.
 */
export const getVisitorWithVisits = async (id, query) => {
	try {
		const {
			search = "",
			start = 0,
			limit = 20,
			sort = "",
			order = "",
		} = query;

		let url = `${API_URL}/visitors/${id}/visits?&start=${start}&limit=${limit}`;

		if (search) {
			url += `&search=${search}`;
		}

		if (sort) {
			url += `&sort=${sort}&order=${order}`;
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const { data } = await response.json();

		return data;
	} catch (error) {
		console.error("Error: ", error);
	}
};

// Users functions
export const registerUser = async (data) => {
	try {
		const options = {
			method: "POST",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API_URL}/users`, options);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.error("Error:", error);
	}
};

export const editUser = async (id, data) => {
	try {
		const options = {
			method: "PUT",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API_URL}/users/${id}`, options);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.error("Error:", error);
	}
};

/**
 * Retrieves a list of users from the API.
 *
 * @returns {Promise<Object[]>} - A promise that resolves to an array of user objects.
 * If the request fails, the promise will reject with an error.
 */
export const getUsers = async () => {
	try {
		const url = `${API_URL}/users/`;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.log({ error });
	}
};

/**
 * Performs a login request to the API.
 *
 * @param {Object} data - The login data.
 * @param {string} data.username - The username for the login.
 * @param {string} data.password - The password for the login.
 *
 * @returns {Promise<Object>} - A promise that resolves to an object containing the login status and result.
 * The object has the following properties:
 * - ok: A boolean indicating whether the login was successful.
 * - result: An object containing the login result.
 *
 * @throws {Error} - If the login request fails, the promise will reject with an error.
 */
export const login = async (data) => {
	try {
		const options = {
			method: "POST",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API_URL}/login`, options);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.log({ error });
	}
};

export const resetPassword = async (data) => {
	const { code } = data;

	try {
		const options = {
			method: "POST",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(
			`${API_URL}/reset-password${code ? "/code" : ""}`,
			options
		);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.log({ error });
	}
};

/**
 * Retrieves a single user by id or phone number.
 *
 * @param {Object} data - The query parameters.
 * @param {number} [data.id] - The id of the user.
 * @param {string} [data.msisdn] - The phone number of the user.
 *
 * @returns {Promise<Object>} - A promise that resolves to the user object.
 * If the request fails, the promise will reject with an error.
 */
export const getSingleUser = async (data) => {
	const { id, msisdn } = data;

	try {
		const url = id
			? // Get by id
			  `${API_URL}/users/${id}`
			: // Get by phone number
			  `${API_URL}/users?search=${msisdn}`;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const { data } = await response.json();

		return data.users;
	} catch (error) {}
};

/**
 * Deletes a user from the API by their id.
 *
 * @param {number} id - The id of the user to delete.
 *
 * @returns {Promise<Object>} - A promise that resolves to an object containing the deletion status and result.
 * The object has the following properties:
 * - ok: A boolean indicating whether the deletion was successful.
 * - result: An object containing the deletion result.
 *
 * @throws {Error} - If the deletion request fails, the promise will reject with an error.
 */
export const deleteUser = async (id) => {
	const options = {
		method: "DELETE",
		headers: {
			authorization: API_KEY,
			"Content-Type": "application/json",
		},
	};
	const response = await fetch(`${API_URL}users/${id}`, options);

	const result = await response.json();

	return { ok: response.ok, result };
};

// EVENTS
export const getEvents = async (id, query = {}) => {
	try {
		const {
			search = "",
			start = 0,
			limit = 20,
			sort = "",
			order = "",
			from = "",
			to = "",
			current = 0,
		} = query;

		let url = `${API_URL}/events/`;

		if (id) {
			url += id;
		} else {
			url += `?&start=${start}&limit=${limit}`;

			if (search) {
				url += `&search=${search}`;
			}

			if (from) {
				url += `&from=${from}`;
			}

			if (to) {
				url += `&to=${to}`;
			}

			if (sort) {
				url += `&sort=${sort}&order=${order}`;
			}

			if (current) {
				url += `&current=1`;
			}
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const { data } = await response.json();

		return data;
	} catch (error) {
		console.error("Error: ", error);
	}
};

export const getParticipants = async (id, query = {}) => {
	try {
		const {
			search = "",
			start = 0,
			limit = 20,
			sort = "",
			order = "",
		} = query;

		let url = `${API_URL}/events/${id}/participants?start=${start}&limit=${limit}`;

		if (search) {
			url += `&search=${search}`;
		}

		if (sort) {
			url += `&sort=${sort}&order=${order}`;
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const { data } = await response.json();
		return data;
	} catch (error) {
		console.log({ error });
	}
};

export const registerEventParticipants = async (data) => {
	try {
		const options = {
			method: "POST",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API_URL}/event_participants`, options);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.log({ error });
	}
};

// Hosts functions
export const getHosts = async (id) => {
	try {
		let url = `${API_URL}/hosts`;

		if (id) {
			url += `/${id}`;
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			console.log("Unable to get Host: ", response.body);
			throw new Error("Network response was not ok");
		}
		const { data: hosts } = await response.json();

		return hosts;
	} catch (error) {}
};

export const registerHost = async (data) => {
	try {
		const options = {
			method: "POST",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API_URL}/hosts`, options);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.error("Error:", error);
	}
};

export const editHost = async (id, data) => {
	try {
		const options = {
			method: "PUT",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API_URL}/hosts/${id}`, options);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.error("Error:", error);
	}
};

// Room functions
export const getRooms = async (id) => {
	try {
		let url = `${API_URL}/rooms`;

		if (id) {
			url += `/${id}`;
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const { data: rooms } = await response.json();

		return rooms;
	} catch (error) {}
};

export const registerRoom = async (data) => {
	try {
		const options = {
			method: "POST",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API_URL}/rooms`, options);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.error("Error:", error);
	}
};

export const editRoom = async (id, data) => {
	try {
		const options = {
			method: "PUT",
			headers: {
				authorization: API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API_URL}/rooms/${id}`, options);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.error("Error:", error);
	}
};

export function visuallyHideModalBackdrop() {
	$(".modal-backdrop").addClass("visually-hidden");
}
