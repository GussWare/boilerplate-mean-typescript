import mongoose, {Model} from "mongoose";
import { IPaginationOptions, ILogSystem, ILogSystemFilter, IColumnSearch, IPaginationResponse } from "../../../../types";
import ToJsonPlugin from "mongoose-plugin-tojson";
import paginationHelper from "../../../../includes/helpers/pagination.helper";

const logsystemSchema = new mongoose.Schema<ILogSystem>(
    {
		name: {
			type: String,
			required: true,
			trim: true,
		},
		codename: {
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

logsystemSchema.plugin(ToJsonPlugin);

logsystemSchema.statics.paginate = async function (filter: ILogSystemFilter, options: IPaginationOptions) {
    const {
        sort_by = 'createdAt',
        page_size = 10,
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
        const columns = ['name', 'codename', 'guard'];
        searchFilter = paginationHelper.search(search, columns);

        if ((await searchFilter).length > 0) {
            filterFind.$or = searchFilter;
        }
    }

    // Se utiliza Promise.all para ejecutar ambas promesas en paralelo
    const countPromise = this.countDocuments(filterFind).exec();
    let docsPromise = this.find(filterFind)
        .sort(paginationHelper.sort_by(sort_by))
        .skip(paginationHelper.skip(page, page_size))
        .limit(page_size);

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
        const totalPages = Math.ceil(totalResults / page_size);
        const result: IPaginationResponse = {
            results,
            page,
            page_size: page_size,
            num_pages: totalPages,
            count: totalResults,
        };

        return Promise.resolve(result);
    });
};

const LogSystemModel: Model<ILogSystem> = mongoose.model("LogSystem", logsystemSchema);

export default LogSystemModel;