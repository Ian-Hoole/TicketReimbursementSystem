const userDao = require("../repository/userDAO.js");
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../util/logger.js');
const bcrypt = require("bcrypt");

const saltRound = 10;

async function createUser(username, password){
    if(username && password){
        const userCheck = await userDao.getUserByUsername(username);
        console.log(userCheck);
        if (!userCheck) {
            const newUser = {
                user_id: uuidv4(),
                username,
                password: await bcrypt.hash(password, saltRound),
                role: "employee"
            }
            logger.info("creating user" + JSON.stringify(newUser));
            const response = await userDao.createUser(newUser);
            logger.info("Service recieved response:" + response)
            if(response === 200){
                return {user_id: newUser.user_id, 
                        username: newUser.username, 
                        role:newUser.role};
            }
        }
    }
    return null;
}

async function getUserByUsernamePassword(username, password){
    if(username && password){
        const user = await userDao.getUserByUsername(username);
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                return { user_id: user.user_id, username: user.username, role: user.role };
            }
        }
    }
    return null;
}



module.exports = {
    createUser,
    getUserByUsernamePassword,
}