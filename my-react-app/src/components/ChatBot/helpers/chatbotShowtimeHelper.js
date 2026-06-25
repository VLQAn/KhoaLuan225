import { normalizeText } from "./chatbotUtils";

/* =====================================
   LOẠI BỎ TỪ KHÓA SUẤT CHIẾU
===================================== */
export const removeShowtimeKeywords = (
    text
) => {

    return normalizeText(text)

        .replace(/hom nay/g, "")
        .replace(/ngay mai/g, "")
        .replace(/thu\s*[2-7]/g, "")
        .replace(/chu nhat/g, "")
        .replace(/cuoi tuan/g, "")

        .replace(/galaxy/g, "")
        .replace(/lotte/g, "")
        .replace(/cgv/g, "")

        .replace(/suat chieu/g, "")

        .replace(/\s+/g, " ")
        .trim();

};

/* =====================================
   CHỈ LẤY SUẤT CÒN HIỆU LỰC
===================================== */
export const filterValidShowtimes = (
    showtimes
) => {

    return showtimes.filter(
        showtime =>
            new Date(
                showtime.thoiGianKetThuc
            ) > new Date()
    );

};

/* =====================================
   LỌC SUẤT CHIẾU THEO:
   - ngày
   - buổi
   - rạp
===================================== */
export const filterShowtimes = (
    showtimes,
    detectedDate,
    detectedTimePeriod,
    detectedCinema
) => {

    let result =
        filterValidShowtimes(showtimes);

    /* ===== DATE ===== */

    if (detectedDate) {

        result =
            result.filter(showtime => {

                const showDate =
                    new Date(
                        showtime.thoiGianBatDau
                    );

                if (
                    detectedDate.type ===
                    "weekend"
                ) {

                    return (
                        showDate.getDay() === 6 ||
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

    /* ===== TIME ===== */

    if (detectedTimePeriod) {

        result =
            result.filter(showtime => {

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
                            hour >= 12 &&
                            hour < 18
                        );

                    case "evening":
                        return (
                            hour >= 18
                        );

                    default:
                        return true;

                }

            });

    }

    /* ===== CINEMA ===== */

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

                return cinemaName.includes(
                    detectedCinema.value
                );

            });

    }

    return result;

};
