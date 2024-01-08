import mongoose, { Model } from "mongoose";
import MongooseToJSON from "mongoose-plugin-tojson";

import {  } from "../../../../types";
import { IGroupPermissionDocument } from "../../../../types";

const groupPermissionSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            required: true
        },
        permission: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Permission',
            required: true
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

groupPermissionSchema.plugin(MongooseToJSON);

const GroupPermissionModel: Model<IGroupPermissionDocument> = mongoose.model<IGroupPermissionDocument>("GroupPermission", groupPermissionSchema);

export default GroupPermissionModel;