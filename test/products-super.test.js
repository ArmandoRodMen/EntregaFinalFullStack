import supertest from "supertest";
import { expect } from "chai";

const requester = supertest("http://localhost:8080");

describe("Products endpoints", ()=>{
    const productMock = {
        title: "Testing",
        description: "Product test",
        price: 666, 
        thumbnail: "NoImage.jpg",
        code: "Test01",
        stock: 1,
        category:"test",
        statues: true,
        owner: "6590ecddc462610925a7e6ce",
    };

    const updateMock ={
        price: 777,
    };

    const prodId = "65c3dd2ab08563648a677caf";
    
    describe("GET /api/products ",()=>{
        it("Should get all products", async()=>{
            const response = await requester.get("/api/products");
            
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('products').that.is.an('array');
            expect(response.body.products).to.not.be.empty;
        });
    });
    
    /*
    describe("POST /api/products ",()=>{
        it("Should create a product", async()=>{
            const response = await requester.post("/api/products").send(productMock);
            expect(response.status).to.equal(201);
            expect(response._body).to.have.property('message', 'Product created');
            expect(response._body).to.have.property('product').that.is.an('object');
            expect(response._body.product).to.include({
                title: productMock.title,
                description: productMock.description,
                code: productMock.code,
                category: productMock.category,
            });
            expect(response._body.product.price).to.be.a('number');
            expect(response._body.product.price).to.equal(productMock.price);
            expect(response._body.product.stock).to.equal(productMock.stock);
            expect(response._body.product).to.have.property('_id').that.is.a('string');

        });
    });
    */
    
    describe("GET /api/products/:id ",()=>{
        it("Should get an especific product", async()=>{
            const response = await requester.get(`/api/products/${prodId}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('product');
        });
    });
    
    
    describe("PUT /api/products/:id ",()=>{
        it("Should update an especific product", async()=>{
            const response = await requester.put(`/api/products/${prodId}`).send(updateMock);
            expect(response.status).to.equal(200);
            expect(response._body).to.have.property('message', 'Product updated');
        });
    });
    
    /*
    describe("DELETE /api/products/:id ",()=>{
        it("Should delete a product", async()=>{
            const response = await requester.delete(`/api/products/${prodId}`);
            expect(response.status).to.equal(200);
            expect(response._body).to.have.property('message', 'Product deleted');
        });
    });
    */
    
});
