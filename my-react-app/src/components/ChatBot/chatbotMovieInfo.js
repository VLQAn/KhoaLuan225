import {
    normalizeText
}
from "./chatbotUtils";

export const detectMovieInfoIntent =
    text => {

        text =
            normalizeText(text);

        if (
            text.includes(
                "thoi luong"
            )
            ||
            text.includes(
                "bao lau"
            )
            ||
            text.includes(
                "bao nhieu phut"
            )
        ) {
            return "duration";
        }

        if (
            text.includes(
                "dao dien"
            )
        ) {
            return "director";
        }

        if (
            text.includes(
                "dien vien"
            )
            ||
            text.includes(
                "ai dong"
            )
        ) {
            return "cast";
        }

        if (
            text.includes(
                "noi dung"
            )
            ||
            text.includes(
                "mo ta"
            )
        ) {
            return "description";
        }

        if (
            text.includes(
                "danh gia"
            )
            ||
            text.includes(
                "rating"
            )
        ) {
            return "rating";
        }

        return null;
    };
    