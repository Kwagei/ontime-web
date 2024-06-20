export const API = import.meta.env.VITE_API_URL;
export const API_URL = "http://localhost:3000/api/";

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

export const getVisitors = async (query) => {
    try {
        const {
            search = "",
            start = 0,
            limit = 10,
            sort = "",
            direction = "",
        } = query;

        const response = await fetch(
            `${API}/visitors/?search=${search}&start=${start}&limit=${limit}&sort=${sort}&direction=${direction}`
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
    $(".modal-backdrop").addClass("visually-hidden");
}

export function formatDate(date) {
    const rawDate = new Date(date);

    return rawDate.toString().split(" 0")[0];
}
