const chatbotRules = (message) => {
    const text = message.toLowerCase();

    if (
        text.includes("phim") &&
        text.includes("đang chiếu")
    ) {
        return "Bạn có thể xem danh sách phim đang chiếu tại mục Phim.";
    }

    if (
        text.includes("khuyến mãi") ||
        text.includes("giảm giá")
    ) {
        return "Bạn có thể xem các chương trình khuyến mãi tại mục Khuyến Mãi.";
    }

    if (
        text.includes("đặt vé")
    ) {
        return "Để đặt vé, hãy chọn phim → suất chiếu → ghế ngồi → thanh toán.";
    }

    if (
        text.includes("liên hệ")
    ) {
        return "Bạn có thể liên hệ RACSO qua email hoặc số điện thoại ở cuối trang.";
    }

    if (
        text.includes("mở cửa")
    ) {
        return "Rạp mở cửa từ 8:00 đến 23:00 mỗi ngày.";
    }

    return "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi về phim, khuyến mãi hoặc cách đặt vé.";
};

export default chatbotRules;
