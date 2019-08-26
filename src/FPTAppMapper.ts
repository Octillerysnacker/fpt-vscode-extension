import { IFPTApp } from "./IFPTApp";
import { ILevel, isILevel } from "./ILevel";
import { FPTBadObjectError } from "./FPTBadObjectError";
import { isArray } from "util";

export class FPTAppMapper {
    private fptApp: IFPTApp;
    constructor(fptApp: IFPTApp) {
        this.fptApp = fptApp;
    }
    public async getLevels(): Promise<ILevel[]> {
        let result = await this.fptApp.runAsync("levels");
        if (isArray(result) && result.every(value => isILevel(value))) {
            return result;
        }
        throw new FPTBadObjectError(result, "ILevel[]", "An object with an unexpected structure was recieved.");
    }
}