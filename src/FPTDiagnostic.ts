export interface FPTDiagnostic{
    readonly Message : string;
    readonly Kind : DiagnosticKind;
    readonly Start : FileLocation;
    readonly End : FileLocation;
}
export function isFPTDiagnostic(object : any): object is FPTDiagnostic{
    return typeof object.Message === "string" &&
        isDiagnosticKind(object.Kind) &&
        isFileLocation(object.Start) &&
        isFileLocation(object.End);
        
}
export enum DiagnosticKind {Error = 0, Warning = 1, Info = 2}
export function isDiagnosticKind(object : any): object is DiagnosticKind{
    return object === DiagnosticKind.Error ||
        object === DiagnosticKind.Info ||
        object === DiagnosticKind.Warning;
}
export interface FileLocation {
    readonly Line : number;
    readonly Position : number;
}
export function isFileLocation(object : any):object is FileLocation{
    return typeof object.Line === "number" &&
        typeof object.Position === "number";
}