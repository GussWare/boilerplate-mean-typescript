import mongoose, { Model } from "mongoose";
import { IPaginationOptions, IAction, IActionFilter, IColumnSearch, IPaginationResponse, IActionModel, IActionDocument } from "../../../types";
import ToJsonPlugin from "../plugins/tojson.plugin";
import paginationHelper from "../../../includes/helpers/pagination.helper";
import * as constants from "../../../includes/config/constants";

const actionSchema = new mongoose.Schema<IAction>(
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
        guard: {
            type: String,
            enum: [
                constants.GUARD_TYPE_API,
                constants.GUARD_TYPE_WEB
            ],
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        enabled: {
            type: Boolean,
            default: true,
        },
        module: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Module",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

actionSchema.plugin(new ToJsonPlugin().apply);

actionSchema.statics.paginate = async function (filter: IActionFilter, options: IPaginationOptions) {
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

    advancedFilter.push({ module: filter.module });

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

actionSchema.statics.isSlugTaken = async function (slug: string, excludeId: string) {
    const resource = await this.findOne({ slug: slug, _id: { $ne: excludeId } });
    return !!resource;
}

const ActionModel: Model<IAction, IActionModel, IActionDocument> = mongoose.model("Action", actionSchema);

export default ActionModel;