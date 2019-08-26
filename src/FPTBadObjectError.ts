export class FPTBadObjectError<T> extends Error {
    public readonly badObject: any;
    constructor(badObject: any, message?: string) {
        super(message);
        this.badObject = badObject;
    }
}
