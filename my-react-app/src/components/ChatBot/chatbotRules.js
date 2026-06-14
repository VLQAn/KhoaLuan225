import { normalizeText } from "./chatbotUtils";
import { detectIntent } from "./chatbotIntents";
import { detectDate } from "./chatbotDate";
import { detectCinema } from "./chatbotCinema";
import { findBestMovieMatch } from "./chatbotMovie";
import { filterShowtimes } from "./chatbotShowtime";
import { detectTimePeriod } from "./chatbotTime";
import { detectMovieInfoIntent } from "./chatbotMovieInfo";
import { detectRatingFilter } from "./chatbotRating";
import { isMovieDiscoveryQuery } from "./chatbotMovieDiscovery";

const chatbotRules = (
    message,
    movies,
    promotions,
    showtimes,
) => {
    console.log(
        "ALL CINEMAS",
        showtimes.map(
            x => x?.phong_chieu?.rap_chieu?.tenRap
        )
    );

    const text =
        normalizeText(message);

    const intent = detectIntent(text);

    const isActorSearch =
        text.includes("dien vien")
        ||
        text.includes("tham gia")
        ||
        text.includes("cua");

    const isDirectorSearch =
        text.includes("dao dien")
        ||
        text.includes("cua");

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
       TỪ KHÓA CÓ THỂ BỎ QUA KHI TÌM KIẾM ĐẠO DIỄN, DIỄN VIÊN
    ===================================== */
    const searchStopWords = [
        "toi",
        "muon",
        "xem",
        "co",
        "nao",
        "khong",
        "hom",
        "nay",
        "toi",
        "giup",
        "minh",
        "xin",
        "phim",
        "cua",
        "dao",
        "dien",
        "dien",
        "vien",
        "tham",
        "gia"
    ];

    /* =====================================
       TỪ KHÓA CÓ THỂ BỎ QUA
    ===================================== */
    const stopWords = [
        "thong tin",
        "chi tiet",
        "toi",
        "muon",
        "xem",
        "co",
        "nao",
        "khong",
        "toi nay",
        "hom nay",
        "giup",
        "minh",
        "xin",
        "phim",
        "cua",
        "dao",
        "dien",
        "vien",
        "tham",
        "gia"
    ];

    const keywords =
        text
            .split(" ")
            .filter(
                word =>
                    word.length > 2 &&
                    !stopWords.includes(word)
            );

    /* =====================================
       LÀM SẠCH YÊU CẦU
    ===================================== */
    let cleanText = text;

    stopWords.forEach(word => {

        cleanText =
            cleanText.replaceAll(
                word,
                ""
            );

    });

    const processedText =
        cleanText.trim();

    const suggestionKeywords = [
        "goi y",
        "de xuat",
        "recommend",
        "hay",
        "nen xem"
    ];

    const isSuggestion =
        suggestionKeywords.some(
            keyword =>
                processedText.includes(
                    keyword
                )
        );

    /* =====================================
        NHẬN DIỆN Ý ĐỊNH ĐẶT VÉ
    ===================================== */

    const bookingKeywords = [
        "dat ve",
        "mua ve",
        "book ve",
        "dat cho",
        "giu cho"
    ];

    const isBookingIntent =
        bookingKeywords.some(
            keyword =>
                processedText.includes(
                    keyword
                )
        );

    /* =====================================
        NHẬN DIỆN NĂM PHÁT HÀNH
    ===================================== */

    const yearMatch =
        processedText.match(
            /\b(19|20)\d{2}\b/
        );

    const detectedYear =
        yearMatch
            ? Number(yearMatch[0])
            : null;

    const originalText = text;

    const detectedRating =
        detectRatingFilter(
            originalText
        );

    const detectedDate =
        detectDate(originalText);

    const detectedTimePeriod =
        detectTimePeriod(
            originalText
        );

    const detectedCinema =
        detectCinema(
            originalText,
            showtimes
        );

    const isMovieDiscovery =
        isMovieDiscoveryQuery(
            originalText
        );

    /* =====================================
        NHẬN DIỆN RẠP CHIẾU
    ===================================== */
    const allCinemas = [];

    showtimes.forEach(showtime => {

        const cinemaName =
            normalizeText(
                showtime
                    ?.phong_chieu
                    ?.rap_chieu
                    ?.tenRap || ""
            );

        if (
            cinemaName &&
            !allCinemas.includes(cinemaName)
        ) {
            allCinemas.push(cinemaName);
        }

    });

    /* =====================================
       NHẬN DIỆN THỂ LOẠI
    ===================================== */

    let detectedGenre =
        allGenres.find(
            genre =>
                processedText.includes(
                    genre
                )
        );

    if (!detectedGenre) {

        Object.entries(
            genreAlias
        ).forEach(
            ([keyword, genre]) => {

                if (
                    processedText.includes(
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

    if (intent === "showing_movies") {

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

    if (intent === "upcoming_movies") {

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

    if (intent === "promotions") {

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
       TOP PHIM HAY NHẤT
    ===================================== */
    if (intent === "top_movies") {

        const topMovies =
            movies
                .filter(
                    movie =>
                        movie.trangThai ===
                        "dang_chieu"
                )
                .sort(
                    (a, b) =>
                        Number(b.danhGia)
                        -
                        Number(a.danhGia)
                );

        return {
            type: "movie_list",
            title:
                "🏆 Top phim đánh giá cao",
            movies:
                topMovies.slice(0, 5)
        };
    }

    /* =====================================
       RATING PHIM
    ===================================== */
    if (detectedRating) {

        const ratingMovies =
            movies
                .filter(movie => {

                    const rating =
                        Number(
                            movie.danhGia || 0
                        );

                    return (
                        movie.trangThai ===
                        "dang_chieu"

                        &&

                        rating >=
                        detectedRating
                    );
                })
                .sort(
                    (a, b) =>
                        Number(b.danhGia)
                        -
                        Number(a.danhGia)
                );
        if (
            ratingMovies.length > 0
        ) {

            return {
                type: "movie_list",
                title:
                    `⭐ Phim đang chiếu từ ${detectedRating} điểm trở lên`,
                movies:
                    ratingMovies.slice(
                        0,
                        10
                    )
            };
        }

        return {
            type: "text",
            text:
                `Không tìm thấy phim nào từ ${detectedRating} điểm trở lên.`
        };
    }

    /* =====================================
        TÌM PHIM THEO NĂM PHÁT HÀNH
    ===================================== */

    if (detectedYear) {

        const moviesByYear =
            movies.filter(movie => {

                if (!movie.ngayCongChieu)
                    return false;

                const year =
                    new Date(
                        movie.ngayCongChieu
                    ).getFullYear();

                return year === detectedYear;
            });

        if (moviesByYear.length > 0) {

            return {
                type: "movie_list",
                title:
                    `📅 Phim năm ${detectedYear}`,
                movies:
                    moviesByYear.slice(0, 10)
            };
        }

        return {
            type: "text",
            text:
                `Không tìm thấy phim phát hành năm ${detectedYear}.`
        };
    }

    /* =====================================
   GỢI Ý PHIM
===================================== */

    if (
        isSuggestion &&
        detectedGenre
    ) {

        const suggestedMovies =
            movies
                .filter(movie =>

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
                .sort(
                    (a, b) =>
                        Number(b.danhGia || 0)
                        -
                        Number(a.danhGia || 0)
                );

        if (
            suggestedMovies.length > 0
        ) {

            return {
                type: "movie_list",

                title:
                    `⭐ Gợi ý phim ${detectedGenre}`,

                movies:
                    suggestedMovies.slice(
                        0,
                        5
                    )
            };
        }
    }

    if (
        isSuggestion &&
        !detectedGenre
    ) {

        const bestMovies =
            movies
                .filter(
                    movie =>
                        movie.trangThai ===
                        "dang_chieu"
                )
                .sort(
                    (a, b) =>
                        Number(b.danhGia || 0)
                        -
                        Number(a.danhGia || 0)
                );

        return {
            type: "movie_list",
            title:
                "⭐ Phim được đề xuất",
            movies:
                bestMovies.slice(
                    0,
                    5
                )
        };
    }

    /* =====================================
       TÌM PHIM THEO THỂ LOẠI
       (ƯU TIÊN CAO)
    ===================================== */

    if (
        detectedGenre
        &&
        !isMovieDiscovery
    ) {
        console.log(
            "GENRE:",
            detectedGenre
        );

        console.log(
            "DISCOVERY:",
            isMovieDiscovery
        );

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

    /* =====================
       TÌM PHIM THEO DIỄN VIÊN
    ===================== */

    if (isActorSearch) {

        const actorMovies =
            movies.filter(movie => {

                const actors =
                    normalizeText(
                        movie.dienVien || ""
                    );

                return keywords.every(
                    keyword =>
                        actors.includes(keyword)
                );

            });

        if (actorMovies.length > 0) {

            return {
                type: "movie_list",
                title: `🎭 Tìm thấy ${actorMovies.length} phim`,
                movies: actorMovies.slice(0, 5)
            };
        }
    }

    /* =====================
        TÌM PHIM THEO ĐẠO DIỄN
    ===================== */

    if (isDirectorSearch) {

        const directorMovies =
            movies.filter(movie => {

                const director =
                    normalizeText(
                        movie.daoDien || ""
                    );

                return keywords.every(
                    keyword =>
                        director.includes(keyword)
                );

            });

        if (directorMovies.length > 0) {

            return {
                type: "movie_list",
                title: `🎬 Phim của đạo diễn`,
                movies: directorMovies.slice(0, 5)
            };
        }
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
        Ý ĐỊNH ĐẶT VÉ
    ===================================== */

    if (intent === "booking") {
        const movieQuery =
            processedText
                .replace("dat ve", "")
                .replace("mua ve", "")
                .replace("book ve", "")
                .replace("dat cho", "")
                .replace("giu cho", "")
                .trim();

        if (!movieQuery) {

            return {
                type: "booking_intent",
                text:
                    "🎟️ Bạn muốn đặt vé phim nào?"
            };

        }

        const detectedMovie =
            findBestMovieMatch(
                movieQuery,
                movies
            );

        if (detectedMovie) {

            const movieShowtimes =
                filterShowtimes(
                    showtimes,
                    detectedMovie,
                    detectedDate,
                    detectedCinema,
                    detectedTimePeriod
                );

            if (movieShowtimes.length > 0) {

                return {
                    type: "showtime_list",
                    movie: detectedMovie,
                    showtimes: movieShowtimes,
                    text:
                        `🎟️ Các suất chiếu của "${detectedMovie.tieuDe}"`
                };
            }

            return {
                type: "text",
                text:
                    `🎬 "${detectedMovie.tieuDe}" hiện chưa có suất chiếu.`
            };
        }
    }

    const isMovieInfoIntent =
        originalText.includes("thong tin")
        ||
        originalText.includes("chi tiet");

    if (intent === "recommendation") {

        const bestMovies =
            movies
                .filter(
                    movie =>
                        movie.trangThai ===
                        "dang_chieu"
                )
                .sort(
                    (a, b) =>
                        Number(b.danhGia || 0)
                        -
                        Number(a.danhGia || 0)
                );

        return {
            type: "movie_list",
            title:
                "⭐ Phim đáng xem hôm nay",
            movies:
                bestMovies.slice(0, 5)
        };
    }

    /* =====================================
       NHẬN DIỆN TÊN PHIM
    ===================================== */
    if (isMovieDiscovery) {

        let filteredShowtimes =
            [...showtimes];

        // chỉ lấy suất còn hiệu lực

        filteredShowtimes =
            filteredShowtimes.filter(
                showtime =>
                    new Date(
                        showtime.thoiGianKetThuc
                    ) > new Date()
            );

        // ngày
        if (detectedDate) {

            filteredShowtimes =
                filteredShowtimes.filter(
                    showtime => {

                        const showDate =
                            new Date(
                                showtime.thoiGianBatDau
                            );

                        if (
                            detectedDate.type ===
                            "weekend"
                        ) {

                            return (
                                showDate.getDay() === 6
                                ||
                                showDate.getDay() === 0
                            );
                        }

                        return (
                            showDate.toDateString()
                            ===
                            detectedDate.date.toDateString()
                        );
                    }
                );
        }

        //buổi sáng, chiểu, tối
        if (detectedTimePeriod) {

            filteredShowtimes =
                filteredShowtimes.filter(
                    showtime => {

                        const hour =
                            new Date(
                                showtime.thoiGianBatDau
                            ).getHours();

                        switch (
                        detectedTimePeriod
                        ) {

                            case "morning":
                                return (
                                    hour >= 6 &&
                                    hour < 12
                                );

                            case "afternoon":
                                return (
                                    hour >= 14 &&
                                    hour < 18
                                );

                            case "evening":
                                return (
                                    hour >= 18
                                );

                            default:
                                return true;
                        }
                    }
                );
        }

        // lọc rap
        if (detectedCinema) {

            filteredShowtimes =
                filteredShowtimes.filter(
                    showtime => {

                        const cinemaName =
                            normalizeText(
                                showtime
                                    ?.phong_chieu
                                    ?.rap_chieu
                                    ?.tenRap || ""
                            );

                        if (
                            detectedCinema.type ===
                            "brand"
                        ) {

                            return cinemaName.includes(
                                detectedCinema.value
                            );
                        }

                        return (
                            cinemaName ===
                            detectedCinema.value
                        );
                    }
                );
        }

        // lọc thể loại
        let matchedMovies =
            movies.filter(movie => {

                const exists =
                    filteredShowtimes.some(
                        showtime =>
                            showtime.maPhim ===
                            movie.maPhim
                    );

                if (!exists)
                    return false;

                if (!detectedGenre)
                    return true;

                return movie.theLoai?.some(
                    type =>
                        normalizeText(
                            type.tenTheLoai
                        ) === detectedGenre
                );
            });

        // chỉ lấy phim đang chiếu
        matchedMovies =
            matchedMovies.filter(
                movie =>
                    movie.trangThai ===
                    "dang_chieu"
            );

        // trả kết quả
        if (matchedMovies.length > 0) {
            let title = "🎬 Phim phù hợp";

            if (detectedGenre) {
                title =
                    `🎬 Phim ${detectedGenre}`;
            }

            if (detectedTimePeriod) {
                title += " theo khung giờ yêu cầu";
            }

            if (detectedCinema) {
                title += ` tại ${detectedCinema.value}`;
            }

            return {

                type: "movie_list",

                title: title,

                movies:
                    matchedMovies.slice(
                        0,
                        10
                    )
            };
        }

        if (matchedMovies.length === 0) {

            return {
                type: "text",
                text:
                    "🎬 Không tìm thấy phim phù hợp với yêu cầu của bạn."
            };
        }
    }

    /* =====================================
       TÌM PHIM THEO TÊN
    ===================================== */

    let foundMovie = null;

    if (processedText.length >= 3) {

        foundMovie =
            movies.find(movie => {

                const movieName =
                    normalizeText(
                        movie.tieuDe
                    );

                return (
                    processedText.includes(
                        movieName
                    )
                    ||
                    movieName.includes(
                        processedText
                    )
                );
            });
    }

    if (!foundMovie) {

        foundMovie =
            findBestMovieMatch(
                processedText,
                movies
            );
    }

    const movieInfoIntent =
        detectMovieInfoIntent(
            originalText
        );

    if (
        foundMovie
        &&
        movieInfoIntent ===
        "duration"
    ) {

        return {
            type: "text",

            text:
                `⏱️ ${foundMovie.tieuDe} có thời lượng ${foundMovie.thoiLuong} phút.`
        };
    }

    if (
        foundMovie
        &&
        movieInfoIntent ===
        "director"
    ) {

        return {

            type: "text",

            text:
                `🎬 Đạo diễn: ${foundMovie.daoDien}`
        };
    }

    if (
        foundMovie
        &&
        movieInfoIntent ===
        "cast"
    ) {

        return {

            type: "text",

            text:
                `🎭 Diễn viên:\n${foundMovie.dienVien}`
        };
    }

    if (
        foundMovie
        &&
        movieInfoIntent ===
        "description"
    ) {

        return {

            type: "text",

            text:
                `📖 ${foundMovie.moTa}`
        };
    }

    if (
        foundMovie
        &&
        movieInfoIntent ===
        "rating"
    ) {

        return {

            type: "text",

            text:
                `⭐ Đánh giá: ${foundMovie.danhGia}/10`
        };
    }

    const shouldShowShowtimes =
        foundMovie
        &&
        (
            intent === "showtime"
            ||
            intent === "booking"
            ||
            detectedDate
            ||
            detectedCinema
            ||
            detectedTimePeriod
        );

    if (shouldShowShowtimes) {
        const movieShowtimes =
            filterShowtimes(
                showtimes,
                foundMovie,
                detectedDate,
                detectedCinema,
                detectedTimePeriod
            );

        if (movieShowtimes.length === 0) {
            return {
                type: "text",
                text:
                    `🎬 Hiện chưa có suất chiếu phù hợp cho "${foundMovie.tieuDe}".`
            };
        }

        let title =
            `🎟️ Lịch chiếu của "${foundMovie.tieuDe}"`;

        if (detectedCinema) {
            title +=
                ` tại ${detectedCinema.value}`;
        }

        if (detectedDate?.type === "single") {
            title +=
                ` ngày ${detectedDate.date.toLocaleDateString("vi-VN")}`;
        }

        if (detectedDate?.type === "weekend") {
            title +=
                ` cuối tuần`;
        }

        return {
            type: "showtime_list",
            movie: foundMovie,
            showtimes: movieShowtimes,
            text: title
        };
    }

    if (foundMovie) {

        const movieShowtimes =
            filterShowtimes(
                showtimes,
                foundMovie,
                detectedDate,
                detectedCinema,
                detectedTimePeriod
            );

        return {
            type: "showtime_list",
            movie: foundMovie,
            showtimes: movieShowtimes,
            text:
                `🎟️ Các suất chiếu của "${foundMovie.tieuDe}"`
        };
    }

    /* =====================================
       HƯỚNG DẪN ĐẶT VÉ
    ===================================== */

    if (
        processedText.includes("dat ve")
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
