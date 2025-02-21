"use strict";
exports.__esModule = true;
var prisma_1 = require("../utils/prisma");
var tenantContext = function (req, res, next) {
    var _a;
    var tenantId = (_a = req.tenant) === null || _a === void 0 ? void 0 : _a.id; // Assuming tenant is attached to request
    if (!tenantId) {
        res.status(400).json({ error: 'Tenant not resolved' });
        return;
    }
    // Attach tenantId to Prisma context
    prisma_1["default"].$tenantId = tenantId;
    next();
};
exports["default"] = tenantContext;
