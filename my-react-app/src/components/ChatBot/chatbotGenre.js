import { normalizeText } from "./chatbotUtils";

export const detectGenre = (text) => {

    const normalized =
        normalizeText(text);

    const genres = {
        "hanh dong": "Hành động",
        "kinh di": "Kinh dị",
        "tinh cam": "Tình cảm",
        "hai": "Hài",
        "hoat hinh": "Hoạt hình",
        "gia dinh": "Gia đình",
        "vien tuong": "Viễn tưởng",
        "phieu luu": "Phiêu lưu",
        "anime": "Anime"
    };

    for (const key in genres) {

        if (normalized.includes(key)) {

            return genres[key];
        }
    }

    return null;
};
