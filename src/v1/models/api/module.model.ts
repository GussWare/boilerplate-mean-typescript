import mongoose, { Model } from "mongoose";
import { IPaginationOptions, IModule, IModuleFilter, IColumnSearch, IPaginationResponse } from "../../../types";
import ToJsonPlugin from "../plugins/tojson.plugin";
import paginationHelper from "../../../includes/helpers/pagination.helper";

const moduleSchema = new mongoose.Schema<IModule>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

moduleSchema.plugin(new ToJsonPlugin().apply);

moduleSchema.statics.paginate = async function (filter: IModuleFilter, options: IPaginationOptions) {
    const {
        sortBy = 'createdAt',
        limit = 10,
        page = 1,
        populate,
        search,
    } = options;

    const advancedFilter = [];
    let searchFilter: Promise<IColumnSearch[]>;

    // Se realiza una validación previa para determinar si la propiedad existe en el objeto filter
    if ('name' in filter) {
        advancedFilter.push({ name: filter.name });
    }

    if ('slug' in filter) {
        advancedFilter.push({ slug: filter.slug });
    }

    const filterFind: any = advancedFilter.length > 0 ? { $and: advancedFilter } : {};

    // Si se especifica una búsqueda, se hace uso del helper de búsqueda
    if (search) {
        const columns = ['name', 'slug'];
        searchFilter = paginationHelper.search(search, columns);

        if ((await searchFilter).length > 0) {
            filterFind.$or = searchFilter;
        }
    }

    // Se utiliza Promise.all para ejecutar ambas promesas en paralelo
    const countPromise = this.countDocuments(filterFind).exec();
    let docsPromise = this.find(filterFind)
        .sort(paginationHelper.sortBy(sortBy))
        .skip(paginationHelper.skip(page, limit))
        .limit(limit);

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

const ModuleModel: Model<IModule> = mongoose.model("Module", moduleSchema);

export default ModuleModel;