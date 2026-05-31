// foodApi.js (tạo mới)
import axios from "axios";

const API = "http://127.0.0.1:8000/api/bap-nuoc";

const foodApi = {
    getByRap: (maRap) =>
        axios.get(`${API}?maRap=${maRap}`)
};

export default foodApi;
