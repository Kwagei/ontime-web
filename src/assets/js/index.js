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

const getVisitors = async (start = 0, limit = 10) => {
    try {
        const response = await fetch(`${API}/visitors?start=${start}&limit=${limit}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
};

const getSingleVisitor = async (data) => {
    try {
        const {id, msisdn} = data;
        if(id){
            console.log({id})
            return {id}
        }else if(msisdn) {
            const response = await fetch(`${API}/visitors?search=${msisdn}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const { data } = await response.json();
            console.log({data})
            
            return data[0];

        }
    } catch (error) {
        // console.error("Error:", error);
    }
}

// const getSingleVisitor = async (data) => {
//     try {
//         const {id, msisdn} = data;
//         if (id) {
//             console.log({id});
//             return {id};
//         } else {
//             const response = await fetch(`${API}/visitors?search=${msisdn}`);
//             if (!response.ok) {
//                 throw new Error("Network response was not ok");
//             }
//             const jsonData = await response.json();
//             console.log(jsonData);
//             return jsonData;
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// };



const registerVisit = async (visitdata) => {
    try {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(visitdata),
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
        const response = await fetch(`${API}/visits?start=${start}&limit=${limit}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
};

export { registerVisitor, getVisitors, getVisits, registerVisit, getSingleVisitor };