import { FPTDiagnostic, isFPTDiagnostic } from "./FPTDiagnostic";
import { isTArray } from "../FPTUtil";

export interface VerifierResult{
    readonly Success : boolean;
    readonly Diagnostics : FPTDiagnostic[];
}
export function isVerifierResult(object : any): object is VerifierResult{
    return typeof object.Success === "boolean" &&
        isTArray<FPTDiagnostic>(object.Diagnostics,isFPTDiagnostic);
}