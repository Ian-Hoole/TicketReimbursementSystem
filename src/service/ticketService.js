const ticketDao = require("../repository/ticketDAO.js");
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../util/logger.js');


async function getTicketById(ticketId){
    if(ticketId){
        const ticket = await ticketDao.getTicketById(ticketId);
        if(ticket){
            return ticket;
        }
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
        const response = await ticketDao.createTicket(newTicket);
        logger.info("Service recieved response:" + response);
        if(response === 200){
            return newTicket;
        }
    }
    return null;
}

async function getTicketList() {
    return await ticketDao.getTicketList();
}

async function approveTicket(ticketId) {
    
    if(ticketId){
        const ticket = await getTicketById(ticketId);
        if(ticket){
            if (ticket.status === "pending") {
                if (ticketId) {
                    console.log(ticketId)
                    return await ticketDao.processTicket(ticketId, "approved");
                }
            }
        }
    }
    return null;
}

async function denyTicket(ticketId) {
    if(ticketId){
        const ticket = await getTicketById(ticketId);
        if (ticket) {
            if (ticket.status === "pending") {
                if (ticketId) {
                    console.log(ticketId)
                    return await ticketDao.processTicket(ticketId, "denied");
                }
            }
        }
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