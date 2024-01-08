import mongoose, {Model} from "mongoose";
import { IPaginationOptions, ILanguage, ILanguageFilter, IColumnSearch, IPaginationResponse } from "../../../../types";
import ToJsonPlugin from "mongoose-plugin-tojson";
import paginationHelper from "../../../../includes/helpers/pagination.helper";

const languageSchema = new mongoose.Schema<ILanguage>(
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
		description: {
			type: String,
			required: false,
			trim: true,
		},
        default: {
			type: Boolean,
			required: false,
			trim: true,
		},
        is_active: {
			type: Boolean,
			required: true,
			trim: true,
		},
	},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

languageSchema.plugin(ToJsonPlugin);

languageSchema.statics.paginate = async function (filter: ILanguageFilter, options: IPaginationOptions) {
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
    if ('name' in filter) {
        advancedFilter.push({ name: filter.name });
    }

    if ('codename' in filter) {
        advancedFilter.push({ codename: filter.codename });
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

const LanguageModel: Model<ILanguage> = mongoose.model("Language", languageSchema);

export default LanguageModel;