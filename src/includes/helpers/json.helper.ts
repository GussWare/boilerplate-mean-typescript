export default class JsonHelper {
    public static isJsonValid(json: any): boolean {
        try {
            JSON.parse(json);
        } catch (e) {
            return false;
        }
        return true;
    }
}

