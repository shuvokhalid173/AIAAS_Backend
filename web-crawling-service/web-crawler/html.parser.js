function extractReadableText($) {
    /*
      Remove noise:
      - scripts
      - styles
      - nav
      - footer
    */
    $("script, style, nav, footer, noscript").remove();

    const texts = [];

    $("h1, h2, h3, h4, h5, h6, p, li").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 0) {
            texts.push(text);
        }
    });

    // Preserve sequence
    return texts.join("\n");
}

module.exports = { extractReadableText };
