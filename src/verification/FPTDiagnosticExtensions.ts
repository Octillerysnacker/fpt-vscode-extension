import { FPTDiagnostic, FileLocation } from "./FPTDiagnostic";
import {Random} from "random-js"
export function createRandomFPTDiagnostic(random: Random): FPTDiagnostic{
    return {
        Message: random.string(15),
        Kind: random.integer(0,2),
        Start: createRandomFileLocation(random),
        End: createRandomFileLocation(random)
    };
}

export function createRandomFileLocation(random: Random):FileLocation{
    return {
        Line: random.integer(0,20),
        Position: random.integer(0,20)
    };
}