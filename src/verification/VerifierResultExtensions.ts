import { VerifierResult } from "./VerifierResult";
import { createRandomArrayOf } from "../FPTUtil";
import { createRandomFPTDiagnostic } from "./FPTDiagnosticExtensions";
import {Random} from "random-js";
export function createRandomVerifierResult(random : Random): VerifierResult{
    return {
        Success: random.bool(),
        Diagnostics: createRandomArrayOf(random.integer(0,4),() => createRandomFPTDiagnostic(random))
    };
}