"use strict";
exports.__esModule = true;
exports.tenantRateLimiter = void 0;
var express_1 = require("express");
var post_1 = require("./routes/post");
var tenant_1 = require("./routes/tenant");
var express_rate_limit_1 = require("express-rate-limit");
var tenantResolver_1 = require("./middleware/tenantResolver");
var tenantContext_1 = require("./middleware/tenantContext"); // Ensure this path is correct or create the module if it doesn't exist
var app = (0, express_1["default"])();
app.use(express_1["default"].json());
exports.tenantRateLimiter = (0, express_rate_limit_1["default"])({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this tenant'
});
// Tenant Resolver for header based tenant resolution 
app.use(tenantResolver_1["default"]);
// Middleware to set Prisma context
app.use(tenantContext_1["default"]);
// Rate Limiter
app.use(exports.tenantRateLimiter);
// Routes
app.use('/posts', post_1["default"]);
app.use('/tenants', tenant_1["default"]);
// Error handler 
app.use(function (err, req, res) {
    res.status(500).json({ error: 'Internal server error' });
});
var port = process.env.PORT || 3000;
app.listen(port, function () { return console.log("Sever is running on port ".concat(port, ", Better catch it!")); });
