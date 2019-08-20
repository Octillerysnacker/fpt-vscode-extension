export interface Level{
    readonly Name : string;
    readonly Id : string;
    readonly VerifierFilepath : string;
    readonly InstructionsFilepath : string;
    readonly FolderFilepath : string;
}
export function isLevel(object : any):object is Level{
    let testObject = object as Level;
    return testObject.Name !== undefined &&
    testObject.Id !== undefined &&
    testObject.VerifierFilepath !== undefined &&
    testObject.InstructionsFilepath !== undefined &&
    testObject.FolderFilepath !== undefined;
}