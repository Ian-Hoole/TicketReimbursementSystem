const express = require("express");
const { logger } = require('../util/logger.js');
const userService = require("../service/userService.js");
const getSecretKey = require("../../secretKey.js");
const router = express.Router();
const jwt = require("jsonwebtoken");

const secretKey = getSecretKey();


router.get("/accounts/:username/:password", async (req, res) => {
    logger.info("GET /accounts/:username/:password path entered");
    const account = await userService.getUserByUsernamePassword(req.params.username, req.params.password);
    if(account){
        const token = jwt.sign({
            user_id: account.user_id,
            username: account.username,
            role: account.role
        }, secretKey, 
        {
            expiresIn: "1d"
        });
        res.status(200).json({token});
    }
    else{
        res.status(400).json({message: "no account found"})
    }
})

router.post("/accounts/:username/:password", async (req, res) => {
    logger.info("POST /accounts/:username/:password path entered");
    const account = await userService.createUser(req.params.username, req.params.password);
    if (account) {
        res.status(200).json({ account });
    }
    else {
        res.status(400).json({ message: "error creating account" })
    }
})

module.exports = router;