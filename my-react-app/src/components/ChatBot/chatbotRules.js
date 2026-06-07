import { normalizeText } from "./chatbotUtils";

const chatbotRules = (
    message,
    movies,
    promotions
) => {

    const text =
        normalizeText(message);

    /* =====================================
       DANH SÁCH THỂ LOẠI
    ===================================== */

    const allGenres = [];

    movies.forEach(movie => {

        movie.theLoai?.forEach(type => {

            const genre =
                normalizeText(
                    type.tenTheLoai
                );

            if (
                !allGenres.includes(
                    genre
                )
            ) {
                allGenres.push(
                    genre
                );
            }

        });

    });

    /* =====================================
       TỪ KHÓA THỂ LOẠI THAY THẾ
    ===================================== */

    const genreAlias = {

        "phim ma":
            "kinh di",

        "ma quy":
            "kinh di",

        "hai huoc":
            "hai",

        "tinh yeu":
            "lang man",

        "yeu duong":
            "lang man",

        "sieu nhan":
            "sieu anh hung",

        "xac song":
            "zombie",

        "vo":
            "vo thuat"
    };

    /* =====================================
       NHẬN DIỆN THỂ LOẠI
    ===================================== */

    let detectedGenre =
        allGenres.find(
            genre =>
                text.includes(
                    genre
                )
        );

    if (!detectedGenre) {

        Object.entries(
            genreAlias
        ).forEach(
            ([keyword, genre]) => {

                if (
                    text.includes(
                        keyword
                    )
                ) {
                    detectedGenre =
                        genre;
                }

            }
        );
    }

    /* =====================================
       DANH SÁCH PHIM THEO THỂ LOẠI
    ===================================== */

    const genreMovies =
        detectedGenre
            ? movies.filter(movie =>

                movie.trangThai ===
                "dang_chieu"

                &&

                movie.theLoai?.some(
                    type =>

                        normalizeText(
                            type.tenTheLoai
                        ) === detectedGenre
                )
            )
            : [];

    /* =====================================
       PHIM ĐANG CHIẾU
    ===================================== */

    if (
        text.includes("dang chieu")
    ) {

        const showing =
            movies.filter(
                movie =>
                    movie.trangThai ===
                    "dang_chieu"
            );

        return {
            type: "text",
            text:
                showing.length > 0
                    ? "🎬 Phim đang chiếu:\n\n" +
                    showing
                        .map(
                            movie =>
                                `• ${movie.tieuDe}`
                        )
                        .join("\n")
                    : "Hiện chưa có phim đang chiếu."
        };
    }

    /* =====================================
       PHIM SẮP CHIẾU
    ===================================== */

    if (
        text.includes("sap chieu")
    ) {

        const upcoming =
            movies.filter(
                movie =>
                    movie.trangThai ===
                    "sap_chieu"
            );

        return {
            type: "text",
            text:
                upcoming.length > 0
                    ? "🎥 Phim sắp chiếu:\n\n" +
                    upcoming
                        .map(
                            movie =>
                                `• ${movie.tieuDe}`
                        )
                        .join("\n")
                    : "Hiện chưa có phim sắp chiếu."
        };
    }

    /* =====================================
       KHUYẾN MÃI
    ===================================== */

    if (
        text.includes("khuyen mai")
        ||
        text.includes("giam gia")
    ) {

        return {
            type: "text",
            text:
                promotions.length > 0
                    ? "🎁 Khuyến mãi hiện có:\n\n" +
                    promotions
                        .map(
                            promo =>
                                `• ${promo.tenKhuyenMai}`
                        )
                        .join("\n")
                    : "Hiện chưa có chương trình khuyến mãi."
        };
    }

    /* =====================================
       TÌM PHIM THEO THỂ LOẠI
       (ƯU TIÊN CAO)
    ===================================== */

    if (detectedGenre) {

        if (
            genreMovies.length === 0
        ) {

            return {
                type: "text",
                text:
                    `Hiện chưa có phim ${detectedGenre} đang chiếu.`
            };
        }

        return {

            type: "movie_list",

            title:
                `🎬 ${detectedGenre.toUpperCase()} (${genreMovies.length} phim)`,

            movies:
                genreMovies
                    .sort(
                        (a, b) =>
                            Number(b.danhGia || 0)
                            -
                            Number(a.danhGia || 0)
                    )
                    .slice(0, 5)
        };
    }

    /* =====================================
       TÌM PHIM THEO TỪ KHÓA
    ===================================== */

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
                words.filter(
                    word =>
                        movieName.includes(
                            word
                        )
                );

            return (
                matchedWords.length >= 2
            );
        });
    };

    /* =====================================
       TÌM PHIM THEO TÊN
    ===================================== */

    let foundMovie =
        movies.find(movie => {

            const movieName =
                normalizeText(
                    movie.tieuDe
                );

            return (
                text.includes(
                    movieName
                )
                ||
                movieName.includes(
                    text
                )
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

        return {
            type: "movie",
            movie: foundMovie
        };
    }

    /* =====================================
       HƯỚNG DẪN ĐẶT VÉ
    ===================================== */

    if (
        text.includes("dat ve")
    ) {

        return {
            type: "text",
            text:
                "Bạn có thể đặt vé theo các bước:\n\n" +
                "1. Chọn phim\n" +
                "2. Chọn suất chiếu\n" +
                "3. Chọn ghế\n" +
                "4. Thanh toán"
        };
    }

    /* =====================================
       MẶC ĐỊNH
    ===================================== */

    return {
        type: "text",
        text:
            "Xin lỗi, tôi chưa hiểu câu hỏi.\n\n" +
            "Bạn có thể hỏi:\n\n" +
            "• Phim đang chiếu\n" +
            "• Phim sắp chiếu\n" +
            "• Khuyến mãi\n" +
            "• Phim kinh dị\n" +
            "• Phim hành động\n" +
            "• Tên phim bất kỳ"
    };
};

export default chatbotRules;
