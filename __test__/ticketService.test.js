const ticketDao = require("../src/repository/ticketDAO.js");
const ticketService = require("../src/service/ticketService.js");

jest.mock('uuid', () => ({ v4: () => `${mockTicketDB.length + 1}` }));
//Mock database
let mockTicketDB = [];
rebuildDatabase();

function rebuildDatabase(){
    mockTicketDB = [{ ticket_id: "1", user_id: "1", amount:123.4, description:"SampleTicket1", status:"pending", type:"travel"},
                    { ticket_id: "2", user_id: "2", amount: 5, description: "SampleTicket2", status: "pending", type: "other" },
                    { ticket_id: "3", user_id: "2", amount: 12, description: "SampleTicket3", status: "approved", type: "food" },
                    { ticket_id: "4", user_id: "1", amount: 3.5, description: "SampleTicket4", status: "denied", type: "lodging" }]
}
//Mock Functions
ticketDao.getTicketList = jest.fn(async () => {
    return mockTicketDB;
});

ticketDao.getTicketById = jest.fn(async (ticket_id) => {
    let tempTicket = null;
    mockTicketDB.forEach(ticket => {
        if (ticket.ticket_id === ticket_id) {
            tempTicket = ticket;
        }
    });
    return tempTicket;
});

ticketDao.getTicketListEmployeeId = jest.fn(async (user_id) => {
    let ticketArr = [];
    mockTicketDB.forEach(ticket => {
        if (ticket.user_id === user_id){
            ticketArr.push(ticket);
        }
    });
    return ticketArr;
});

ticketDao.getTicketListByStatus = jest.fn(async (status) => {
    let ticketArr = null;
    if (status === "pending" || status === "approved" || status === "denied"){
        ticketArr = [];
        mockTicketDB.forEach(ticket => {
            if (ticket.status === status) {
                ticketArr.push(ticket);
            }
        });
    }
    return ticketArr;
});

ticketDao.createTicket = jest.fn(async (ticket) => {
    return 200;
});

ticketDao.processTicket = jest.fn(async (ticket_id, status) => {
    let tempTicket = null;
    mockTicketDB.forEach(ticket => {
        if (ticket.ticket_id === ticket_id) {
            tempTicket = ticket;
        }
    });
    tempTicket.status = status;
    return tempTicket;
});

//Test cases
describe("Testing ticket creation via ticketService.createTicket", () => {
    beforeEach(() => {
        rebuildDatabase();
        ticketDao.createTicket.mockClear();
    });
    test("Creating a valid ticket with a type", async () => {
        const userId = "2";
        const description = "TestTicket";
        const amount = 4.99;
        const type = "lodging";

        const expectedResult = { ticket_id: "5", user_id: userId, description: description, amount, type, status: "pending", "url": "http://localhost:3000/tickets/5" };
        let result = null;

        result = await ticketService.createTicket(userId, description, amount, type);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.createTicket).toHaveBeenCalled();
    });
    test("Creating a valid ticket without a type", async () => {
        const userId = "2";
        const description = "TestTicket";
        const amount = 4.99;
        const type = null;

        const expectedResult = { ticket_id: "5", user_id: userId, description: description, amount, type: "other", status: "pending", "url": "http://localhost:3000/tickets/5" };
        let result = null;

        result = await ticketService.createTicket(userId, description, amount, type);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.createTicket).toHaveBeenCalled();
    });
    test("Creating a ticket without a userId", async () => {
        const userId = null;
        const description = "TestTicket";
        const amount = 4.99;
        const type = "lodging";

        let result = null;

        result = await ticketService.createTicket(userId, description, amount, type);

        expect(result).toBeNull();
        expect(ticketDao.createTicket).not.toHaveBeenCalled();
    });
    test("Creating a ticket without a description", async () => {
        const userId = "2";
        const description = null;
        const amount = 4.99;
        const type = "lodging";

        let result = null;

        result = await ticketService.createTicket(userId, description, amount, type);

        expect(result).toBeNull();
        expect(ticketDao.createTicket).not.toHaveBeenCalled();
    });
    test("Creating a ticket without a valid amount", async () => {
        const userId = "2";
        const description = "TestTicket";
        const amount = 0;
        const type = "lodging";

        let result = null;

        result = await ticketService.createTicket(userId, description, amount, type);

        expect(result).toBeNull();
        expect(ticketDao.createTicket).not.toHaveBeenCalled();
    });
});

