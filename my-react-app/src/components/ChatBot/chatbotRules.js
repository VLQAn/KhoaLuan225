import { normalizeText } from "./chatbotUtils";

const chatbotRules = (
    message,
    movies,
    promotions
) => {

    const text =
        normalizeText(message);

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
        text.includes("sap chieu")
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
        text.includes("khuyen mai") ||
        text.includes("giam gia")
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
       HÀM TÌM THEO TỪ KHÓA
    ===================== */

    const findMovieByKeyword = (
        text,
        movies
    ) => {

        const words =
            text.split(" ");

        return movies.find(movie => {

            const movieName =
                normalizeText(
                    movie.tieuDe
                );

            const matchedWords =
                words.filter(word =>
                    movieName.includes(word)
                );

            return matchedWords.length >= 2;
        });
    };

    /* =====================
       TÌM PHIM THEO TÊN
    ===================== */

    let foundMovie =
        movies.find(movie => {

            const movieName =
                normalizeText(
                    movie.tieuDe
                );

            return (
                text.includes(movieName)
                ||
                movieName.includes(text)
            );
        });

    if (!foundMovie) {

        foundMovie =
            findMovieByKeyword(
                text,
                movies
            );
    }
    
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
        text.includes("dat ve")
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
