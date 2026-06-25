import { normalizeText }
from "../helpers/chatbotUtils";

export const isMovieDiscoveryQuery = (
    text
) => {

    const normalized =
        normalizeText(text);

    return (

        normalized.includes("co phim")

        ||

        normalized.includes("phim nao")

        ||

        normalized.includes("co gi xem")

        ||

        normalized.includes("xem gi")

        ||

        normalized.includes("goi y phim")

        ||

        normalized.includes("phim hay")

        ||

        normalized.includes("nen xem phim")

        ||

        normalized.includes("de xuat phim")

    );

};
