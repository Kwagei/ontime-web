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

        return !response.ok ? response.message : await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
};

export { registerVisitor };
