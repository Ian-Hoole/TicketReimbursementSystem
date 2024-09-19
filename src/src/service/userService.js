const userDao = require("../repository/userDAO.js");
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../util/logger.js');


async function createUser(username, password){
    if(username && password){
        if (!userDao.getUserByUsername(username).Items) {
            const newUser = {
                user_id: uuidv4(),
                username,
                password,
                role: "employee"
            }
            return userDao.createUser(newUser);
        }
    }
    return null;
}

async function getUserByUsernamePassword(username, password){
    if(username && password){
        return userDao.getUserByUsernamePassword(username, password);
    }
    return null;
}

async function getUserById(userId){
    if(userId){
        return userDao.getUserById(userId);
    }
    return null;
}

module.exports = {
    createUser,
    getUserByUsernamePassword,
    getUserById,

}