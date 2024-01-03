import mongoose, { Model } from "mongoose";
import { IPaginationOptions, IPermission, IPermissionFilter, IPaginationResponse, IPermissionModel, IPermissionDocument } from "../../../../types";
import ToJsonPlugin from "mongoose-plugin-tojson";
import PaginationHelper from "../../../../includes/helpers/pagination.helper";

const permissionSchema = new mongoose.Schema<IPermission>(
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
            required: true,
            trim: true,
        }
    },
    {
        timestamps: true,
    }
);

permissionSchema.plugin(ToJsonPlugin);

permissionSchema.statics.paginate = async function (filter: IPermissionFilter, columns: string[], options: IPaginationOptions) {
    const { sort_by, page_size, page, populate, search } = options;

    const advancedFilter = await PaginationHelper.advancedFilter(filter);
    const searchFilter = await PaginationHelper.search(search, columns);
    const filterFind = await PaginationHelper.filterFind(advancedFilter);

    if (search) {
        if (searchFilter.length > 0) {
            filterFind.$or = searchFilter;
        }
    }

    const countPromise = this.countDocuments(filterFind).exec();
    const paginationSortBy = await PaginationHelper.sort_by(sort_by);
    const paginationSkip = await PaginationHelper.skip(page, page_size);

    let docsPromise = this.find(filterFind)
        .sort(paginationSortBy)
        .skip(paginationSkip)
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

    const [totalResults, results] = await Promise.all([countPromise, docsPromise]);
    const totalPages = Math.ceil(totalResults / page_size);
    const result: IPaginationResponse = {
        results: results,
        page: page,
        page_size: page_size,
        num_pages: totalPages,
        count: totalResults,
    };

    return result;
};

permissionSchema.statics.isCodeNameTaken = async function (codename: string, excludeId: string) {
    const resource = await this.findOne({ codename: codename, _id: { $ne: excludeId } });
    return !!resource;
}

const PermissionModel: Model<IPermission, IPermissionModel, IPermissionDocument> = mongoose.model("Permission", permissionSchema);

export default PermissionModel;