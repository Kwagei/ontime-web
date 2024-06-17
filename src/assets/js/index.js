const API = import.meta.env.VITE_API_URL;
export const API_URL = API;

<<<<<<< HEAD
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

=======
>>>>>>> ece4a61 (Completed the validation for adding a visitor)
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

<<<<<<< HEAD
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

=======
>>>>>>> ece4a61 (Completed the validation for adding a visitor)
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

<<<<<<< HEAD
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

=======
>>>>>>> ece4a61 (Completed the validation for adding a visitor)
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
