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
        return data.Items;
    } catch (err) {
        logger.error(err);
    }
}

async function getTicketListEmployeeId(user_id) {
    const scanCommand = new ScanCommand({
        TableName,
        FilterExpression: "#u = :u",
        ExpressionAttributeNames: {"#u": "user_id"},
        ExpressionAttributeValues: { ":u": user_id }
    });
    try {
        const data = await documentClient.send(scanCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data.Items;
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
        return data.$metadata.httpStatusCode;
    } catch (err) {
        logger.error(err);
    }
}


async function processTicket(ticket_id, status){
    const updateCommand = new UpdateCommand({
        TableName,
        Key: {ticket_id: ticket_id},
        UpdateExpression: "SET #s = :s",
        ExpressionAttributeNames: {"#s": "status"},
        ExpressionAttributeValues: {":s": status},
        ReturnValues: "ALL_NEW"
    });
    try {
        const data = await documentClient.send(updateCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data.Attributes;
    } catch (err) {
        logger.error(err);
    }
}

async function getTicketById(ticket_id){
    const queryCommand = new QueryCommand({
        TableName,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: {"#id": "ticket_id"},
        ExpressionAttributeValues: {":id": ticket_id}
    });
    try {
        const data = await documentClient.send(queryCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data.Items[0];
    } catch (err) {
        logger.error(err);
    }
}
async function getTicketListByStatus(status){
    const scanCommand = new ScanCommand({
        TableName,
        FilterExpression: "#s = :s",
        ExpressionAttributeNames: {
            "#s": "status"
        },
        ExpressionAttributeValues: {
            ":s": status
        }
    });
    try {
        const data = await documentClient.send(scanCommand);
        logger.info(JSON.stringify(data, null, 2));
        return data.Items;
    } catch (err) {
        logger.error(err);
    }
}

module.exports = {
    getTicketList,
    getTicketListEmployeeId,
    createTicket,
    processTicket,
    getTicketById,
    getTicketListByStatus
}