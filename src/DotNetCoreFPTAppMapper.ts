import { FPTInternalError } from "./FPTInternalError";

type promisifedExec = () => Promise<{stdout:string}>;

export class DotNetCoreFPTAppMapper{
    private exec : promisifedExec;
    constructor(exec : promisifedExec){
        this.exec = exec;
    }
    public async runAsync(){
        let result = await this.exec();
        try{
            return JSON.parse(result.stdout);
        }catch(e){
            if(e instanceof SyntaxError){
                throw new FPTInternalError("A bad result was recieved from the main FPT app.",e);
            }
            throw e;
        }
    }
}