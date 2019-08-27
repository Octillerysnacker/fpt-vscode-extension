import { IFPTApp } from "./IFPTApp";
import { ILevel, isILevel } from "./ILevel";
import { FPTBadObjectError } from "./FPTBadObjectError";
import { isArray, isString } from "util";
import { isTArray } from "./FPTUtil";

export class FPTAppMapper {
    private fptApp: IFPTApp;
    constructor(fptApp: IFPTApp) {
        this.fptApp = fptApp;
    }
    public async getLevels(): Promise<ILevel[]> {
        let result = await this.fptApp.runAsync("levels");
        if (isTArray(result, isILevel)) {
            return result;
        }
        throw new FPTBadObjectError(result, "An object with an unexpected structure was recieved.");
    }
    public async openLevel(levelId: string, user: string) {
        return this.fptApp.runAsync("open", levelId, user);
    }
}