import api from "./axiosClient";

const chatbotCheckoutApi = {

    getInfo(maHoaDon) {

        return api.get(
            `/chatbot/checkout-info/${maHoaDon}`
        );
    }
};

export default chatbotCheckoutApi;
