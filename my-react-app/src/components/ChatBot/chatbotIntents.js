import { normalizeText } from "./chatbotUtils";

export const detectIntent = (message) => {

    const text = normalizeText(message);

    const intents = {

        showing_movies: [
            "dang chieu",
            "phim dang chieu",
            "co phim gi",
            "hom nay co phim gi",
            "phim nao dang chieu"
        ],

        upcoming_movies: [
            "sap chieu",
            "phim sap chieu",
            "sap ra mat"
        ],

        promotions: [
            "khuyen mai",
            "giam gia",
            "uu dai"
        ],

        booking: [
            "dat ve",
            "mua ve",
            "book ve",
            "giu cho"
        ],

        showtime: [
            "lich chieu",
            "xuat chieu",
            "chieu luc may gio",
            "gio chieu"
        ],

        recommendation: [
            "goi y",
            "de xuat",
            "hay",
            "nen xem",
            "dang xem"
        ]
    };

    for (const [intent, keywords] of Object.entries(intents)) {

        if (
            keywords.some(
                keyword => text.includes(keyword)
            )
        ) {
            return intent;
        }
    }

    return null;
};
