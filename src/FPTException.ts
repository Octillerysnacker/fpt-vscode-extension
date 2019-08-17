export interface FPTException{
    readonly Type : string;
    readonly Message : string;
    readonly InnerException : FPTException;
}
export function isFPTException(object : any) : object is FPTException{
    let testObject = object as FPTException;
    return testObject.InnerException !== undefined && 
    testObject.Message !== undefined && 
    testObject.Type !== undefined;
}