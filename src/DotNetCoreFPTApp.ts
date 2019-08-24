import { FPTInternalError } from "./FPTInternalError";

type promisifedExec = (command: string, options?: { cwd?: string }) => Promise<{ stdout: string, stderr: string }>;

export class DotNetCoreFPTApp {
    private exec: promisifedExec;
    private appFilePath: string;
    private cwd: string;
    constructor(exec: promisifedExec, appFilePath: string, cwd: string) {
        this.exec = exec;
        this.appFilePath = appFilePath;
        this.cwd = cwd;
    }
    public async runAsync(...command: string[]) {

        let result = await this.exec(["dotnet", this.appFilePath].concat(command).join(' '), { cwd: this.cwd });
        try {
            if (result.stderr.trim() !== "") {
                throw JSON.parse(result.stderr);
            }
            return JSON.parse(result.stdout);
        } catch (e) {
            if (e instanceof SyntaxError) {
                throw new FPTInternalError("A bad result was recieved from the main FPT app.", e);
            }
            throw e;
        }
    }
}