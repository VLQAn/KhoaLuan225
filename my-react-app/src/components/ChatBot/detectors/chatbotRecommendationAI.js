import { normalizeText }
from "../helpers/chatbotUtils";

export const shouldUseAIRecommendation = (
    text
) => {

    const normalized =
        normalizeText(text);

    const keywords = [

        "tre em",
        "cho be",
        "gia dinh",

        "nguoi yeu",
        "cap doi",
        "hen ho",

        "goi y",
        "de xuat",

        "tuong tu",
        "giong",

        "phu hop cho tre",
        "phu hop cho be",

        "phu hop cho cap doi",
        "phu hop cho nguoi lon",

        "so sanh",
        "khac gi nhau"
    ];

    if (
        keywords.some(
            keyword =>
                normalized.includes(keyword)
        )
    ) {
        return true;
    }

    const comparisonPatterns = [

        /giua\s+.+\s+(va|voi)\s+.+/,

        /\bhay\b.+\bhon\b/,

        /nen\s+(xem|chon)\s+.+\s+hay\s+.+/
    ];

    return comparisonPatterns.some(
        pattern =>
            pattern.test(normalized)
    );
};
