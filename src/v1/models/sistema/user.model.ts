import mongoose, {Model} from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"
import { IPaginationOptions, Img, IUser, IUserFilter, IColumnSearch, IPaginationResponse, IUserModel, IUserDocument } from "../../../types";
// import * as paginationHelper from "../helpers/pagination.helper";
import ToJsonPlugin from "../plugins/tojson.plugin";
import paginationHelper from "../../../includes/helpers/pagination.helper";

const imgSchema = new mongoose.Schema<Img>({
    name: {
        type: String,
        required: true,
        default: "no-img.png"
    },
    imgUrl: {
        type: String,
        required: true,
        default: "no-img.png"
    },
    thumbnailUrl: {
        type: String,
        required: false,
        default: "no-img.png"
    },
});

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: false,
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
        picture: imgSchema,
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value: string) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email");
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            private: true, // used by the toJSON plugin
        },
        role: {
            type: String,
            default: "user",
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
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

userSchema.plugin(new ToJsonPlugin().apply);

userSchema.statics.paginate = async function (filter: IUserFilter, options: IPaginationOptions) {
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
    if ('username' in filter) {
        advancedFilter.push({ username: filter.username });
    }

    if ('email' in filter) {
        advancedFilter.push({ email: filter.email });
    }

    if('enabled' in filter) {
        advancedFilter.push({ enabled: filter.enabled });
    }

    if('enabled' in filter) {
        advancedFilter.push({ enabled: filter.enabled });
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

userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: mongoose.Types.ObjectId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.statics.isUserNameTaken = async function (username: string, excludeUserId?: mongoose.Types.ObjectId) {
    const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.methods.isPasswordMatch = async function (password: string) {
    const user = this;
    //@ts-ignore
    return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        //@ts-ignore
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const UserModel: Model<IUser, IUserModel, IUserDocument> = mongoose.model("User", userSchema);

export default UserModel;