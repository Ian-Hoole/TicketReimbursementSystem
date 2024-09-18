const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient,
        GetCommand,
        PutCommand,
        ScanCommand,
        QueryCommand,
        UpdateCommand,
        DeleteCommand
    } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require('uuid');
const { logger } = require('./logger.js');

const client = new DynamoDBClient({ region: "us-west-1" }); // replace with your region

const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "TicketSystemUserTable"

async function getUserList() {
    const scanCommand = new ScanCommand({
        TableName
    });
    try {
        const data = await documentClient.send(scanCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data;
    } catch (err) {
        logger.error(err);
    }
}

async function createUser(username, password) {
    const newUser = {
        user_id: uuidv4(),
        username,
        password,
        role: "employee"
    }
    const putCommand = new PutCommand({
        TableName,
        item: newUser
    });
    try {
        const data = await documentClient.send(putCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data;
    } catch (err) {
        logger.error(err);
    }
}

async function getUserByUsernamePassword(username, password) {
    const scanCommand = ScanCommand({
        TableName,
        FilterExpression: "#u = :u AND #p = :p",
        ExpressionAttributeNames: {
            "#u": "username",
            "#p": "password"
        },
        ExpressionAttributeValues:{
            ":u": {S: username},
            ":p": {S: password}
        }
    });
    try{
        const data = await documentClient.send(scanCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data;
    } catch (err) {
        logger.error(err);
    }
}

async function getUserById(userId) {
    const getCommand = new GetCommand({
        TableName,
        Key: {user_id:userId}
    });
    try{
        const data = await documentClient.send(getCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data;
    } catch (err) {
        logger.error(err);
    }
}

module.exports = {
    getUserList,
    createUser,
    getUserByUsernamePassword,
    getUserById
}