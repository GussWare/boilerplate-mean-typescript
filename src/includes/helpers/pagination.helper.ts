import { IColumnSearch } from "../../types";
import _ from "lodash"

class PaginationHelper {
    async search(search: string, columns: string[]): Promise<IColumnSearch[]> {
        if(! search) return [];

        const searchOR: IColumnSearch[] = columns.map((column) => {
            const item: IColumnSearch = {};
            item[column] = { $regex: search, $options: "i" }

            return item;
        });

        return searchOR;
    }

    async advancedFilter(filter: any): Promise<any> {
        const advancedFilter = [];

        for (const key in filter) {
            if (Object.prototype.hasOwnProperty.call(filter, key)) {
                const element = filter[key];
                const item: any = {};
                item[key] = element;

                advancedFilter.push(item);
            }
        }

        return advancedFilter;
    }

    async filterFind(advancedFilter: any): Promise<any> {
        let filterFind: any = {};

        if (advancedFilter.length > 0) {
            filterFind = { $and: advancedFilter };
        }

        return filterFind;
    }

    async sort_by(sort_by: string): Promise<string> {
        let sort:any = {};
        const sortSplit = sort_by.split(",");

        for (const iterator of sortSplit) {
            const [key, order] = iterator.split(":");

            sort[key] = (order === "desc") ? -1 : 1;
        }

        return sort;
    }

    async skip(page: number, limit: number): Promise<number> {
        let skip = (page - 1) * limit;

        return skip;
    }
}

export default new PaginationHelper();