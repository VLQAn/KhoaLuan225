import axiosClient from "./axiosClient";

const khuyenMaiApi = {
    getAll: () => axiosClient.get("/khuyen-mai"),

    getById: (id) => axiosClient.get(`/khuyen-mai/${id}`),

    create: (data) => axiosClient.post("/khuyen-mai", data),

    update: (id, data) => axiosClient.put(`/khuyen-mai/${id}`, data),

    delete: (id) => axiosClient.delete(`/khuyen-mai/${id}`),
};

export default khuyenMaiApi;
