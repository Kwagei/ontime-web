const API = import.meta.env.VITE_API_URL;

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
