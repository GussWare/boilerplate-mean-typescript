import { IFaker, IUser } from "../../../types";
//@ts-ignore
import faker from "faker";
import _ from "lodash";
import UserService from "../../services/system/users/user.service";
import UserModel from "../models/system/user.model";

class UserFaker implements IFaker {

    async make(): Promise<void> {
        await UserModel.deleteMany();
        
        let adminData: IUser = {
            first_name: "Gustavo",
            last_name: "Avila Medina",
            username: "gussware",
            email: "gussware@gmail.com",
            password: "123qweAA",
            is_email_verified: true,
            is_active: true
        };

       await UserService.create(adminData);

        const dataInsert = [];

        for (let i = 0; i < 100; i++) {
            let password = faker.internet.password();
            let firstName = faker.name.firstName();
            let lastName = faker.name.lastName();

            let data: IUser = {
                first_name: firstName,
                last_name: lastName,
                username: faker.internet.userName(firstName, lastName),
                email: faker.internet.email(firstName, lastName),
                password: password,
                is_email_verified: faker.datatype.boolean(),
                is_active: faker.datatype.boolean()
            };

            dataInsert.push(data);
        }        
    }
}

export default new UserFaker();