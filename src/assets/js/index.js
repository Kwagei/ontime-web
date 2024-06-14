const API = import.meta.env.VITE_API_URL;
const API_URL = "https://ontime-kit.glitch.me/api/";

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

function formatDate(date) {
    const rawDate = new Date(date);

    return rawDate.toString().split(" 0")[0];
}

function visuallyHideModalBackdrop() {
    const modalsBackdrops = document.querySelectorAll(".modal-backdrop");

    if (modalsBackdrops.length) {
        modalsBackdrops.forEach((modal) =>
            modal.classList.add("visually-hidden")
        );
    }
}

export {
    registerVisitor,
    editVisitor,
    getSingleVisitor,
    getVisitors,
    formatDate,
    visuallyHideModalBackdrop,
    API_URL,
};
