const userDao = require("../repository/userDAO.js");
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../util/logger.js');
const bcrypt = require("bcrypt");

const saltRound = 10;

async function createUser(username, password){
    if(username && password){
        const userCheck = await userDao.getUserByUsername(username);
        if (!userCheck) {
            const newUser = {
                user_id: uuidv4(),
                username,
                password: await bcrypt.hash(password, saltRound),
                role: "employee"
            }
            logger.info("creating user" + JSON.stringify(newUser));
            return await userDao.createUser(newUser);
        }
    }
    return null;
}

async function getUserByUsernamePassword(username, password){
    const user = await userDao.getUserByUsername(username);
    if (await bcrypt.compare(password, user.password)){
        return { user_id: user.user_id, username: user.username, role: user.role };
    }
    return null;
}

async function getUserById(userId){
    if(userId){
        const user = await userDao.getUserById(userId);
        return { user_id: user.user_id, username: user.username, role: user.role }; 
    }
    return null;
}

module.exports = {
    createUser,
    getUserByUsernamePassword,
    getUserById,

}