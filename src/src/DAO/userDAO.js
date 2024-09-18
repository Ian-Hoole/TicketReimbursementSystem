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

const TableName = "TicketSystemUserTable"

async function getUserList() {
    const ScanCommand = new ScanCommand({
        TableName
    });
    try {
        const data = await documentClient.send(ScanCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data.Items;
    } catch (err) {
        console.error(err);
    }
}

async function name(params) {
    
}
module.exports = {
    getUserList,

}