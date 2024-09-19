const express = require("express");
const { logger } = require('../util/logger.js');

const router = express.Router();

const userService = require("../service/userService.js");

router.get("/login", async (req, res) => {
    
})