import {
    filterShowtimes
} from "../helpers/chatbotShowtimeHelper";

import {
    normalizeText
} from "../helpers/chatbotUtils";

export const handleMovieFilter = (
    movies,
    showtimes,
    detectedDate,
    detectedTimePeriod,
    detectedCinema,
    detectedGenre
) => {

    let filteredShowtimes =
        filterShowtimes(
            showtimes,
            detectedDate,
            detectedTimePeriod,
            detectedCinema
        );

    let matchedMovies =
        movies.filter(movie =>

            filteredShowtimes.some(
                showtime =>
                    showtime.maPhim ===
                    movie.maPhim
            )
        );

    if (detectedGenre) {

        matchedMovies =
            matchedMovies.filter(
                movie =>

                    movie.theLoai?.some(
                        genre =>

                            normalizeText(
                                genre.tenTheLoai
                            ) ===

                            normalizeText(
                                detectedGenre
                            )
                    )
            );
    }

    matchedMovies =
        matchedMovies.filter(
            movie =>
                movie.trangThai ===
                "dang_chieu"
        );

    if (
        matchedMovies.length === 0
    ) {

        return {

            type: "text",

            text:
                "🎬 Không tìm thấy phim phù hợp với yêu cầu của bạn."
        };
    }

    let title =
        detectedGenre
            ? `🎬 Phim ${detectedGenre}`
            : "🎬 Phim phù hợp";

    if (detectedTimePeriod) {

        const labels = {
            morning: "buổi sáng",
            afternoon: "buổi chiều",
            evening: "buổi tối"
        };

        title +=
            ` ${labels[detectedTimePeriod]}`;
    }

    if (detectedCinema) {

        title +=
            ` tại ${detectedCinema.value}`;
    }

    return {

        type: "movie_list",

        title,

        movies:
            matchedMovies.slice(0, 10)
    };
};
