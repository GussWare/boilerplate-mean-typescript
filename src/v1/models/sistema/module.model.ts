import mongoose, { Model } from "mongoose";
import { IPaginationOptions, IModule, IModuleFilter, IColumnSearch, IPaginationResponse, IModuleModel } from "../../../types";
import ToJsonPlugin from "../plugins/tojson.plugin";
import paginationHelper from "../../../includes/helpers/pagination.helper";
import * as constants from "../../../includes/config/constants";

const moduleSchema = new mongoose.Schema<IModule>(
    {
        name: {
            type: String,
            required: true,
            trim: false,
        },
        slug: {
            type: String,
            required: false,
            trim: true,
        },
        guard: {
            type: String,
            enum: [
                constants.GUARD_TYPE_API,
                constants.GUARD_TYPE_WEB
            ],
            required: false,
        },
        description: {
            type: String,
            required: false,
            trim: true,
        },
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

moduleSchema.plugin(new ToJsonPlugin().apply);

moduleSchema.statics.paginate = async function (filter: IModuleFilter, options: IPaginationOptions) {
    let {
        sortBy = 'createdAt',
        limit,
        page ,
        populate,
        search,
    } = options;

    if(! limit) {
        limit = 10;
    }

    if(! page) {
        page = 1;
    }

    const advancedFilter = [];
    let searchFilter: Promise<IColumnSearch[]>;

    // Se realiza una validación previa para determinar si la propiedad existe en el objeto filter
    if ('name' in filter) {
        advancedFilter.push({ name: filter.name });
    }

    if ('slug' in filter) {
        advancedFilter.push({ slug: filter.slug });
    }

    if ('guard' in filter) {
        advancedFilter.push({ guard: filter.guard });
    }

    if ('enabled' in filter) {
        advancedFilter.push({ enabled: filter.enabled });
    }

    const filterFind: any = advancedFilter.length > 0 ? { $and: advancedFilter } : {};

    // Si se especifica una búsqueda, se hace uso del helper de búsqueda
    if (search) {
        const columns = ['name', 'slug', 'guard', 'enabled'];
        searchFilter = paginationHelper.search(search, columns);

        if ((await searchFilter).length > 0) {
            filterFind.$or = searchFilter;
        }
    }

    // Se utiliza Promise.all para ejecutar ambas promesas en paralelo
    const countPromise = this.countDocuments(filterFind).exec();
    let docsPromise = this.find(filterFind)
        .sort(await paginationHelper.sortBy(sortBy))
        .skip(await paginationHelper.skip(page, limit))
        .limit(10);

    if (populate) {
        populate.split(",").forEach((populateOption: any) => {
            docsPromise = docsPromise.populate(
                populateOption
                    .split(".")
                    .reverse()
                    .reduce((a: any, b: any) => ({ path: b, populate: a }))
            );
        });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
        const [totalResults, results] = values;
        const totalPages = Math.ceil(totalResults / limit);

        page = Math.ceil(page);
        limit = Math.ceil(limit);

        const result: IPaginationResponse = {
            results,
            page,
            limit,
            totalPages,
            totalResults,
        };

        return Promise.resolve(result);
    });
};

moduleSchema.statics.isModuleNameTaken = async function (name: string, excludeUserId?: mongoose.Types.ObjectId) {
    const resource = await this.findOne({ name, _id: { $ne: excludeUserId } });
    return !!resource;
};

moduleSchema.statics.isModuleSlugTaken = async function (slug: string, excludeUserId?: mongoose.Types.ObjectId) {
    const resource = await this.findOne({ slug, _id: { $ne: excludeUserId } });
    return !!resource;
};

const ModuleModel: Model<IModule, IModuleModel> = mongoose.model("Module", moduleSchema);

export default ModuleModel;