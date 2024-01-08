import mongoose, { Model } from "mongoose";
import { IPermission, IPermissionModel, IPermissionDocument } from "../../../../types";
import ToJsonPlugin from "mongoose-plugin-tojson";
import ModelPaginatePlugin from "mongoose-plugin-model-paginate";

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
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

permissionSchema.plugin(ToJsonPlugin);
permissionSchema.plugin(ModelPaginatePlugin, {
    fieldsForFilter: ["name", "codename"],
    fieldsForSearch: ["name", "codename"]
});

permissionSchema.statics.isCodeNameTaken = async function (codename: string, excludeId: string) {
    const resource = await this.findOne({ codename: codename, _id: { $ne: excludeId } });
    return !!resource;
}

const PermissionModel: Model<IPermission, IPermissionModel, IPermissionDocument> = mongoose.model("Permission", permissionSchema);

export default PermissionModel;