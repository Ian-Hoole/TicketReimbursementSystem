const express = require("express");
const { logger } = require('../util/logger.js');
const ticketService = require("../service/ticketService.js");
const { authenticateManagerToken, authenticateToken } = require("../middleware/middleware.js");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
    logger.info("POST / path entered");
    const ticket = await ticketService.createTicket(req.user.user_id, req.body.description, req.body.amount, req.body.type);
    if(ticket){
        res.status(200).json({ticket});
    }else{
        res.status(400).json({message: "ticket could not be created"});
    }
});

router.patch("/approved/:ticketId", authenticateManagerToken, async (req, res) => {
    logger.info(`PUT /approved path entered ticketId: ${req.params.ticketId}`);
    const ticket = await ticketService.approveTicket(req.params.ticketId);
    if (ticket) {
        res.status(200).json({ ticket });
    } else {
        res.status(400).json({ message: "Ticket not updated" });
    }
});

router.patch("/denied/:ticketId", authenticateManagerToken, async (req, res) => {
    logger.info(`PUT /denied path entered ticketId: ${req.params.ticketId}`);
    const ticket = await ticketService.denyTicket(req.params.ticketId);
    if (ticket) {
        res.status(200).json({ ticket });
    } else {
        res.status(400).json({ message: "Ticket not updated" });
    }
});

router.get("/all", authenticateManagerToken, async (req, res) => {
    logger.info("get /all path entered admin");
    const tickets = await ticketService.getTicketList();
    res.status(200).json({ tickets });
})

router.get("/queue", authenticateManagerToken, async (req, res) => {
    logger.info("get /queue path entered admin");
    const tickets = await ticketService.getTicketQueue();
    res.status(200).json({tickets});
})

router.get("/mytickets", authenticateToken, async (req, res) => {
    logger.info("get /mytickets path entered");
    const tickets = await ticketService.getTicketListEmployeeId(req.user.user_id);
    res.status(200).json({ tickets });
})

router.get("/:ticketId", authenticateManagerToken, async (req, res) => {
    logger.info("GET /:ticketId path entered");
    const ticket = await ticketService.getTicketById(req.params.ticketId);
    if (ticket) {
        res.status(200).json({ ticket });
    } else {
        res.status(400).json({ message: "Ticket not found" });
    }
});

module.exports = router;