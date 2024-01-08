import mongoose, { Model } from "mongoose";
import { IGroup, IGroupModel, IGroupDocument } from "../../../../types";
import MongooseToJSON from "mongoose-plugin-tojson";
import MongooseModelPaginate from "mongoose-plugin-model-paginate"

const groupSchema = new mongoose.Schema<IGroup>(
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
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

groupSchema.plugin(MongooseToJSON);
groupSchema.plugin(MongooseModelPaginate, { 
    fieldsForFilter: ["name", "codename"], 
    fieldsForSearch: ["name", "codename"] 
});

groupSchema.statics.isNameTaken = async function (name: string, id?: string): Promise<boolean> {
    const filter: any = { name: name };

    if (id) {
        filter._id = { $ne: id };
    }

    const count = await this.countDocuments(filter);

    return count > 0;
}

groupSchema.statics.isCodeNameTaken = async function (codename: string, id?: string): Promise<boolean> {
    const filter: any = { codename: codename };

    if (id) {
        filter._id = { $ne: id };
    }

    const count = await this.countDocuments(filter);

    return count > 0;
}

const GroupModel: Model<IGroup, IGroupModel, IGroupDocument> = mongoose.model("Group", groupSchema);

export default GroupModel;