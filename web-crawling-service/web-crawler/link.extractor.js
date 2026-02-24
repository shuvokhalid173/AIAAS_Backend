const { URL } = require("url");

function extractInternalLinks(html, baseUrl, $) {
    const links = new Set();
    const base = new URL(baseUrl);

    $("a[href]").each((_, el) => {
        try {
            const href = $(el).attr("href");
            if (!href) return;

            const absolute = new URL(href, base.origin);

            // only same-origin links
            if (absolute.origin === base.origin) {
                links.add(absolute.href.split("#")[0]);
            }
        } catch (_) { }
    });

    return [...links];
}

module.exports = { extractInternalLinks };
