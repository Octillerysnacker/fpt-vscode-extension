//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import { DotNetCoreFPTAppMapper } from '../DotNetCoreFPTAppMapper';
import { FPTInternalError } from '../FPTInternalError';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';
type promisifiedExec = () => Promise<{stdout:string}>;

describe("DotNetCoreFPTAppMapper", function(){
    describe("runAsync", function(){
        describe("should deserialize and return serialized object",function(){
            let dataset : any[]= [{Hi:"pie",Id:"random"},"The quick rown fox",1,3.14];

            let getTest = (data : any) => {
                return async function(){
                    let fakeExec : promisifiedExec= async function(){
                        return {stdout:JSON.stringify(data)};
                    };
                    let mapper = new DotNetCoreFPTAppMapper(fakeExec);
            
                    let result = await mapper.runAsync();
            
                    assert.deepStrictEqual(result,data);
                };
            };

            dataset.forEach(data => {
                it(JSON.stringify(data),getTest(data));
            });
        });
        describe("should throw FPTInteralError when invalid json recieved", function(){
            let dataset : string[] = ["yeet","your feet","{badObject:\"noot\"","["];

            let getTest = (data : string) => {
                return async function(){
                    let fakeExec : promisifiedExec = async function(){
                        return {stdout:data};
                    };
                    let mapper = new DotNetCoreFPTAppMapper(fakeExec);
                    
                    return assert.rejects(mapper.runAsync(),function(e : any){
                        assert.ok(e instanceof FPTInternalError);
                        assert.ok(e.InnerError instanceof SyntaxError);
                        assert.strictEqual(e.message,"A bad result was recieved from the main FPT app.");

                        return true;
                    },undefined);
                };
            };

            dataset.forEach(data => {
                it(JSON.stringify(data),getTest(data));
            });
        });
    });
});