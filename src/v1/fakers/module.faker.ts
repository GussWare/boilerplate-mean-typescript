import { IFaker, IModule } from "../../types";
//@ts-ignore
import faker from "faker";
import _ from "lodash";
import moduleService from "../services/modules/module.service";
import * as constants from "../../includes/config/constants";
import ModuleModel from "../models/sistema/module.model";

class ModuleFaker implements IFaker {

    async make(): Promise<void> {
        let data: IModule[] = [
            {
                name: "Configuración",
                slug: "configuration",
                guard: constants.GUARD_TYPE_API,
                description: "Listado de Configuración",
                actions: [
                    {
                        name: "Paginación",
                        slug: "configuration_paginate",
                        guard: constants.GUARD_TYPE_API,
                        description: "Paginación de la configuracion",
                    },
                    {
                        name: "Crear",
                        slug: "configuration_create",
                        guard: constants.GUARD_TYPE_API,
                        description: "Crear variable de configuración",
                    },
                    {
                        name: "Actualizar",
                        slug: "configuration_update",
                        guard: constants.GUARD_TYPE_API,
                        description: "Actualizar variable de configuración",
                    }
                ]
            },
            {
                name: "Bitacora",
                slug: "bitacora",
                guard: constants.GUARD_TYPE_API,
                description: "Listado de la Bitacora del Sistema",
                actions: [
                    {
                        name: "Paginación",
                        slug: "bitacora_paginate",
                        guard: constants.GUARD_TYPE_API,
                        description: "Paginación de la bitacora del sistema",
                    }
                ]
            },
            {
                name: "Modulos",
                slug: "modules",
                guard: constants.GUARD_TYPE_API,
                description: "Listado de la Bitacora del Sistema",
                actions: [
                    {
                        name: "Paginación de Modulos",
                        slug: "modules_paginate",
                        guard: constants.GUARD_TYPE_API,
                        description: "Paginación de modulos del sistema",
                    },
                    {
                        name: "Listado de Modulos",
                        slug: "modules_list",
                        guard: constants.GUARD_TYPE_API,
                        description: "Listado de modulos del sistema",
                    },
                    {
                        name: "Crear Modulos",
                        slug: "modules_create",
                        guard: constants.GUARD_TYPE_API,
                        description: "Crear Modulo",
                    },
                    {
                        name: "Update Modulos",
                        slug: "modules_update",
                        guard: constants.GUARD_TYPE_API,
                        description: "Update Modulo",
                    },
                    {
                        name: "Enabled Modulos",
                        slug: "modules_enabled",
                        guard: constants.GUARD_TYPE_API,
                        description: "Enabled Modulo",
                    },
                    {
                        name: "Disabled Modulos",
                        slug: "modules_dishabled",
                        guard: constants.GUARD_TYPE_API,
                        description: "Disabled Modulo",
                    }
                ]
            }
        ];

        await ModuleModel.deleteMany();

        for (const iterator of data) {
            await moduleService.create(iterator);
        }
    }
}

export default new ModuleFaker();