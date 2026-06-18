const API_URL = "http://127.0.0.1:8000/api/chatbot/ask";

const chatBotService = {

    askAI: async (messageText) => {

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(API_URL, {
                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    message: messageText
                }),
            });

        if (!response.ok) {

            throw new Error(
                "Lỗi mạng hoặc server"
            );
        }

        return await response.json();
    }
};

export default chatBotService;
