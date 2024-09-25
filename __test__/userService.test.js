const userService = require("../src/service/userService.js");
const userDao = require("../src/repository/userDAO.js");
const bcrypt = require("bcrypt");
//const logger = require("../src/util/logger.js");

//Mock Database & reset function
let mockUserDB = [];
rebuildDatabase();

function rebuildDatabase() {
    mockUserDB = [{ user_id: "1", username: "alex", password: "1234", role: "employee" },
    { user_id: "2", username: "administrator", password: "45678", role: "manager" },
    { user_id: "3", username: "phil", password: "dang", role: "employee" }];
}

//Mocked functions
userDao.createUser = jest.fn(async (user) => {
    return 200;
});
userDao.getUserByUsername = jest.fn(async (username) => {
    let tempUser = null;
    mockUserDB.forEach(user => {
        if(user.username === username){
            tempUser = user;
        }
    });
    return tempUser;
});
bcrypt.hash = jest.fn(async (str) => {
    return str;
});
bcrypt.compare = jest.fn(async (str1, str2) => {
    return str1 === str2;
});
jest.mock('uuid', () => ({ v4: () => `${mockUserDB.length + 1}` }));
//logger.info = jest.fn((str) => { console.log("info: " + str)});
//logger.error = jest.fn((str) => { console.log("error: " + str) });

//Test cases
describe("Testing user creation via userService.createUser", () => {
    beforeEach(() => {
        rebuildDatabase();
        userDao.createUser.mockClear();
        userDao.getUserByUsername.mockClear();
    });
    test("Adding a user without password parameters", async () => {
        //Arrange
        const username = "john";
        const password = "";

        let result = null
        //Action
        result = await userService.createUser(username, password);
        //Assert
        expect(result).toBeNull();
        expect(userDao.getUserByUsername).not.toHaveBeenCalled();
        expect(userDao.createUser).not.toHaveBeenCalled();
    });
    test("Adding a new user without a username", async () => {
        //Arrange
        const username = "";
        const password = "pass";

        let result = null
        //Action
        result = await userService.createUser(username, password);
        //Assert
        expect(result).toBeNull();
        expect(userDao.getUserByUsername).not.toHaveBeenCalled();
        expect(userDao.createUser).not.toHaveBeenCalled();
    });
    test("Adding a duplicate user", async () => {
        //Arrange
        const username = "alex";
        const password = "pass";

        let result = null
        //Action
        result = await userService.createUser(username, password);
        //Assert
        expect(result).toBeNull();
        expect(userDao.getUserByUsername).toHaveBeenCalled();
        expect(userDao.createUser).not.toHaveBeenCalled();
    });
    test("Adding a new valid user", async () => {
        //Arrange
        const username = "john";
        const password = "pass";

        const expectedResult = { user_id: "4", username: "john", role: "employee" };
        let result = null
        //Action
        result = await userService.createUser(username, password);
        //Assert
        expect(result).toEqual(expectedResult);
        expect(userDao.getUserByUsername).toHaveBeenCalled();
        expect(userDao.createUser).toHaveBeenCalled();
    });
});

describe("Testing user logins via userService.getUserByUsername", () => {
    beforeEach(() => {
        rebuildDatabase();
        userDao.getUserByUsername.mockClear();
    });
    test("Logging in with no username", async () => {
        //Arrange
        const username = "";
        const password = "1234";

        const expectedResult = null;
        let result = null;
        //Action
        result = await userService.getUserByUsernamePassword(username, password);
        //Assert
        expect(result).toEqual(expectedResult);
        expect(userDao.getUserByUsername).not.toHaveBeenCalled();
    }); 
    test("Logging in with no password", async () => {
        //Arrange
        const username = "alex";
        const password = "";

        const expectedResult = null;
        let result = null;
        //Action
        result = await userService.getUserByUsernamePassword(username, password);
        //Assert
        expect(result).toEqual(expectedResult);
        expect(userDao.getUserByUsername).not.toHaveBeenCalled();
    });
    test("Logging in with a bad password", async () => {
        //Arrange
        const username = "alex";
        const password = "12345";

        const expectedResult = null;
        let result = null;
        //Action
        result = await userService.getUserByUsernamePassword(username, password);
        //Assert
        expect(result).toEqual(expectedResult);
        expect(userDao.getUserByUsername).toHaveBeenCalled();
    });
    test("Logging in with no user in database", async () => {
        //Arrange
        const username = "john";
        const password = "1234";

        const expectedResult = null;
        let result = null;
        //Action
        result = await userService.getUserByUsernamePassword(username, password);
        //Assert
        expect(result).toEqual(expectedResult);
        expect(userDao.getUserByUsername).toHaveBeenCalled();
    });
    test("Logging in with a valid user", async () => {
        //Arrange
        const username = "alex";
        const password = "1234";

        const expectedResult = { user_id: "1", username: "alex", role: "employee" };
        let result = null;
        //Action
        result = await userService.getUserByUsernamePassword(username, password);
        //Assert
        expect(result).toEqual(expectedResult);
        expect(userDao.getUserByUsername).toHaveBeenCalled();
    });
});