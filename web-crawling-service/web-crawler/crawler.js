const axios = require("axios");
const cheerio = require("cheerio");
const { extractInternalLinks } = require("./link.extractor");
const { extractReadableText } = require("./html.parser");
const { cleanText } = require("./text.cleaner");
const { MAX_PAGES, REQUEST_TIMEOUT } = require("../config/crawler.config");

async function crawlWebsite(startUrl) {
    const visited = new Set();
    const queue = [startUrl];
    let finalText = "";

    while (queue.length > 0 && visited.size < MAX_PAGES) {
        const url = queue.shift();
        if (visited.has(url)) continue;

        visited.add(url);

        try {
            const response = await axios.get(url, {
                timeout: REQUEST_TIMEOUT,
            });

            const $ = cheerio.load(response.data);

            // Extract page text
            const pageText = extractReadableText($);
            finalText += `\n\n### PAGE: ${url}\n\n${pageText}`;

            // Discover new links
            const links = extractInternalLinks(response.data, url, $);
            for (const link of links) {
                if (!visited.has(link)) queue.push(link);
            }
        } catch (err) {
            // skip failed pages
            continue;
        }
    }

    return cleanText(finalText);
}

module.exports = { crawlWebsite };
