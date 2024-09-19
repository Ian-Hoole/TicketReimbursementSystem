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

async function getTicketListEmployeeId(userId) {
    const queryCommand = new QueryCommand({
        TableName,
        KeyConditionExpression: "#u = :u",
        ExpressionAttributeNames: {"#u": user_id},
        ExpressionAttributeValues: {":u": {S: userId}}
    });
    try {
        const data = await documentClient.send(queryCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data;
    } catch (err) {
        logger.error(err);
    }
}

async function createTicket(userId, description, amount, type) {
    const newTicket = {
        ticket_id: uuidv4(),
        user_id: userId,
        description,
        amount,
        type,
        status: "pending"
    };
    const putCommand = new PutCommand({
        TableName,
        Item: newTicket
    });
    try {
        const data = await documentClient.send(putCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data;
    } catch (err) {
        logger.error(err);
    }
}

async function processTicket(ticketId, userId, outcome){
    const updateCommand = new UpdateCommand({
        TableName,
        Key: {ticket_id: ticketId,
            user_id:userId
        },
        UpdateExpression: "SET status = :status",
        ExpressionAttributeValues: {
            ":status": outcome
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