const express = require("express");
const crawlRoute = require("./routes/crawl.route");

const app = express();
app.use(express.json());

app.use("/api", crawlRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
    console.log(`Web crawling service running on ${PORT}`)
);
