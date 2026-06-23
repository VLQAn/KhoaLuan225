import { normalizeText } from "./chatbotUtils";

export const shouldUseAIRecommendation = (text) => {

    const normalized =
        normalizeText(text);

    const keywords = [

        "tre em",
        "cho be",
        "gia dinh",
        "nguoi yeu",    
        "cap doi",
        "hen ho",

        "tuong tu",
        "giong",

        "goi y",
        "de xuat",

        "phu hop cho tre",
        "phu hop cho be",

        "phu hop cho cap doi",
        "phu hop cho nguoi tre",

        "phu hop cho hoc sinh",
        "phu hop cho học sinh cap 2",
        "phù hop cho hoc sinh cap 3",
        "phu hop voi hoc sinh",
        "phu hop voi học sinh cap 2",
        "phù hop voi hoc sinh cap 3",

        "phu hop voi nguoi trung nien",
        "phu hop cho nguoi gia",
        "phu hop cho nguoi lon tuoi",
        "phu hop voi nguoi lon tuoi", 

        // so sánh phim
        "so sanh",
        "khac gi nhau"
    ];

    if (
        keywords.some(
            keyword => normalized.includes(keyword)
        )
    ) {
        return true;
    }

    // các cấu trúc câu so sánh không có sẵn từ khóa cố định
    const comparisonPatterns = [
        /giua\s+.+\s+(va|voi)\s+.+/,        // "giữa X và/với Y..."
        /\bhay\b.+\bhon\b/,                  // "X hay Y hơn"
        /nen\s+(xem|chon)\s+.+\s+hay\s+.+/   // "nên xem/chọn X hay Y"
    ];

    return comparisonPatterns.some(
        pattern => pattern.test(normalized)
    );
};
