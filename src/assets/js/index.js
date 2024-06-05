const API = import.meta.env.VITE_API_URL;
export const API_URL = API;

export const registerVisit = async (data) => {
	try {
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API}/visits`, options);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.error("Error: ", error);
	}
};

export const registerVisitor = async (data) => {
	try {
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API}/visitors`, options);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.error("Error:", error);
	}
};

<<<<<<< HEAD
export const editVisitor = async (id, data) => {
	try {
		const options = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API}/visitors/${id}`, options);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.error("Error:", error);
	}
};

export const getUsers = async (data) => {
	try {
		const response = await fetch(`${API}/users`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const { data } = await response.json();
		return data;
	} catch (error) {}
};

export const getSingleVisitor = async (data) => {
	const { id, msisdn } = data;
	let response;

	try {
		if (id) {
			response = await fetch(`${API}/visitors/${id}`);
		} else if (msisdn) {
			response = await fetch(`${API}/visitors?search=${msisdn}`);
		}

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const { data } = await response.json();
		return data[0];
	} catch (error) {}
};

export const getVisits = async (query = {}) => {
	try {
		const {
			search = "",
			start = 0,
			limit = 20,
			sort = "",
			direction = "",
		} = query;

		let url = `${API}/visits?start=${start}&limit=${limit}`;

		if (search) {
			url += `&search=${search}`;
		}

		if (sort) {
			url += `&sort=${sort}&direction=${direction}`;
		}

		const response = await fetch(url);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const { data } = await response.json();

		return data;
	} catch (error) {
		console.error("Error: ", error);
	}
};

export const getVisitors = async (query) => {
	try {
		const {
			search = "",
			start = 0,
			limit = 20,
			sort = "",
			direction = "",
		} = query;

		let url = `${API}/visitors?start=${start}&limit=${limit}`;

		if (search) {
			url += `&search=${search}`;
		}

		if (sort) {
			url += `&sort=${sort}&direction=${direction}`;
		}

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const { data } = await response.json();

		return data;
	} catch (error) {
		console.error("Error:", error);
	}
};

export const getVisitorWithVisits = async (id, query) => {
	try {
		const {
			search = "",
			start = 0,
			limit = 20,
			sort = "",
			direction = "",
		} = query;

		let url = `${API}/visitors/${id}/visits?&start=${start}&limit=${limit}`;

		if (search) {
			url += `&search=${search}`;
		}

		if (sort) {
			url += `&sort=${sort}&direction=${direction}`;
		}

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const { data } = await response.json();

		return data;
	} catch (error) {
		console.error("Error: ", error);
	}
};

export function visuallyHideModalBackdrop() {
	const modalsBackdrops = document.querySelectorAll(".modal-backdrop");

	if (modalsBackdrops.length) {
		modalsBackdrops.forEach((modal) =>
			modal.classList.add("visually-hidden")
		);
	}
}

export function formatDate(date) {
	const rawDate = new Date(date);

	return rawDate.toString().split(" 0")[0];
}
=======
const getUsers = async (data) => {
	try {
		const response = await fetch(`${API}/users`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const { data: result } = await response.json();
		return result;
	} catch (error) {
		console.error("Error:", error);
	}
};

const getSingleVisitor = async (data) => {
	try {
		const { id, msisdn } = data;
		if (id) {
			console.log({ id });
			return { id };
		} else if (msisdn) {
			const response = await fetch(`${API}/visitors?search=${msisdn}`);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const { data } = await response.json();
			console.log({ data });

			return data[0];
		}
	} catch (error) {
		console.error("Error:", error);
	}
};

const registerVisit = async (data) => {
	try {
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(`${API}/visits`, options);

		const result = await response.json();

		return { ok: response.ok, result };
	} catch (error) {
		console.error("Error:", error);
	}
};

const getVisits = async (start = 0, limit = 10) => {
	try {
		const response = await fetch(
			`${API}/visits?start=${start}&limit=${limit}`
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error("Error:", error);
	}
};

export { registerVisitor, getVisitors, getVisits, registerVisit, getSingleVisitor, getUsers };
>>>>>>> d239594 (can register a visit successfully)
