const API_URL = "http://127.0.0.1:8000/api/chatbot/ask";

const chatBotService = {
    sendMessage: async (messageText) => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) {
                throw new Error("Lỗi mạng hoặc server không phản hồi");
            }

            // Kết quả trả về mong đợi: { message: "Câu trả lời từ AI" }
            const data = await response.json();
            return data; 
        } catch (error) {
            console.error("Lỗi tại chatBotService:", error);
            throw error;
        }
    }
};

export default chatBotService;
