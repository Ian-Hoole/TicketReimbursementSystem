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

router.put("/approved/:ticketId", authenticateManagerToken, async (req, res) => {
    logger.info("PUT /approved/:ticketId path entered");
    const ticket = ticketService.approveTicket(req.params.ticketId, req.user.user_id);
    if (ticket) {
        res.status(200).json({ ticket });
    } else {
        res.status(400).json({ message: "Ticket not updated" });
    }
});

router.put("/denied/:ticketId", authenticateManagerToken, async (req, res) => {
    logger.info("PUT /denied/:ticketId path entered");
    const ticket = ticketService.denyTicket(req.params.ticketId,req.user.user_id);
    if (ticket) {
        res.status(200).json({ ticket });
    } else {
        res.status(400).json({ message: "Ticket not updated" });
    }
});

router.get("/all", authenticateManagerToken, async (req, res) => {
    logger.info("get /all path entered admin");
    const tickets = ticketService.getTicketList();
    res.status(200).json({ tickets });
})

router.get("/mytickets", authenticateToken, async (req, res) => {
    logger.info("get /mytickets path entered");
    const tickets = ticketService.getTicketListEmployeeId(req.user.user_id);
    res.status(200).json({ tickets });
})

router.get("/:ticketId", async (req, res) => {
    logger.info("GET /:ticketId path entered");
    const ticket = ticketService.getTicketById(req.params.ticketId);
    if (ticket) {
        res.status(200).json({ ticket });
    } else {
        res.status(400).json({ message: "Ticket not found" });
    }
});

module.exports = router;