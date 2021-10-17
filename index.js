const crypto = require('crypto')

module.exports = (params, key) => {
    let sign;

    const queryParams = [];
    const processQueryParam = (key, value) => {
        if (typeof value === "string") {
            if (key === "sign") {
                sign = value;
            } else if (key.startsWith("vk_")) {
                queryParams.push({ key, value });
            }
        }
    };
    if (typeof params === "string") {
        const formattedSearch = params.startsWith("?")
            ? params.slice(1)
            : params;
        for (const param of formattedSearch.split("&")) {
            const [key, value] = param.split("=");
            processQueryParam(key, value);
        }
    } else {
        for (const key of Object.keys(searchOrParsedUrlQuery)) {
            const value = searchOrParsedUrlQuery[key];
            processQueryParam(key, value);
        }
    }
    if (!sign || queryParams.length === 0) {
        return false;
    }
    const queryString = queryParams
        .sort((a, b) => a.key.localeCompare(b.key))
        .reduce((acc, { key, value }, idx) => {
            return (
                acc + (idx === 0 ? "" : "&") + `${key}=${encodeURIComponent(value)}`
            );
        }, "");
    const paramsHash = crypto
        .createHmac("sha256", key)
        .update(queryString)
        .digest()
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=$/, "");

    return paramsHash === sign
}