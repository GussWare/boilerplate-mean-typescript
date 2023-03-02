import { IColumnSearch } from "../../types";
import _ from "underscore";

class PaginationHelper {
    async search(search: string, columns: string[]): Promise<IColumnSearch[]> {
        const searchOR: IColumnSearch[] = [];

        for (const column of columns) {
            const item: IColumnSearch = {};
            item[column] = { $regex: search, $options: "i" };
            searchOR.push(item);
        }

        return searchOR;
    }

    async sortBy(sortBy: string): Promise<string> {
        if (!sortBy) {
            return "createdAt";
        }

        const sortingCriteria: string[] = [];

        sortBy.split(",").forEach((sortOption) => {
            const [key, order] = sortOption.split(":");
            sortingCriteria.push((order === "desc" ? "-" : "") + key);
        });

        const sort = sortingCriteria.join(" ");

        return sort;
    }

    async limit(limitOption:number ): Promise<number> {
        const limit = (limitOption > 0) ? limitOption : 10;

        return limit;
    }

    async page(pageOption: number): Promise<number> {
        const page = (pageOption > 0) ? pageOption : 1;

        return page;
    }

    async skip() {

    }
}

export default new PaginationHelper();