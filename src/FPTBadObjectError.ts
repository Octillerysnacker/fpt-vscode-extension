export class FPTBadObjectError extends Error {
    public readonly badObject: any;
    public readonly expectedTypeName: string;
    constructor(badObject: any, expectedTypeName: string, message?: string) {
        super(message);
        this.badObject = badObject;
        this.expectedTypeName = expectedTypeName;
    }
}
