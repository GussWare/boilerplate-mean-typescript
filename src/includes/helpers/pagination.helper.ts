import { IColumnSearch } from "../../types";
import loggerHelper from "./logger.helper";

class PaginationHelper {
    async search(search: string, columns: string[]): Promise<IColumnSearch[]> {
        
        const searchOR: IColumnSearch[] = columns.map((column) => {
            const item: IColumnSearch = {};
            item[column] = { $regex: search, $options: "i" }

            return item;
        });

        return searchOR;
    }

    async sortBy(sortBy: string): Promise<string> {
        if (!sortBy) {
            return "createdAt:asc";
        }

        let sort:any = {};

        const sortSplit = sortBy.split(",");

        for (const iterator of sortSplit) {
            const [key, order] = iterator.split(":");
            sort[key] = (order === "desc") ? -1 : 1;
        }

        loggerHelper.debug("sorttt");
        loggerHelper.debug(JSON.stringify(sort));

        return sort;
    }

    async skip(page: number, limit: number): Promise<number> {
        let skip = (page - 1) * limit;

        loggerHelper.debug("skip");
        loggerHelper.debug(skip);

        return skip;
    }
}

export default new PaginationHelper();