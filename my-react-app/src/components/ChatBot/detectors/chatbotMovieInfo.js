import { normalizeText } from "../helpers/chatbotUtils";

export const detectMovieInfo = (message) => {

    const text = normalizeText(message);

    const infoKeywords = {

        duration: [
            "thoi luong",
            "bao lau",
            "dai bao lau",
            "dai khong",
            "may phut",
            "bao nhieu phut",
            "keo dai bao lau",
            "keo dai may phut",
            "thoi gian chieu"
        ],

        director: [
            "dao dien",
            "ai dao dien"
        ],

        actor: [
            "dien vien",
            "co ai dong"
        ],

        age: [
            "do tuoi",
            "gioi han tuoi",
            "bao nhieu tuoi"
        ],

        release: [
            "ngay cong chieu",
            "ra mat",
            "khoi chieu"
        ],

        description: [
            "noi dung",
            "tom tat",
            "gioi thieu",
            "ke ve",
            "noi gi",
            "phim ve gi",
            "noi dung phim"
        ],

        rating: [
            "danh gia",
            "duoc danh gia bao nhieu",
            "bao nhieu sao",
            "diem danh gia",
            "rating",
            "score",
            "cham diem",
            "muc diem"
        ]

    };

    for (const [type, keywords] of Object.entries(infoKeywords)) {

        if (keywords.some(keyword => text.includes(keyword))) {
            return type;
        }

    }

    return null;
};
