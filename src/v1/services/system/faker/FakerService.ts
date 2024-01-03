import { IFaker } from "../../../../types";
import UserFaker from "../../../db/fakers/user.faker";


class FakerService implements IFaker{

    async make() {
        await UserFaker.make();
    }
}

export default new FakerService();