describe("Testing getting a ticket by id via ticketService.getTicketById", () => {
    beforeEach(() => {
        rebuildDatabase();
        ticketDao.getTicketById.mockClear();
    });
    test("Get a ticket with a valid ID", async () => {
        const ticket_id = "3";
        const user_id = "2";
        const role = "employee";

        const expectedResult = { ticket_id: "3", user_id: "2", amount: 12, description: "SampleTicket3", status: "approved", type: "food", "url": "http://localhost:3000/tickets/3" };
        let result = null;

        result = await ticketService.getTicketById(ticket_id, user_id, role);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).toHaveBeenCalled();
    });
    test("Get a ticket with an invalid ID", async () => {
        const ticket_id = "6";
        const user_id = "2";
        const role = "employee";

        let result = null;

        result = await ticketService.getTicketById(ticket_id, user_id, role);

        expect(result).toBeNull();
        expect(ticketDao.getTicketById).toHaveBeenCalled();
    });
    test("Get a ticket with no ID", async () => {
        const ticket_id = null;
        const user_id = "2";
        const role = "employee";

        let result = null;

        result = await ticketService.getTicketById(ticket_id, user_id, role);

        expect(result).toBeNull();
        expect(ticketDao.getTicketById).not.toHaveBeenCalled();
    });
    test("Get a ticket with a different user id", async () => {
        const ticket_id = "4";
        const user_id = "2";
        const role = "employee";

        const expectedResult = null;
        let result = null;

        result = await ticketService.getTicketById(ticket_id, user_id, role);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).toHaveBeenCalled();
    });
    test("Get a ticket as a manager", async () => {
        const ticket_id = "4";
        const user_id = "5";
        const role = "manager";

        const expectedResult = { ticket_id: "4", user_id: "1", amount: 3.5, description: "SampleTicket4", status: "denied", type: "lodging", "url": "http://localhost:3000/tickets/4" };
        let result = null;

        result = await ticketService.getTicketById(ticket_id, user_id, role);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).toHaveBeenCalled();
    });
});

describe("Testing getting a ticketList via ticketService.getTicketList", () => {
    beforeEach(() => {
        rebuildDatabase();
        ticketDao.getTicketList.mockClear();
    });
    test("Get a list of all tickets", async () => {

        const expectedResult = [{ ticket_id: "1", user_id: "1", amount: 123.4, description: "SampleTicket1", status: "pending", type: "travel", "url": "http://localhost:3000/tickets/1" },
            { ticket_id: "2", user_id: "2", amount: 5, description: "SampleTicket2", status: "pending", type: "other", "url": "http://localhost:3000/tickets/2" },
            { ticket_id: "3", user_id: "2", amount: 12, description: "SampleTicket3", status: "approved", type: "food", "url": "http://localhost:3000/tickets/3" },
            { ticket_id: "4", user_id: "1", amount: 3.5, description: "SampleTicket4", status: "denied", type: "lodging", "url": "http://localhost:3000/tickets/4" }]
        let result = null;

        result = await ticketService.getTicketList();

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketList).toHaveBeenCalled();
        });
});

describe("Testing modifying a ticket via ticketService.setTicketStatus", () => {
    beforeEach(() => {
        rebuildDatabase();
        ticketDao.processTicket.mockClear();
        ticketDao.getTicketById.mockClear();
    });
    test("Approve a valid ticket", async () => {
        const ticketId = "1";
        const status = "approved";

        const expectedResult = { ticket_id: "1", user_id: "1", amount: 123.4, description: "SampleTicket1", status: "approved", type: "travel", "url": "http://localhost:3000/tickets/1" }
        let result = null

        result = await ticketService.setTicketStatus(ticketId, status);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).toHaveBeenCalled()
        expect(ticketDao.processTicket).toHaveBeenCalled();
    });
    test("Set a ticket with an invalid status", async () => {
        const ticketId = "1";
        const status = "perchance";

        const expectedResult = null;
        let result = null

        result = await ticketService.setTicketStatus(ticketId, status);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).not.toHaveBeenCalled()
        expect(ticketDao.processTicket).not.toHaveBeenCalled();
    });
    test("Deny a valid ticket", async () => {
        const ticketId = "1";
        const status = "denied";

        const expectedResult = { ticket_id: "1", user_id: "1", amount: 123.4, description: "SampleTicket1", status: "approved", type: "travel", "url": "http://localhost:3000/tickets/1" }
        let result = null

        result = await ticketService.setTicketStatus(ticketId, status);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).toHaveBeenCalled()
        expect(ticketDao.processTicket).toHaveBeenCalled();
    });
    test("Change the status of an invalid ticket id", async () => {
        const ticketId = "5";
        const status = "approved";

        const expectedResult = null;
        let result = null

        result = await ticketService.setTicketStatus(ticketId, status);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).toHaveBeenCalled()
        expect(ticketDao.processTicket).not.toHaveBeenCalled();
    });
    test("Change the status of a ticket without a ticketId", async () => {
        const ticketId = null;
        const status = "approved";

        const expectedResult = null;
        let result = null

        result = await ticketService.setTicketStatus(ticketId, status);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).not.toHaveBeenCalled();
        expect(ticketDao.processTicket).not.toHaveBeenCalled();
    });
    test("change the status of a ticket that is not pending", async () => {
        const ticketId = "3";
        const status = "approved";

        const expectedResult = null;
        let result = null

        result = await ticketService.setTicketStatus(ticketId, status);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).toHaveBeenCalled();
        expect(ticketDao.processTicket).not.toHaveBeenCalled();
    });
});

