const chatbotRules = (
    message,
    movies,
    promotions
) => {

    const text =
        message.toLowerCase();

    /* =====================
       PHIM ĐANG CHIẾU
    ===================== */

    if (
        text.includes("đang chiếu")
    ) {

        const showing =
            movies.filter(
                m =>
                    m.trangThai ===
                    "dang_chieu"
            );

        if (showing.length === 0)
            return "Hiện chưa có phim đang chiếu.";

        return (
            "🎬 Phim đang chiếu:\n\n" +
            showing
                .map(
                    m => `• ${m.tieuDe}`
                )
                .join("\n")
        );
    }

    /* =====================
       PHIM SẮP CHIẾU
    ===================== */

    if (
        text.includes("sắp chiếu")
    ) {

        const upcoming =
            movies.filter(
                m =>
                    m.trangThai ===
                    "sap_chieu"
            );

        if (upcoming.length === 0)
            return "Hiện chưa có phim sắp chiếu.";

        return (
            "🎥 Phim sắp chiếu:\n\n" +
            upcoming
                .map(
                    m => `• ${m.tieuDe}`
                )
                .join("\n")
        );
    }

    /* =====================
       KHUYẾN MÃI
    ===================== */

    if (
        text.includes("khuyến mãi") ||
        text.includes("giảm giá")
    ) {

        if (
            promotions.length === 0
        ) {
            return "Hiện chưa có chương trình khuyến mãi.";
        }

        return (
            "🎁 Khuyến mãi hiện có:\n\n" +
            promotions
                .map(
                    p => `• ${p.tenKhuyenMai}`
                )
                .join("\n")
        );
    }

    /* =====================
       TÌM PHIM THEO TÊN
    ===================== */

    const foundMovie =
        movies.find(
            movie =>
                text.includes(
                    movie.tieuDe.toLowerCase()
                )
        );

    if (foundMovie) {

        return `
🎬 ${foundMovie.tieuDe}

⏱ ${foundMovie.thoiLuong} phút

🎭 ${foundMovie.theLoai
                ?.map(
                    t => t.tenTheLoai
                )
                .join(", ")}

🎬 Đạo diễn: ${foundMovie.daoDien}

⭐ Đánh giá: ${foundMovie.danhGia}
`;
    }

    /* =====================
       ĐẶT VÉ
    ===================== */

    if (
        text.includes("đặt vé")
    ) {

        return `
Bạn có thể đặt vé theo các bước:

1. Chọn phim
2. Chọn suất chiếu
3. Chọn ghế
4. Thanh toán
`;
    }

    return `
Xin lỗi, tôi chưa hiểu câu hỏi.

Bạn có thể hỏi:

• Phim đang chiếu
• Phim sắp chiếu
• Khuyến mãi
• Tên phim bất kỳ
`;
};

export default chatbotRules;
