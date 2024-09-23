const ticketDao = require("../repository/ticketDAO.js");
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../util/logger.js');


async function getTicketById(ticketId){
    if(ticketId){
        return await ticketDao.getTicketById(ticketId);
    }
    return null;
}

async function createTicket(userId, description, amount, type) {
    if(!type){
        type = "other";
    }
    logger.info(userId + " - " + description + " - " + amount + " - " + type);
    if(userId && description && amount){
        const newTicket = {
            ticket_id: uuidv4(),
            user_id: userId,
            description,
            amount,
            type,
            status: "pending"
        };
        logger.info("creating ticket" + JSON.stringify(newTicket));
        return await ticketDao.createTicket(newTicket);
    }
    return null;
}

async function getTicketList() {
    return await ticketDao.getTicketList();
}

async function approveTicket(ticketId) {
    const ticket = await getTicketById(ticketId);
    if(ticket.status === "pending"){
        if (ticketId) {
            return await ticketDao.processTicket(ticketId, "approved");
        }
    }
    return null;
}

async function denyTicket(ticketId) {
    //should check that ticket is pending
    if (ticketId) {
        return await ticketDao.processTicket(ticketId, "denied");
    }
    return null;
}

async function getTicketListEmployeeId(userId) {
    if (userId){
        return await ticketDao.getTicketListEmployeeId(userId);
    }
    return null;
}

async function getTicketQueue(){
    return await ticketDao.getTicketQueue();
}
module.exports = {
    getTicketList,
    createTicket,
    approveTicket,
    denyTicket,
    getTicketListEmployeeId,
    getTicketById,
    getTicketQueue
}