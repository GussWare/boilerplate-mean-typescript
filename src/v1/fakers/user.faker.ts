import { IFaker, IUser } from "../../types";
//@ts-ignore
import faker from "faker";
import _ from "lodash";
import userService from "../services/users/user.service";
import UserModel from "../models/sistema/user.model";

class UserFaker implements IFaker {

    async make(): Promise<void> {
        await UserModel.deleteMany();
        
        let adminData: IUser = {
            name: "Gustavo",
            surname: "Avila Medina",
            username: "gussware",
            email: "gussware@gmail.com",
            password: "123qweAA",
            role: "1",
            isEmailVerified: true,
            enabled: true
        };

        await userService.create(adminData);

        const dataInsert = [];

        for (let i = 0; i < 100; i++) {
            let password = faker.internet.password();
            let firstName = faker.name.firstName();
            let lastName = faker.name.lastName();

            let data: IUser = {
                name: firstName,
                surname: lastName,
                username: faker.internet.userName(firstName, lastName),
                email: faker.internet.email(firstName, lastName),
                password: password,
                role: "2",
                isEmailVerified: faker.datatype.boolean(),
                enabled: faker.datatype.boolean()
            };

            dataInsert.push(data);
        }

        await userService.bulk(dataInsert);
    }
}

export default new UserFaker();