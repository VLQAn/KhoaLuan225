import axiosClient from "./axiosClient";

const bapNuocApi = {

    getAllFoods: () => {
        return axiosClient.get("/bap-nuoc");
    },

    createFood: (data) => {
        return axiosClient.post("/bap-nuoc", data);
    },

    updateFood: (id, data) => {
        return axiosClient.put(`/bap-nuoc/${id}`, data);
    },

    deleteFood: (id) => {
        return axiosClient.delete(`/bap-nuoc/${id}`);
    },

    updateStatus: (id, trangThai) => {
        return axiosClient.put(`/bap-nuoc/${id}/status`, {
            trangThai
        });
    }
};

export default bapNuocApi;
