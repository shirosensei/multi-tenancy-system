"use strict";
exports.__esModule = true;
var express_1 = require("express");
var tenantController_1 = require("../controllers/tenantController");
var router = (0, express_1.Router)();
// POST /tenants
router.post('/', tenantController_1.createTenant);
exports["default"] = router;
