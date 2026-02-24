// express app entry point
const express = require('express');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const { auth, health, aiaasService, org } = require('./routes');
const swaggerDocument = YAML.load("./src/docs/openapi.yaml");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/openapi.json", (req, res) => {
    res.json(swaggerDocument);
});

app.use('/api/health', health);
app.use('/api', auth);
app.use('/api', aiaasService);
app.use('/api', org);

module.exports = app;

