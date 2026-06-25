import { normalizeText } from "../helpers/chatbotUtils";

export const detectDate = (message) => {

    const text =
        normalizeText(message);

    const today =
        new Date();

    if (
        text.includes("ngay mai") ||
        text.includes("mai")
    ) {

        const tomorrow = new Date();

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        return {
            type: "single",
            date: tomorrow
        };
    }

    if (
        text.includes("hom nay") ||
        text.includes("toi nay") ||
        text.includes("chieu nay")
    ) {

        return {
            type: "single",
            date: today
        };

    }

    if (
        text.includes("cuoi tuan")
    ) {

        return {
            type: "weekend"
        };

    }

    const weekdays = {
        "thu 2": 1,
        "thu 3": 2,
        "thu 4": 3,
        "thu 5": 4,
        "thu 6": 5,
        "thu 7": 6,
        "chu nhat": 0
    };

    for (
        const [keyword, day]
        of Object.entries(weekdays)
    ) {

        if (
            text.includes(keyword)
        ) {

            const result =
                new Date(today);

            let diff =
                day -
                today.getDay();

            if (diff < 0)
                diff += 7;

            result.setDate(
                result.getDate() + diff
            );

            return {
                type: "single",
                date: result
            };

        }

    }

    let match =
        text.match(
            /\b(\d{1,2})\/(\d{1,2})\b/
        );

    if (match) {

        return {
            type: "single",
            date: new Date(
                today.getFullYear(),
                Number(match[2]) - 1,
                Number(match[1])
            )
        };

    }

    const longDateMatch =
        text.match(
            /ngay\s*(\d{1,2})\s*thang\s*(\d{1,2})/
        );

    if (longDateMatch) {

        return {
            type: "single",
            date: new Date(
                today.getFullYear(),
                Number(longDateMatch[2]) - 1,
                Number(longDateMatch[1])
            )
        };

    }

    return null;

};
