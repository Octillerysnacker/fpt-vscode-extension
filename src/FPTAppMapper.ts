import { IFPTApp } from "./IFPTApp";
import { ILevel } from "./ILevel";

export class FPTAppMapper {
    private fptApp: IFPTApp;
    constructor(fptApp: IFPTApp) {
        this.fptApp = fptApp;
    }
    public async getLevels() : Promise<ILevel[]>{
        let result = await this.fptApp.runAsync("levels");
        return result;
    }
}