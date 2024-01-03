import { IPaginationOptions, ILogSystem, ILogSystemFilter} from "../../../../types"
import LogSystemModel from "../../../db/models/system/logsystem.model"
import _ from "lodash"

class LogSystemService {

    //@ts-ignore
  async findPaginate(filter: ILogSystemFilter, options: IPaginationOptions): Promise<IPaginationResponse> {
    //@ts-ignore
    const resource: IPaginationResponse = await LogSystemModel.paginate(filter, options);
    return resource;
  }


  async create(data: ILogSystem): Promise<ILogSystem> {
    let resource = await LogSystemModel.create(data);

    return resource;
  }
}

export default new LogSystemService();