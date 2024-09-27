const express = require("express");
const { logger } = require('../util/logger.js');
const userService = require("../service/userService.js");
const {getSecretKey} = require("../../constants.js");
const router = express.Router();
const jwt = require("jsonwebtoken");

const secretKey = getSecretKey();


router.post("/login", async (req, res) => {
    logger.info("GET /accounts/ path entered " + req.body.username + req.body.password);
    let token = null;
    if (req.body.username && req.body.password){
        const account = await userService.getUserByUsernamePassword(req.body.username, req.body.password);
        if (account) {
            token = jwt.sign({
                user_id: account.user_id,
                username: account.username,
                role: account.role
            }, secretKey,
                {
                    expiresIn: "1d"
                });
            
        }
    }
    if(token){
        res.status(200).json({ token });
    }
    else{
        res.status(400).json({message: "no account found"})
    }
})

router.post("/register", async (req, res) => {
    logger.info("POST /register path entered");
    logger.info(req.body.username + req.body.password + req.body.role)
    let account =  null;
    if (req.body.username && req.body.password){
        account = await userService.createUser(req.body.username, req.body.password, req.body.role);
    }
    if(account){
        res.status(201).json({ account });
    }
    else {
        res.status(400).json({ message: "error creating account" })
    }
})

module.exports = router;