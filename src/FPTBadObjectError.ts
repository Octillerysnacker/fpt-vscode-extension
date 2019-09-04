export class FPTBadObjectError extends Error {
    public readonly badObject: any;
    constructor(badObject: any, message?: string) {
        super(message);
        this.badObject = badObject;
    }
}
