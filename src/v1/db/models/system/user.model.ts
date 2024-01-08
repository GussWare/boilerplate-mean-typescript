import mongoose, { Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"
import { IUser, IUserModel, IUserDocument } from "../../../../types";
import ToJsonPlugin from "mongoose-plugin-tojson"
import ModelPaginatePlugin from "mongoose-plugin-model-paginate"

const userSchema = new mongoose.Schema<IUser>(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: false,
            default: null
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
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
            private: true,
        },
        is_email_verified: {
            type: Boolean,
            default: false,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        is_superadmin: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

userSchema.plugin(ToJsonPlugin);
userSchema.plugin(ModelPaginatePlugin, {
    fieldsForFilter: [], 
    fieldsForSearch: [] 
});

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