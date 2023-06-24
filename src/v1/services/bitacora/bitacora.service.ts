import { IPaginationOptions, IBitacora, IBitacoraFilter} from "../../../types"
import BitacoraModel from "../../models/sistema/bitacora.model"
import _ from "lodash"

class BitacoraService {

    //@ts-ignore
  async findPaginate(filter: IBitacoraFilter, options: IPaginationOptions): Promise<IPaginationResponse> {
    //@ts-ignore
    const resource: IPaginationResponse = await BitacoraModel.paginate(filter, options);
    return resource;
  }


  async create(data: IBitacora): Promise<IBitacora> {
    let resource = await BitacoraModel.create(data);

    return resource;
  }
}

export default new BitacoraService();