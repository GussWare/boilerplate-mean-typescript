import { IColumnSearch } from "../../types";
import _ from "underscore";

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
            return "createdAt";
        }

        const sortingCriteria = sortBy.split(",").map((sortOption) => {
            const [key, order] = sortOption.split(":");
            return (order === "desc" ? "-" : "") + key;
        });

        const sort = sortingCriteria.join(" ");

        return sort;
    }

    async skip(page: number, limit: number): Promise<number> {
        const skip = (page - 1) * limit;

        return skip;
    }
}

export default new PaginationHelper();