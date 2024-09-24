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
const { logger } = require('../util/logger.js');

const client = new DynamoDBClient({ region: "us-west-1" }); // replace with your region

const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "TicketSystemUserTable"


async function getUserByUsername(username){
    const scanCommand = new ScanCommand({
        TableName,
        FilterExpression: "#u = :u",
        ExpressionAttributeNames: {
            "#u": "username"
        },
        ExpressionAttributeValues: {
            ":u": username
        }
    });
    try {
        const data = await documentClient.send(scanCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data.Items[0];
    } catch (err) {
        logger.error(err);
    }
}
async function createUser(Item) {
    const putCommand = new PutCommand({
        TableName,
        Item
    });
    try {
        const data = await documentClient.send(putCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data.$metadata.httpStatusCode;
    } catch (err) {
        logger.error(err);
    }
}

module.exports = {
    createUser,
    getUserByUsername
}