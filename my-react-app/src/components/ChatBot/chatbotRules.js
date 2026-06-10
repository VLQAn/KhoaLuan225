import { normalizeText } from "./chatbotUtils";

const chatbotRules = (
    message,
    movies,
    promotions,
    showtimes,
) => {

    console.log(
        "SHOWTIMES RECEIVED:",
        showtimes.map(x => ({
            maXuatChieu: x.maXuatChieu,
            maPhim: x.maPhim
        }))
    );

    const text =
        normalizeText(message);

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

    const findBestMovieMatch = (
        text,
        movies
    ) => {
        const words =
            text
                .split(" ")
                .filter(
                    word =>
                        word.length > 2
                        &&
                        ![
                            "phim",
                            "rap",
                            "galaxy",
                            "cgv",
                            "lotte",
                            "beta",
                            "xuat",
                            "chieu",
                            "thong",
                            "tin",
                            "chi",
                            "tiet",
                            "hom",
                            "nay",
                            "ngay",
                            "mai",
                            "o",
                            "cac",
                            "nhung",
                            "suat",
                            "xuat",
                            "lich",
                            "tai"
                        ].includes(word)
                );

        let bestMovie = null;
        let bestScore = 0;

        movies.forEach(movie => {

            const movieName =
                normalizeText(
                    movie.tieuDe
                );

            const score =
                words.filter(
                    word =>
                        movieName.includes(
                            word
                        )
                ).length;

            console.log(
                movie.tieuDe,
                score
            );

            if (score > bestScore) {

                bestScore = score;
                bestMovie = movie;

            }

        });

        return bestScore >= 1
            ? bestMovie
            : null;
    };

    const detectMovieInMessage = (
        text,
        movies
    ) => {

        return findBestMovieMatch(
            text,
            movies
        );

    };

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

    const detectDate = (text) => {

        const today = new Date();

        if (text.includes("hom nay")) {
            return today;
        }

        if (text.includes("ngay mai")) {

            const tomorrow =
                new Date(today);

            tomorrow.setDate(
                today.getDate() + 1
            );

            return tomorrow;
        }

        return null;
    };

    const originalText = text;

    const detectedDate =
        detectDate(originalText);

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

    const cinemaAlias = {
        cgv: "cgv",
        lotte: "lotte",
        beta: "beta",
        galaxy: "galaxy"
    };

    let detectedCinema = null;

    console.log(
        "DETECTED CINEMA:",
        detectedCinema
    );

    Object.keys(cinemaAlias).forEach(key => {

        if (text.includes(key)) {
            detectedCinema = key;
        }

    });

    console.log(
        "FOUND CINEMA:",
        detectedCinema
    );

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

    if (
        processedText.includes("dang chieu")
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
        processedText.includes("sap chieu")
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
        processedText.includes("khuyen mai")
        ||
        processedText.includes("giam gia")
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

    if (isBookingIntent) {
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

        console.log(
            "BOOKING MOVIE:",
            detectedMovie?.tieuDe
        );

        if (detectedMovie) {
            movieShowtimes =
                movieShowtimes.filter(
                    showtime =>

                        new Date(
                            showtime.thoiGianKetThuc
                        ) > new Date()
                );

            let movieShowtimes =
                showtimes.filter(
                    showtime =>
                        showtime.maPhim ===
                        detectedMovie.maPhim
                );

            if (detectedDate) {

                movieShowtimes =
                    movieShowtimes.filter(
                        showtime => {

                            const showDate =
                                new Date(
                                    showtime.thoiGianBatDau
                                );

                            return (
                                showDate.toDateString()
                                ===
                                detectedDate.toDateString()
                            );
                        }
                    );
            }

            /* =====================================
                LỌC RẠP
            ===================================== */

            if (detectedCinema) {

                movieShowtimes =
                    movieShowtimes.filter(
                        showtime =>

                            normalizeText(
                                showtime
                                    ?.phong_chieu
                                    ?.rap_chieu
                                    ?.tenRap || ""
                            ).includes(
                                detectedCinema
                            )
                    );
            }

            console.log(
                "BOOKING SHOWTIMES:",
                movieShowtimes
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

        return {
            type: "booking_intent",
            text:
                "🎟️ Bạn muốn đặt vé phim nào?"
        };
    }

    const isMovieInfoIntent =
        originalText.includes("thong tin")
        ||
        originalText.includes("chi tiet");

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
                processedText.includes(
                    movieName
                )
                ||
                movieName.includes(
                    processedText
                )
            );
        });

    if (!foundMovie) {

        foundMovie =
            findBestMovieMatch(
                processedText,
                movies
            );
    }

    console.log(
        "PROCESSED TEXT:",
        processedText
    );

    console.log(
        "FOUND MOVIE:",
        foundMovie?.tieuDe
    );

    if (foundMovie) {
        /* ==========================
       THÔNG TIN PHIM
    ========================== */

        if (isMovieInfoIntent) {

            return {
                type: "movie",
                movie: foundMovie
            };
        }

        let movieShowtimes =
            showtimes.filter(
                showtime =>
                    showtime.maPhim ===
                    foundMovie.maPhim
            );

        console.log("===== CHECK TIME =====");

        movieShowtimes.forEach(showtime => {

            console.log({
                maXuatChieu: showtime.maXuatChieu,
                thoiGianKetThuc: showtime.thoiGianKetThuc,
                endDate: new Date(showtime.thoiGianKetThuc),
                now: new Date(),
                result:
                    new Date(showtime.thoiGianKetThuc)
                    >
                    new Date()
            });

        });

        /* =====================================
            CHỈ LẤY SUẤT CHƯA DIỄN RA
        ===================================== */

        movieShowtimes =
            movieShowtimes.filter(
                showtime =>

                    new Date(
                        showtime.thoiGianKetThuc
                    ) > new Date()
            );

        console.log(
            "MOVIE SHOWTIMES BEFORE CINEMA FILTER:",
            movieShowtimes
        );

        // lọc ngày

        if (detectedDate) {

            movieShowtimes =
                movieShowtimes.filter(
                    showtime => {

                        const showDate =
                            new Date(
                                showtime.thoiGianBatDau
                            );

                        return (
                            showDate.toDateString()
                            ===
                            detectedDate.toDateString()
                        );
                    }
                );
        }

        /* =====================================
            LỌC THEO RẠP
        ===================================== */

        if (detectedCinema) {

            movieShowtimes =
                movieShowtimes.filter(
                    showtime =>

                        normalizeText(
                            showtime
                                ?.phong_chieu
                                ?.rap_chieu
                                ?.tenRap || ""
                        ).includes(
                            detectedCinema
                        )
                );
        }

        console.log("DATE:", detectedDate);

        console.log("CINEMA:", detectedCinema);

        console.log("SHOWTIMES:", movieShowtimes);

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
