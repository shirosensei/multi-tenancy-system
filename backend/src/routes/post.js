"use strict";
exports.__esModule = true;
var express_1 = require("express");
var postController_1 = require("../controllers/postController");
var router = (0, express_1.Router)();
// POST /posts
router.post('/', postController_1.createPost);
// GET /posts
router.get('/', postController_1.getPosts);
exports["default"] = router;
