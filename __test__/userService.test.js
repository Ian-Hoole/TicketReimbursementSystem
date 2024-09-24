const userService = require("../src/service/userService.js");
const userDao = require("../repository/userDAO.js");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");

jest.mock("userDao");
jest.mock("bcrypt");
jest.mock("uuidv4");



const mockUserDB = [{ user_id: "1", username: "alex", password: "1234", role: "employee" }, 
                    { user_id: "2", username: "administrator", password: "45678", role: "manager" },
                    { user_id: "3", username: "phil", password: "dang", role: "employee" }];


describe("Testing user ", () => {
    test("Sample Test", () => {
        //AAA

        //Arrange
        const username = "alex";
        const password = "1234";
        //Action

        //Assert


    })
})