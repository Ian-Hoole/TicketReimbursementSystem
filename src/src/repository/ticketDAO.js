const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    ScanCommand,
    QueryCommand,
    UpdateCommand,
    DeleteCommand
} = require("@aws-sdk/lib-dynamodb");
const { logger } = require('../util/logger.js');

const client = new DynamoDBClient({ region: "us-west-1" }); // replace with your region

const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "TicketSystemTicketTable"

async function getTicketList() {
    const scanCommand = new ScanCommand({
        TableName
    });
    try {
        const data = await documentClient.send(scanCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data;
    } catch (err) {
        console.error(err);
    }
}

async function getTicketListEmployeeId(user_id) {
    const queryCommand = new QueryCommand({
        TableName,
        KeyConditionExpression: "#u = :u",
        ExpressionAttributeNames: {"#u": "user_id"},
        ExpressionAttributeValues: { ":u": { S: user_id }}
    });
    try {
        const data = await documentClient.send(queryCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data;
    } catch (err) {
        logger.error(err);
    }
}

async function createTicket(Item) {
    const putCommand = new PutCommand({
        TableName,
        Item
    });
    try {
        const data = await documentClient.send(putCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data;
    } catch (err) {
        logger.error(err);
    }
}

async function processTicket(ticket_id, user_id, status){
    const updateCommand = new UpdateCommand({
        TableName,
        Key: {ticket_id,
            user_id
        },
        UpdateExpression: "SET status = :status",
        ExpressionAttributeValues: {
            ":status": status
        }
    });
    try {
        const data = await documentClient.send(updateCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data;
    } catch (err) {
        logger.error(err);
    }
}

module.exports = {
    getTicketList,
    getTicketListEmployeeId,
    createTicket,
    processTicket
}