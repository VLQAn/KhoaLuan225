import { normalizeText }
from "./chatbotUtils";

export const detectTimePeriod = (
    text
) => {

    text =
        normalizeText(text);

    if (
        text.includes("sang")
    ) {
        return "morning";
    }

    if (
        text.includes("trua")
    ) {
        return "noon";
    }

    if (
        text.includes("chieu")
    ) {
        return "afternoon";
    }

    if (
        text.includes("toi")
    ) {
        return "evening";
    }

    return null;
};
