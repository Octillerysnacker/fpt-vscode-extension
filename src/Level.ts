import { ILevel } from "./ILevel";

export class Level implements ILevel {
    Id: string;
    Name: string;
    FolderFilepath: string;
    VerifierFilepath: string;
    InstructionsFilepath: string;
    InitializerFilepath: string;
    constructor(id?: string, name?: string, folderFilepath?: string, instructionsFilepath?: string, initializerFilepath?: string, verifierFilepath?: string) {
        this.Id = id || "";
        this.Name = name || "";
        this.FolderFilepath = folderFilepath || "";
        this.VerifierFilepath = verifierFilepath || "";
        this.InstructionsFilepath = instructionsFilepath || "";
        this.InitializerFilepath = initializerFilepath || "";
    }
}