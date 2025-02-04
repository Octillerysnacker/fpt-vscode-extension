import { ILevel } from "../models/ILevel";
import { Random } from "random-js";
export function createRandomLevel(random: Random, fieldLengths: number): ILevel {
    return {
        Id: random.string(fieldLengths),
        Name: random.string(fieldLengths),
        VerifierFilepath: random.string(fieldLengths),
        InstructionsFilepath: random.string(fieldLengths),
        FolderFilepath: random.string(fieldLengths)
    };
}