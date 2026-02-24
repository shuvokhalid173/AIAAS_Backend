const express = require("express");
const { crawlWebsite } = require("../web-crawler/crawler");

const router = express.Router();

router.post("/crawl", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const text = await crawlWebsite(url);

        res.json({
            success: true,
            text,
        });
    } catch (err) {
        res.status(500).json({ error: "Crawling failed" });
    }
});

module.exports = router;
