import { FPTAppMapper } from "./FPTAppMapper";
import { exec } from "child_process";
import { promisify } from "util";
import { isFPTException, FPTException } from "./FPTException";
import { Level, isLevel } from "./Level";

const promisifiedExec =  promisify(exec);

export class DotNetCoreFPTAppMapper implements FPTAppMapper{
    private readonly appPath : string;
    constructor(appPath :string){
        this.appPath = appPath;
    }
    async runCommand(...args : string[]){
        
        const {stdout} = await promisifiedExec(["dotnet",this.appPath].concat(args).join(' '));
        const result = JSON.parse(stdout);
        if(isFPTException(result)){
            let error = result as FPTException;
            throw error;
        }else{
            return result;
        }
    }
    private badObjectError(){
        return new Error("A bad object was recieved from runCommand.");
    }
    async getLevels() : Promise<readonly Level[]>{
        let result = await this.runCommand("levels");
        if(Array.isArray(result) && result.every( item => isLevel(item))){
            return <readonly Level[]>result;
        }else{
            throw this.badObjectError();
        }
    }
    async getLevel(id: string): Promise<Level> {
        throw new Error("Method not implemented.");
    }
    async openLevel(id: string, user: string): Promise<string> {
        let result = await this.runCommand("open",id,user);
        if(typeof result === "string"){
            return result;
        }else{
            throw this.badObjectError();
        }
    }
    
}