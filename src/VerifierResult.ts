import { FPTDiagnostic } from "./FPTDiagnostic";

export interface VerifierResult{
    readonly Success : boolean;
    readonly Diagnostics : FPTDiagnostic[];
}