const API = import.meta.env.VITE_API_URL;
const API_URL = "http://localhost:3000/api/";

const registerVisitor = async (data) => {
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

const editVisitor = async (id, data) => {
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

const getSingleVisitor = async (data) => {
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

const getVisitors = async (query) => {
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

const getVisitorWithVisits = async (id, query) => {
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

function visuallyHideModalBackdrop() {
    const modalsBackdrops = document.querySelectorAll(".modal-backdrop");

    if (modalsBackdrops.length) {
        modalsBackdrops.forEach((modal) =>
            modal.classList.add("visually-hidden")
        );
    }
}

function formatDate(date) {
    const rawDate = new Date(date);

    return rawDate.toString().split(" 0")[0];
}

export default {
    API_URL,
    registerVisitor,
    editVisitor,
    getSingleVisitor,
    getVisitors,
    getVisitorWithVisits,
    visuallyHideModalBackdrop,
    formatDate,
};
