import mongoose, {Model} from "mongoose";
import { IPaginationOptions, IToken, ITokenFilter, IColumnSearch, IPaginationResponse, ITokenDocument } from "../../../types";
import ToJsonPlugin from "../plugins/tojson.plugin";
import paginationHelper from "../../../includes/helpers/pagination.helper";
import * as constants from "../../../includes/config/constants";

const tokenShema = new mongoose.Schema<IToken>(
    {
		token: {
			type: String,
			required: true,
			index: true,
		},
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: [
				constants.TOKEN_TYPE_REFRESH,
				constants.TOKEN_TYPE_RESET_PASSWORD,
				constants.TOKEN_TYPE_VERIFY_EMAIL,
			],
			required: true,
		},
		expires: {
			type: Date,
			required: true,
		},
		blacklisted: {
			type: Boolean,
			default: false,
		},
	},
    {
        timestamps: true,
    }
);

tokenShema.plugin(new ToJsonPlugin().apply);

tokenShema.statics.paginate = async function (filter: ITokenFilter, options: IPaginationOptions) {
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
    if ('token' in filter) {
        advancedFilter.push({ token: filter.token });
    }

    if ('user' in filter) {
        advancedFilter.push({ user: filter.user });
    }

    if ('type' in filter) {
        advancedFilter.push({ type: filter.type });
    }

    if ('blacklisted' in filter) {
        advancedFilter.push({ blacklisted: filter.blacklisted });
    }

    const filterFind: any = advancedFilter.length > 0 ? { $and: advancedFilter } : {};

    // Si se especifica una búsqueda, se hace uso del helper de búsqueda
    if (search) {
        const columns = ['name', 'surname', 'username', 'email'];
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

const TokenModel: Model<IToken, ITokenDocument> = mongoose.model("Token", tokenShema);

export default TokenModel;