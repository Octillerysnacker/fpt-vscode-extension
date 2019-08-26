export interface ILevel {
    readonly Id: string;
    readonly Name: string;
    readonly FolderFilepath: string;
    readonly VerifierFilepath: string;
    readonly InstructionsFilepath: string;
    readonly InitializerFilepath: string;
}
export function isILevel(object: any): object is ILevel {
    return object.Id !== undefined &&
        object.Name !== undefined &&
        object.FolderFilepath !== undefined &&
        object.VerifierFilepath !== undefined &&
        object.InstructionsFilepath !== undefined &&
        object.InitializerFilepath !== undefined;
}