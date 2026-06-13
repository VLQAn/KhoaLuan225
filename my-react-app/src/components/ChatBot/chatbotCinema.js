import { normalizeText } from "./chatbotUtils";

export const detectCinema = (
    message,
    showtimes
) => {

    const text =
        normalizeText(message);

    const allCinemas = [];

    showtimes.forEach(showtime => {

        const cinema =
            normalizeText(
                showtime?.phong_chieu?.rap_chieu?.tenRap || ""
            );

        if (
            cinema &&
            !allCinemas.includes(cinema)
        ) {
            allCinemas.push(cinema);
        }

    });

    /* =====================
       TÌM RẠP CỤ THỂ
    ===================== */

    let bestMatch = null;
    let bestScore = 0;

    allCinemas.forEach(cinema => {

        const score =
            cinema
                .split(" ")
                .filter(
                    word =>
                        text.includes(word)
                )
                .length;

        if (score > bestScore) {

            bestScore = score;
            bestMatch = cinema;

        }

    });

    if (bestScore >= 2) {

        return {
            type: "cinema",
            value: bestMatch
        };

    }

    /* =====================
       TÌM THƯƠNG HIỆU
    ===================== */

    const brands = [
        "galaxy",
        "cgv",
        "lotte",
        "beta"
    ];

    const brand =
        brands.find(
            item =>
                text.includes(item)
        );

    if (brand) {

        return {
            type: "brand",
            value: brand
        };

    }

    return null;

};
