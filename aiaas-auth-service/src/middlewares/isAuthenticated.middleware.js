const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require('../configs/env.config');


function isAuthenticated(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Access token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, jwtConfig.secret);

    // Attach auth context
    req.auth = {
      userId: decoded.sub,
      orgId: decoded.oid ? decoded.oid : null,
      sessionId: decoded.sid
    };

    next();
  } catch (err) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Invalid or expired token"
    });
  }
}

module.exports = isAuthenticated;