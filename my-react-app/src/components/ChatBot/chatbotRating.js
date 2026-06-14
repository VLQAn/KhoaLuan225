import { normalizeText } from "./chatbotUtils";

export const detectRatingFilter = text => {

    text =
        normalizeText(text);

    const match =
        text.match(
            /(?:tren|tu)\s*(\d+(?:\.\d+)?)/
        );

    if (!match) {
        return null;
    }

    return Number(match[1]);
};
