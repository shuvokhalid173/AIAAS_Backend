// express app entry point
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const { auth, health, aiaasService, org } = require('./routes');
const swaggerDocument = YAML.load("./src/docs/openapi.yaml");

const app = express();


// Middleware
const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (curl, mobile apps, etc.)
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin ${origin} not allowed`));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

