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
ticketDao.getTicketQueue = jest.fn(async () => {
    let ticketArr = [];
    mockTicketDB.forEach(ticket => {
        if (ticket.status === "pending") {
            ticketArr.push(ticket);
        }
    });
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

        const expectedResult = { ticket_id: "5", user_id: userId, description: description, amount, type , status: "pending" };
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

        const expectedResult = {ticket_id:"5", user_id:userId, description:description, amount, type:"other", status:"pending"};
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

        const expectedResult = { ticket_id: "3", user_id: "2", amount: 12, description: "SampleTicket3", status: "approved", type: "food" };
        let result = null;

        result = await ticketService.getTicketById(ticket_id);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).toHaveBeenCalled();
    });
    test("Get a ticket with an invalid ID", async () => {
        const ticket_id = "6";

        let result = null;

        result = await ticketService.getTicketById(ticket_id);

        expect(result).toBeNull();
        expect(ticketDao.getTicketById).toHaveBeenCalled();
    });
    test("Get a ticket with no ID", async () => {
        const ticket_id = null;

        let result = null;

        result = await ticketService.getTicketById(ticket_id);

        expect(result).toBeNull();
        expect(ticketDao.getTicketById).not.toHaveBeenCalled();
    });
});

describe("Testing getting a ticketList via ticketService.getTicketList", () => {
    beforeEach(() => {
        rebuildDatabase();
        ticketDao.getTicketList.mockClear();
    });
    test("Get a list of all tickets", async () => {

        const expectedResult = [{ ticket_id: "1", user_id: "1", amount: 123.4, description: "SampleTicket1", status: "pending", type: "travel" },
                                { ticket_id: "2", user_id: "2", amount: 5, description: "SampleTicket2", status: "pending", type: "other" },
                                { ticket_id: "3", user_id: "2", amount: 12, description: "SampleTicket3", status: "approved", type: "food" },
                                { ticket_id: "4", user_id: "1", amount: 3.5, description: "SampleTicket4", status: "denied", type: "lodging" }]
        let result = null;

        result = await ticketService.getTicketList();

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketList).toHaveBeenCalled();
        });
});

describe("Testing approving a ticket via ticketService.approveTicket", () => {
    beforeEach(() => {
        rebuildDatabase();
        ticketDao.processTicket.mockClear();
        ticketDao.getTicketById.mockClear();
    });
    test("Approve a valid ticket", async () => {
        const ticketId = "1";

        const expectedResult = { ticket_id: "1", user_id: "1", amount: 123.4, description: "SampleTicket1", status: "approved", type: "travel" }
        let result = null

        result = await ticketService.approveTicket(ticketId);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).toHaveBeenCalled()
        expect(ticketDao.processTicket).toHaveBeenCalled();
    });
    test("Approve an invalid ticket id", async () => {
        const ticketId = "5";

        const expectedResult = null;
        let result = null

        result = await ticketService.approveTicket(ticketId);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).toHaveBeenCalled()
        expect(ticketDao.processTicket).not.toHaveBeenCalled();
    });
    test("Approve an without a ticketId", async () => {
        const ticketId = null;

        const expectedResult = null;
        let result = null

        result = await ticketService.approveTicket(ticketId);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).not.toHaveBeenCalled();
        expect(ticketDao.processTicket).not.toHaveBeenCalled();
    });
    test("Approve a ticket that is not pending", async () => {
        const ticketId = "3";

        const expectedResult = null;
        let result = null

        result = await ticketService.approveTicket(ticketId);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).toHaveBeenCalled();
        expect(ticketDao.processTicket).not.toHaveBeenCalled();
    });
})

describe("Testing denying a ticket via ticketService.denyTicket", () => {
    beforeEach(() => {
        rebuildDatabase();
        ticketDao.processTicket.mockClear();
        ticketDao.getTicketById.mockClear();
    });
    test("Deny a valid ticket", async () => {
        const ticketId = "1";

        const expectedResult = { ticket_id: "1", user_id: "1", amount: 123.4, description: "SampleTicket1", status: "denied", type: "travel" }
        let result = null

        result = await ticketService.denyTicket(ticketId);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).toHaveBeenCalled()
        expect(ticketDao.processTicket).toHaveBeenCalled();
    });
    test("Deny an invalid ticket id", async () => {
        const ticketId = "5";

        const expectedResult = null;
        let result = null

        result = await ticketService.denyTicket(ticketId);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).toHaveBeenCalled()
        expect(ticketDao.processTicket).not.toHaveBeenCalled();
    });
    test("Deny an without a ticketId", async () => {
        const ticketId = null;

        const expectedResult = null;
        let result = null

        result = await ticketService.denyTicket(ticketId);

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketById).not.toHaveBeenCalled();
        expect(ticketDao.processTicket).not.toHaveBeenCalled();
    });
    test("Deny a ticket that is not pending", async () => {
        const ticketId = "3";

        const expectedResult = null;
        let result = null

        result = await ticketService.denyTicket(ticketId);

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

        const expectedResult = [{ ticket_id: "2", user_id: "2", amount: 5, description: "SampleTicket2", status: "pending", type: "other" },
                                { ticket_id: "3", user_id: "2", amount: 12, description: "SampleTicket3", status: "approved", type: "food" }]
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

describe("Testing getting a ticket queue via ticketService.getTicketQueue", () => {
    beforeEach(() => {
        rebuildDatabase();
        ticketDao.getTicketList.mockClear();
    });
    test("Get a list of all tickets", async () => {

        const expectedResult = [{ ticket_id: "1", user_id: "1", amount: 123.4, description: "SampleTicket1", status: "pending", type: "travel" },
                                { ticket_id: "2", user_id: "2", amount: 5, description: "SampleTicket2", status: "pending", type: "other" }]
        let result = null;

        result = await ticketService.getTicketQueue();

        expect(result).toEqual(expectedResult);
        expect(ticketDao.getTicketQueue).toHaveBeenCalled();
    });
});