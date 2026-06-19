import api from "./axiosClient";

const chatbotCheckoutApi = {

    getInfo() {

        return api.get(
            "/chatbot/checkout-info"
        );
    }
};

export default chatbotCheckoutApi;
