import { normalizeText } from "./chatbotUtils";

export const isMovieDiscoveryQuery =
    text => {

        text =
            normalizeText(text);

        return (

            text.includes("co phim")

            ||

            text.includes("phim gi")

            ||

            text.includes("phim nao")

            ||

            text.includes("co gi xem")

            ||

            text.includes("xem gi")

            ||

            text.includes("goi y phim")

        );
    };
    