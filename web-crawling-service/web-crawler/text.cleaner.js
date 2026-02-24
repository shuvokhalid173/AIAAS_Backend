function cleanText(text) {
    return text
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

module.exports = { cleanText };
