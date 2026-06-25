import {
    filterShowtimes
} from "../helpers/chatbotShowtimeHelper";

export const handleMovieShowtime = (
    movie,
    showtimes,
    detectedDate,
    detectedTimePeriod,
    detectedCinema
) => {

    if (!movie)
        return null;

    const movieShowtimes =
        showtimes.filter(
            showtime =>
                showtime.maPhim === movie.maPhim
        );

    if (!movieShowtimes.length)
        return null;

    if (
        !detectedDate &&
        !detectedTimePeriod &&
        !detectedCinema
    ) {
        return null;
    }

    const matchedShowtimes =
        filterShowtimes(
            movieShowtimes,
            detectedDate,
            detectedTimePeriod,
            detectedCinema
        );

    if (!matchedShowtimes.length) {

        let message =
            `😢 Hiện không có suất chiếu cho phim "${movie.tieuDe}"`;

        if (detectedDate) {

            if (detectedDate.type === "weekend") {

                message += " vào cuối tuần";

            } else {

                message +=
                    ` vào ngày ${detectedDate.date.toLocaleDateString("vi-VN")}`;
            }
        }

        if (detectedTimePeriod) {

            const labels = {
                morning: " buổi sáng",
                afternoon: " buổi chiều",
                evening: " buổi tối"
            };

            message += labels[detectedTimePeriod] || "";
        }

        if (detectedCinema) {

            message +=
                ` tại ${detectedCinema.value}`;
        }

        message += ".";

        return {
            type: "text",
            text: message
        };
    }

    let title =
        `🎬 ${movie.tieuDe} có các suất chiếu`;

    if (detectedDate) {

        if (
            detectedDate.type === "weekend"
        ) {

            title += " cuối tuần";

        } else {

            title +=
                ` ngày ${detectedDate.date.toLocaleDateString("vi-VN")}`;
        }
    }

    if (detectedTimePeriod) {

        const labels = {
            morning: " buổi sáng",
            afternoon: " buổi chiều",
            evening: " buổi tối"
        };

        title +=
            labels[detectedTimePeriod] || "";
    }

    if (detectedCinema) {

        title +=
            ` tại ${detectedCinema.value}`;
    }

    title += ":";

    return {
        type: "showtime_query",
        text: title,
        movie,
        showtimes: matchedShowtimes.slice(0, 5),
        allShowtimes: matchedShowtimes,
        expanded: false,
        date: detectedDate?.date ?? null
    };
};
