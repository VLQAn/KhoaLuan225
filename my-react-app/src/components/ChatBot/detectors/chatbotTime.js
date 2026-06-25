import { normalizeText }
    from "../helpers/chatbotUtils";

export const detectTimePeriod = (
    text
) => {
    console.log("RAW TIME TEXT:", text);

    text =
        normalizeText(text)
            .replace(/suat chieu/g, "");

    console.log("NORMALIZED TIME TEXT:", text);


    if (/\bsang\b/.test(text)) {
        return "morning";
    }

    if (/\btrua\b/.test(text)) {
        return "noon";
    }

    if (/\bchieu\b/.test(text)) {
        return "afternoon";
    }

    if (/\btoi\b/.test(text)) {
        return "evening";
    }

    return null;
};
