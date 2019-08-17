import { Level } from "./Level";

export interface FPTAppMapper{
    getLevels() : Promise<ReadonlyArray<Level>>;
    getLevel(id: string) : Promise<Level>;
    openLevel(id : string, user : string) : Promise<string>;
}