describe("Testing getting an employee's by id via ticketService.getTicketListEmployeeId", () => {
    beforeEach(() => {
        rebuildDatabase();
        ticketDao.getTicketListEmployeeId.mockClear();
    });
    test("Get a valid list of all employee tickets ", async () => {
        const user_id = "2";

        const expectedResult = [{ ticket_id: "2", user_id: "2", amount: 5, description: "SampleTicket2", status: "pending", type: "other", "url": "http://localhost:3000/tickets/2" },
            { ticket_id: "3", user_id: "2", amount: 12, description: "SampleTicket3", status: "approved", type: "food", "url": "http://localhost:3000/tickets/3" }]
        let result = null;

        result = await ticketService.getTicketListEmployeeId(user_id);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketListEmployeeId).toHaveBeenCalled();
    });
    test("Get a list of all employee tickets no id", async () => {
        const user_id = null;

        const expectedResult = null;
        let result = null;

        result = await ticketService.getTicketListEmployeeId(user_id);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketListEmployeeId).not.toHaveBeenCalled();
    });
    test("Get a list of all employee tickets invalid id", async () => {
        const user_id = "3";

        const expectedResult = [];
        let result = null;

        result = await ticketService.getTicketListEmployeeId(user_id);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketListEmployeeId).toHaveBeenCalled();
    });
});

describe("Testing getting a list of tickets via ticketService.getTicketByStatus", () => {
    beforeEach(() => {
        rebuildDatabase();
        ticketDao.getTicketListByStatus.mockClear();
    });
    test("Get a list of all pending tickets", async () => {
        const status = "pending"

        const expectedResult = [{ ticket_id: "1", user_id: "1", amount: 123.4, description: "SampleTicket1", status: "pending", type: "travel", "url": "http://localhost:3000/tickets/1" },
            { ticket_id: "2", user_id: "2", amount: 5, description: "SampleTicket2", status: "pending", type: "other", "url": "http://localhost:3000/tickets/2" }]
        let result = null;

        result = await ticketService.getTicketListByStatus(status);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketListByStatus).toHaveBeenCalled();
    });
    test("Get a list of all approved tickets", async () => {
        const status = "approved"

        const expectedResult = [{ ticket_id: "3", user_id: "2", amount: 12, description: "SampleTicket3", status: "approved", type: "food", "url": "http://localhost:3000/tickets/3" }];
        let result = null;

        result = await ticketService.getTicketListByStatus(status);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketListByStatus).toHaveBeenCalled();
    });
    test("Get a list of all deined tickets", async () => {
        const status = "denied"

        const expectedResult = [{ ticket_id: "4", user_id: "1", amount: 3.5, description: "SampleTicket4", status: "denied", type: "lodging", "url": "http://localhost:3000/tickets/4" }]
        let result = null;

        result = await ticketService.getTicketListByStatus(status);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketListByStatus).toHaveBeenCalled();
    });
    test("Get a list of all tickets invalid status", async () => {
        const status = "perchance"

        const expectedResult = null;
        let result = null;

        result = await ticketService.getTicketListByStatus(status);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketListByStatus).not.toHaveBeenCalled();
    });
});