import { IFPTApp } from "./IFPTApp";
import { ILevel, isILevel } from "../models/ILevel";
import { FPTBadObjectError } from "../error/FPTBadObjectError";
import { isArray, isString } from "util";
import { isTArray } from "../utilities/FPTUtil";
import { isVerifierResult } from "../verification/VerifierResult";

export class FPTAppMapper {
    private fptApp: IFPTApp;
    constructor(fptApp: IFPTApp) {
        this.fptApp = fptApp;
    }
    private makeBadObjectError(result: any) {
        return new FPTBadObjectError(result, "An object with an unexpected structure was recieved.");
    }
    public async getLevels(): Promise<ILevel[]> {
        let result = await this.fptApp.runAsync("levels");
        if (isTArray(result, isILevel)) {
            return result;
        }
        throw this.makeBadObjectError(result);
    }
    public async openLevel(levelId: string, user: string): Promise<string> {
        let result = await this.fptApp.runAsync("open", levelId, user);
        if (isString(result)) {
            return result;
        }
        throw this.makeBadObjectError(result);
    }
    public async getInstructions(levelId: string) {
        let result = await this.fptApp.runAsync("instructions", levelId);
        if (isString(result)) {
            return result;
        }
        throw this.makeBadObjectError(result);
    }
    public async verify(levelId: string, user: string){
        let result = await this.fptApp.runAsync("verify",levelId,user);
        if(isVerifierResult(result)){
            return result;
        }
        throw this.makeBadObjectError(result);
    }
}