import mongoose, {Model} from "mongoose";
import { IPaginationOptions, IBitacora, IBitacoraFilter, IColumnSearch, IPaginationResponse } from "../../../types";
import ToJsonPlugin from "../plugins/tojson.plugin";
import paginationHelper from "../../../includes/helpers/pagination.helper";

const bitacoraSchema = new mongoose.Schema<IBitacora>(
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

bitacoraSchema.plugin(new ToJsonPlugin().apply);

bitacoraSchema.statics.paginate = async function (filter: IBitacoraFilter, options: IPaginationOptions) {
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
    if ('user' in filter) {
        advancedFilter.push({ user: filter.user });
    }

    if ('module' in filter) {
        advancedFilter.push({ module: filter.module });
    }

    if ('action' in filter) {
        advancedFilter.push({ action: filter.action });
    }

    if ('startData' in filter && 'endData' in filter) {

    }

    const filterFind: any = advancedFilter.length > 0 ? { $and: advancedFilter } : {};

    // Si se especifica una búsqueda, se hace uso del helper de búsqueda
    if (search) {
        const columns = ['name', 'slug', 'guard'];
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

const BitacoraModel: Model<IBitacora> = mongoose.model("Bitacora", bitacoraSchema);

export default BitacoraModel;