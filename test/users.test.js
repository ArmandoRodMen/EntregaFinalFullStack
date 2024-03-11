import { usersDao } from "../src/DAL/DAO/mongodb/users.dao.js";
import {expect} from "chai";
import "./db.js";

describe("Get all users", function(){
    before(function () {
        this.usersDao = new usersDao();
    });
    it("should return an array", async function(){
        const result = await this.usersDao.findAll();
        expect(result).to.be.an("array");
    });
});

describe("Create user", function(){
    before(function (){
        this.usersDao = new usersDao();
    });
    const userMock = {
        first_name: 'Juan',
        last_name: 'Perez',
        email: 'email@email.com',
        password: '123',
    };
    it('Should create an user', async function(){
        const response = await this.usersDao.save(userMock);
        expect (response).to.have.property("cart");
        expect(response.carts).to.have.lengthOf(0);
    });
});