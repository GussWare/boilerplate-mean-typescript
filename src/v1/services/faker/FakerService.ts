import { IFaker } from "../../../types";
import UserFaker from "../../fakers/user.faker";
import ModuleFaker from "../../fakers/module.faker";


class FakerService implements IFaker{

    async make() {
        await UserFaker.make();
        await ModuleFaker.make();
    }
}

export default new FakerService();