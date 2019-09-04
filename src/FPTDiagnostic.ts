export interface FPTDiagnostic{
    readonly Message : string;
    readonly Kind : DiagnosticKind;
    readonly Start : FileLocation;
    readonly End : FileLocation;
}
export enum DiagnosticKind {Error, Warning, Info}
export interface FileLocation {
    readonly Line : number;
    readonly Position : number;
}