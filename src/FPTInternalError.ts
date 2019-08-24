export class FPTInternalError extends Error{
    public readonly InnerError : Error | undefined;
    constructor(message?: string, innerError? : Error){
        super(message);
        this.InnerError = innerError;
    }
}