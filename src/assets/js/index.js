const API = "http://127.0.0.1:3000/api";

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

export { registerVisitor, getVisitors, getVisits, registerVisit };
