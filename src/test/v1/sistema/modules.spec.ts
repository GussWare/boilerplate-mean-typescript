import app from "../../../index";
import httpStatus from "http-status";
//@ts-ignore
import faker from "faker";
import { expect } from "chai";
import request from "supertest";


describe("Pruebas del Modulo de Modules", () => {

    describe("Pruebas Paginación de Modules", () => {
        let uri = `/api/v1/modules/paginate`;

        it("Test - Paginación de Modulos", async () => {
            const data = {
                page: 1,
                limit: 20,
                sortBy: "asc"
            }

            const res = await request(app).get(uri).query(data);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.have.property("results");
            expect(res.body).to.have.property("page");
            expect(res.body).to.have.property("limit");
            expect(res.body).to.have.property("totalPages");
            expect(res.body).to.have.property("totalResults");
        });

        it("Test - Paginación de Modulos - limit 50", async () => {
            const data = {
                page: 1,
                limit: 20,
                sortBy: "name:asc"
            }

            const res = await request(app).get(uri).query(data);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.have.property("results");
            expect(res.body).to.have.property("page");
            expect(res.body).to.have.property("limit");
            expect(res.body).to.have.property("totalPages");
            expect(res.body).to.have.property("totalResults");
        });
    })

    describe("Pruebas Crear Modulo", () => {

    });

    describe("Pruebas Editar Modulo", () => {
        
    });

    describe("Pruebas Habilitar/Deshabilitar Modulo", () => {
        
    });

});