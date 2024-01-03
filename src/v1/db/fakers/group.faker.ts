import { IFaker, IGroup } from "../../../types";
//@ts-ignore
import faker from "faker";
import _ from "lodash";
import GroupService from "../../services/system/groups/group.service";

class GroupFaker implements IFaker {

    async make(): Promise<void> {
        let data: IGroup[] = [
            {
                name: "LogSystem",
                codename: "logsystem",
                description: "Listado de la Bitacora del Sistema",
                permissions: []
            },
            {
                name: "Groups",
                codename: "groups",
                description: "Listado de la Grupo del Sistema",
                permissions: []
            }
        ];

        await GroupService.bulkCreate(data);
    }
}

export default new GroupFaker();