import { FPTInternalError } from "./FPTInternalError";

type promisifedExec = (command: string) => Promise<{ stdout: string }>;

export class DotNetCoreFPTApp {
    private exec: promisifedExec;
    private appFilePath: string;
    constructor(exec: promisifedExec, appFilePath: string) {
        this.exec = exec;
        this.appFilePath = appFilePath;
    }
    public async runAsync(...command: string[]) {

        let result = await this.exec(["dotnet", this.appFilePath].concat(command).join(' '));
        try {
            return JSON.parse(result.stdout);
        } catch (e) {
            if (e instanceof SyntaxError) {
                throw new FPTInternalError("A bad result was recieved from the main FPT app.", e);
            }
            throw e;
        }
    }
}