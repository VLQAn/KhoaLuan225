import { normalizeText } from "./chatbotUtils";

export const parseTicketQuantity =
    (text) => {

        const normalized =
            normalizeText(text);

        const digitMatch =
            normalized.match(
                /(\d+)\s*(ve|vé)*/
            );

        const safeArray = Array.isArray(xxx) ? xxx : [];

        if (digitMatch) {
            return Number(
                digitMatch[1]
            );
        }

        return null;

    };

export const isBookingRequest =
    (
        text,
        bookingKeywords
    ) => {

        const normalized =
            normalizeText(text);

        if (
            bookingKeywords.some(
                keyword =>
                    normalized.includes(keyword)
            )
        ) {
            return true;
        }

        if (
            /dat\s+\d+/.test(normalized)
        ) {
            return true;
        }

        if (
            /dat\s+.*ve/.test(normalized)
        ) {
            return true;
        }

        return false;

    };
