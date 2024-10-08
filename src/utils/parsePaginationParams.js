const parseInteger = (value, defaultValue) => {
    if (typeof value !== "string") return defaultValue;
    const parsedValue = parseInt(value, 10);
    if (Number.isNaN(parsedValue) || parsedValue <= 0) return defaultValue;

    return parsedValue;
};

const parsePaginationParams = ({ perPage, page }) => {
    const parsedPerPage = parseInteger(perPage, 10);
    const parsedPage = parseInteger(page, 1);

    return {
        perPage: parsedPerPage,
        page: parsedPage,

    };
};

export default parsePaginationParams;
