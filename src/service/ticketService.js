const ticketDao = require("../repository/ticketDAO.js");
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../util/logger.js');
const { getPort } = require('../../constants.js');

const PORT = getPort()

async function getTicketById(ticketId, user_id, role){
    if(ticketId && user_id && role){
        const ticket = await ticketDao.getTicketById(ticketId);
        if(ticket){
            logger.info(ticket.user_id + " compared to " + user_id + " with " + role);
            if (role === "manager" || ticket.user_id === user_id){
                return { ...ticket, url: createTicketUrl(ticket.ticket_id) };
            }
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
            return { ...newTicket, url: createTicketUrl(newTicket.ticket_id) };
        }
    }
    return null;
}

async function getTicketList() {
    const ticketList = await ticketDao.getTicketList();
    return ticketList.map((ticket) => {
        return { ...ticket, url: createTicketUrl(ticket.ticket_id) }
    })
}

async function setTicketStatus(ticketId, status) {
    let newStatus = null;
    if (status === "approved" || status === "denied"){
        newStatus = status
    }
    if(ticketId && newStatus){
        const ticket = await ticketDao.getTicketById(ticketId);
        if(ticket){
            if (ticket.status === "pending") {
                if (ticketId) {
                    const newTicket = await ticketDao.processTicket(ticketId, "approved");
                    logger.info(ticketId);
                    return { ...newTicket, url:createTicketUrl(ticket.ticket_id) }
                }
            }
        }
    }
    return null;
}

async function getTicketListEmployeeId(userId) {
    if (userId){
        const ticketList = await ticketDao.getTicketListEmployeeId(userId);
        return ticketList.map((ticket) => {
            return { ...ticket, url: createTicketUrl(ticket.ticket_id) }
        })
    }
    return null;
}


async function getTicketListByStatus(status){
    if(status === "pending"){
        const ticketList = await ticketDao.getTicketListByStatus("pending");
        return ticketList.map((ticket) => {
            return { ...ticket, url: createTicketUrl(ticket.ticket_id) }
        })
    }
    else if (status === "approved") {
        const ticketList = await ticketDao.getTicketListByStatus("approved");
        return ticketList.map((ticket) => {
            return { ...ticket, url: createTicketUrl(ticket.ticket_id) }
        })
    }
    else if (status === "denied") {
        const ticketList = await ticketDao.getTicketListByStatus("denied");
        return ticketList.map((ticket) => {
            return { ...ticket, url: createTicketUrl(ticket.ticket_id) }
        })
    }
    else{
        return null;
    }
}

function createTicketUrl(id){
    return `http://localhost:${PORT}/tickets/${id}`
}
module.exports = {
    getTicketList,
    createTicket,
    getTicketListEmployeeId,
    getTicketById,
    getTicketListByStatus,
    setTicketStatus
}