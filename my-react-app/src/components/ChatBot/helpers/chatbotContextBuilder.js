import { normalizeText } from "./chatbotUtils";

import { detectIntent }
from "../detectors/chatbotIntents";

import { detectDate }
from "../detectors/chatbotDate";

import { detectCinema }
from "../detectors/chatbotCinema";

import { detectTimePeriod }
from "../detectors/chatbotTime";

import { detectGenre }
from "../detectors/chatbotGenre";

import { isMovieDiscoveryQuery }
from "../detectors/chatbotMovieDiscovery";

import { shouldUseAIRecommendation }
from "../detectors/chatbotRecommendationAI";

import { findMovieByKeyword }
from "./chatbotMovieHelper";

export const buildContext = (
    message,
    movies,
    promotions,
    showtimes,
    cinemas
) => {

    const text =
        normalizeText(message);

    const intent =
        detectIntent(text);

    const detectedDate =
        detectDate(text);

    const detectedCinema =
        detectCinema(
            text,
            showtimes
        );

    const detectedTimePeriod =
        detectTimePeriod(text);

    const detectedGenre =
        detectGenre(text);

    const movie =
        findMovieByKeyword(
            text,
            movies
        );

    const isMovieDiscovery =
        isMovieDiscoveryQuery(
            text
        );

    const shouldUseAI =
        shouldUseAIRecommendation(
            text
        );

    return {

        message,

        text,

        movies,

        promotions,

        showtimes,

        cinemas,

        intent,

        movie,

        detectedDate,

        detectedCinema,

        detectedTimePeriod,

        detectedGenre,

        isMovieDiscovery,

        shouldUseAI
    };
};
