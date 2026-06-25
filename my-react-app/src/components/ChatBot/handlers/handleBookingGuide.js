export const handleBookingGuide =
    (
        context
    ) => {

        const {
            processedText,
            originalText,
            movies
        } = context;

        if (
            processedText &&
            processedText.includes("dat ve")
        ) {

            return {

                type: "text",

                text:
                    "Bạn có thể đặt vé theo các bước:\n\n"
                    +
                    "1. Chọn phim\n"
                    +
                    "2. Chọn suất chiếu\n"
                    +
                    "3. Chọn ghế\n"
                    +
                    "4. Thanh toán"

            };

        }

        return null;

    };
