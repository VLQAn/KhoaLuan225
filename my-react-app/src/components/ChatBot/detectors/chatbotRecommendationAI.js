import { normalizeText }
from "../helpers/chatbotUtils";

export const shouldUseAIRecommendation = (text) => {

    const normalized = normalizeText(text);

    const keywords = [
        "tre em", "cho be", "gia dinh",
        "nguoi yeu", "cap doi", "hen ho",
        "goi y", "de xuat",
        "tuong tu", "giong",
        "phu hop cho tre", "phu hop cho be",
        "phu hop cho cap doi", "phu hop cho nguoi lon",
        "so sanh", "khac gi nhau",

        // top movies / rating
        "hay nhat", "danh gia cao", "diem cao",
        "dinh nhat", "noi bat nhat", "duoc yeu thich nhat"
    ];

    if (keywords.some(keyword => normalized.includes(keyword))) {
        return true;
    }

    const comparisonPatterns = [
        /giua\s+.+\s+(va|voi)\s+.+/,
        /\bhay\b.+\bhon\b/,
        /nen\s+(xem|chon)\s+.+\s+hay\s+.+/,

        // "top 5 phim", "top phim", "5 phim hay nhat"...
        /\btop\s*\d*\s*phim\b/,

        // "phim trên 8 điểm", "phim từ 7 điểm trở lên", "rating trên 9"
        /(tren|tu)\s*\d+(\.\d+)?\s*diem/,
        /rating\s*(tren|tu)?\s*\d+/
    ];

    return comparisonPatterns.some(pattern => pattern.test(normalized));
};
