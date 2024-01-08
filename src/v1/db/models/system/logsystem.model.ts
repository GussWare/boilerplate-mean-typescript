import mongoose, {Model} from "mongoose";
import { ILogSystem } from "../../../../types";
import ToJsonPlugin from "mongoose-plugin-tojson";
import ModelPaginationPlugin from "mongoose-plugin-model-paginate";

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
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

logsystemSchema.plugin(ToJsonPlugin);
logsystemSchema.plugin(ModelPaginationPlugin, { 
    fieldsForFilter: ["user", "module", "action"], 
    fieldsForSearch: ["user", "module", "action"] 
});


const LogSystemModel: Model<ILogSystem> = mongoose.model("LogSystem", logsystemSchema);

export default LogSystemModel;