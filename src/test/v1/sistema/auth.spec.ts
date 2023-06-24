import app from "../../../index";
import httpStatus from "http-status";
//@ts-ignore
import faker from "faker";
import { expect } from "chai";
import { before } from "mocha";
import request from "supertest";

const validCredentials = {
    email: "gussware@gmail.com",
    password: "123qweAA"
};

describe("Pruebas del Modulo de autenticación", () => {

    describe("Pruebas de inicio de sesión", () => {
        let uri = `/api/v1/auth/login`;

        it("Test 001 - Inicio de sesión exitoso con usuario y contraseña correctos", async () => {
            const res = await request(app).post(uri).send(validCredentials);

            expect(res.status).to.equal(httpStatus.OK);
        });

        it("Test 002 - Inicio de sesión exitoso con usuario y contraseña largos", async () => {
            const res = await request(app).post(uri).send({
                email: "gussware@gmail.com",
                password: "123qweAA"
            });

            expect(res.status).to.equal(httpStatus.OK);
        });

        it("Test 003 - Inicio de sesión fallido con usuario y contraseña incorrectos", async () => {
            const res = await request(app).post(uri).send({
                email: "not_user@gmail.com",
                password: "pass"
            });

            expect(res.status).to.equal(httpStatus.UNAUTHORIZED);
        });

        it("Test 004 - Inicio de sesión fallido con usuario correcto y contraseña incorrecta", async () => {
            const res = await request(app).post(uri).send({
                email: "gussware@gmail.com",
                password: "bad_password"
            });

            expect(res.status).to.equal(httpStatus.UNAUTHORIZED);
        });

        it("Test 005 - Inicio de sesión fallido con usuario incorrecto y contraseña correcta", async () => {
            const res = await request(app).post(uri).send({
                email: "gusse@gmail.com",
                password: "123qweAA"
            });

            expect(res.status).to.equal(httpStatus.UNAUTHORIZED);
        });

        it("Test 006 - Inicio de sesión fallido con campo de usuario vacío", async () => {
            const res = await request(app).post(uri).send({
                email: "",
                password: "123qweAA"
            });

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });

        it("Test 007 - Inicio de sesión fallido con campo de contraseña vacío", async () => {
            const res = await request(app).post(uri).send({
                email: "gussware@gmail.com",
                password: ""
            });

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });

        it("Test 008 - Inicio de sesión fallido con usuario deshabilitado", async () => {
            const res = await request(app).post(uri).send({
                email: "gussware@gmail.com",
                password: ""
            });

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });
    });

    describe("Pruebas a cerrar sesión de usuario", () => {
        let uri = `/api/v1/auth/logout`;
        let token: string;

        before(async () => {
            let response = await request(app)
                .post('/api/v1/auth/login')
                .send(validCredentials);
            token = response.body.tokens.refresh.token;
        });

        it("Test 009 - Cerrar sesión de usuario de forma correcta", async () => {
            const res = await request(app)
                .post(uri)
                .send({
                    refreshToken: token
                });

            expect(res.status).to.equal(httpStatus.OK);
        });

        it("Test 010 - Enviar token vacio", async () => {
            const res = await request(app)
                .post(uri)
                .send({
                    refreshToken: ""
                });

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });

        it("Test 011 - No enviar token", async () => {
            const res = await request(app)
                .post(uri)
                .send();

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });

        it("Test 012 - Enviar un token falso", async () => {
            const token_not_valid = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDFiYjRmZDA3ZWQ3NzM0NjhjYWYwNTUiLCJpYXQiOjE2ODEwMDM3NTAsImV4cCI6MTY4MTA5MDE1MCwidHlwZSI6IlRPS0VOX1RZUEVfUkVGUkVTSCJ9.k36kiqWTnGAcKNzFNMzEk1riO0l8PcfuQar-cMMmXGw";
            const res = await request(app)
                .post(uri)
                .send({
                    refreshToken: token_not_valid
                });

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
        });
    });

    describe("Pruebas de registro de usuario", () => {
        let uri = `/api/v1/auth/register`;

        it("Test 013 - Registro de usuario de manera correcta", async () => {
            let password = "123qweAA";
            let firstName = faker.name.firstName();
            let lastName = faker.name.lastName();

            const data = {
                name: firstName,
                surname: lastName,
                username: faker.internet.userName(firstName, lastName),
                email: faker.internet.email(firstName, lastName),
                password: password
            };

            const res = await request(app).post(uri).send(data);

            expect(res.status).to.equal(httpStatus.CREATED);
        });

        it("Test 014 - Registro de usuario incorrecto - name en blanco", async () => {
            let password = "123qweAA";
            let firstName = faker.name.firstName();
            let lastName = faker.name.lastName();

            const data = {
                name: "",
                surname: lastName,
                username: faker.internet.userName(firstName, lastName),
                email: faker.internet.email(firstName, lastName),
                password: password
            };

            const res = await request(app).post(uri).send(data);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });

        it("Test 015 - Registro de usuario incorrecto - name undefined", async () => {
            let password = "123qweAA";
            let firstName = faker.name.firstName();
            let lastName = faker.name.lastName();

            const data = {
                surname: lastName,
                username: faker.internet.userName(firstName, lastName),
                email: faker.internet.email(firstName, lastName),
                password: password
            };

            const res = await request(app).post(uri).send(data);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });

        it("Test 016 - Registro de usuario incorrecto - surname en blanco", async () => {
            let password = "123qweAA";
            let firstName = faker.name.firstName();
            let lastName = faker.name.lastName();

            const data = {
                name: firstName,
                surname: "",
                username: faker.internet.userName(firstName, lastName),
                email: faker.internet.email(firstName, lastName),
                password: password
            };

            const res = await request(app).post(uri).send(data);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });

        it("Test 017 - Registro de usuario incorrecto - surname undefined", async () => {
            let password = "123qweAA";
            let firstName = faker.name.firstName();
            let lastName = faker.name.lastName();

            const data = {
                name: firstName,
                username: faker.internet.userName(firstName, lastName),
                email: faker.internet.email(firstName, lastName),
                password: password
            };

            const res = await request(app).post(uri).send(data);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });

        it("Test 018 - Registro de usuario incorrecto - username en blanco", async () => {
            let password = "123qweAA";
            let firstName = faker.name.firstName();
            let lastName = faker.name.lastName();

            const data = {
                name: firstName,
                surname: lastName,
                username: "",
                email: faker.internet.email(firstName, lastName),
                password: password
            };

            const res = await request(app).post(uri).send(data);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });

        it("Test 019 - Registro de usuario incorrecto - username undefined", async () => {
            let password = "123qweAA";
            let firstName = faker.name.firstName();
            let lastName = faker.name.lastName();

            const data = {
                name: firstName,
                surname: lastName,
                email: faker.internet.email(firstName, lastName),
                password: password
            };

            const res = await request(app).post(uri).send(data);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });

        it("Test 020 - Registro de usuario incorrecto - email en blanco", async () => {
            let password = "123qweAA";
            let firstName = faker.name.firstName();
            let lastName = faker.name.lastName();

            const data = {
                name: firstName,
                surname: lastName,
                username: faker.internet.userName(firstName, lastName),
                email: "",
                password: password
            };

            const res = await request(app).post(uri).send(data);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });

        it("Test 021 - Registro de usuario incorrecto - email undefined", async () => {
            let password = "123qweAA";
            let firstName = faker.name.firstName();
            let lastName = faker.name.lastName();

            const data = {
                name: firstName,
                surname: lastName,
                username: faker.internet.userName(firstName, lastName),
                password: password
            };

            const res = await request(app).post(uri).send(data);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });

        it("Test 022 - Registro de usuario incorrecto - email formato no valido", async () => {
            let password = "123qweAA";
            let firstName = faker.name.firstName();
            let lastName = faker.name.lastName();

            const data = {
                name: firstName,
                surname: lastName,
                username: faker.internet.userName(firstName, lastName),
                email: "email_no_valido",
                password: password
            };

            const res = await request(app).post(uri).send(data);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });
    });

    describe("Pruebas Refresh Token", () => {
        let uri = `/api/v1/auth/refresh-token`;
        let token: string;

        before(async () => {
            let response = await request(app)
                .post('/api/v1/auth/login')
                .send(validCredentials);
            token = response.body.tokens.refresh.token;
        });

        it("Test 023 - Refresh Token Correcto", async () => {
            const data = {
                refreshToken: token,
            };

            const res = await request(app).post(uri).send(data);

            expect(res.status).to.equal(httpStatus.OK);
        });

    });

});