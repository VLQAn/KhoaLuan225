import { normalizeText } from "./chatbotUtils";

export const shouldUseAIRecommendation = (text) => {

    const normalized =
        normalizeText(text);

    const keywords = [

        "tre em",
        "cho be",
        "gia dinh",
        "ngoi yeu",
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
        "phu hop voi ngoi lon tuoi"

    ];

    return keywords.some(
        keyword =>
            normalized.includes(keyword)
    );
};
