import { normalizeText } from "./chatbotUtils";

export const filterShowtimes = (
    showtimes,
    movie,
    detectedDate,
    detectedCinema
) => {

    let result =
        showtimes.filter(
            showtime =>
                showtime.maPhim ===
                movie.maPhim
        );

    result =
        result.filter(
            showtime =>
                new Date(
                    showtime.thoiGianKetThuc
                ) > new Date()
        );

    if (detectedDate) {

        result =
            result.filter(showtime => {

                const showDate =
                    new Date(
                        showtime.thoiGianBatDau
                    );

                if (
                    detectedDate.type
                    ===
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

            });

    }

    if (detectedCinema) {

        result =
            result.filter(showtime => {

                const cinemaName =
                    normalizeText(
                        showtime
                            ?.phong_chieu
                            ?.rap_chieu
                            ?.tenRap || ""
                    );

                if (
                    detectedCinema.type === "brand"
                ) {

                    return cinemaName.includes(
                        detectedCinema.value
                    );

                }

                return (
                    cinemaName ===
                    detectedCinema.value
                );

            });

    }

    result.sort(
        (a, b) =>
            new Date(
                a.thoiGianBatDau
            )
            -
            new Date(
                b.thoiGianBatDau
            )
    );

    return result;

};
