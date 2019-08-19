//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import { DotNetCoreFPTAppMapper, promisifiedExec } from '../DotNetCoreFPTAppMapper';
import { FPTException } from '../FPTException';
import { Level } from '../Level';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {

    // Defines a Mocha unit test
    test("Something 1", function() {
        assert.equal(-1, [1, 2, 3].indexOf(5));
        assert.equal(-1, [1, 2, 3].indexOf(0));
    });
});
suite("DotNetCoreFptAppMapper", function() {

    suite("runCommand should",function(){

        test("throw the serialized FPTException recieved",function(){
            let exception : FPTException = {
                Type:"type",
                Message:"message",
                InnerException: null
            };
            let fakeExec : promisifiedExec = async function(command : string):Promise<{stdout:string,stderr:string}>{
                let serializedException = JSON.stringify(exception);
                return {stdout:serializedException,stderr:""};
            };
            let mapper = new DotNetCoreFPTAppMapper(".",fakeExec);
            
            return assert.rejects(function(){ return mapper.runCommand(); },exception);
        });
        test("return deserialized object from serialized string",async function(){
            let object : any = {Lmfao:"bruh",IsNerd:true};
            let fakeExec : promisifiedExec = async function(command: string):Promise<{stdout:string,stderr:string}>{
                let serializedObject = JSON.stringify(object);
                return {stdout:serializedObject,stderr:""};
            };
            let mapper = new DotNetCoreFPTAppMapper(".",fakeExec);

            return assert.deepStrictEqual(await mapper.runCommand(),object);
        });
    });
    suite("getLevels should",function(){
        test("throw an error when there are faulty objects in the array recieved",function(){
            let level : Level = {
                Name:"yodel",
                Id:"yodel",
                InstructionsFilepath:"yodel",
                VerifierFilepath:"yodel",
                FolderPath: "yodel"
            };
            let object : any[] = [level,"meep"];
            let fakeExec : promisifiedExec = async function(command: string):Promise<{stdout:string,stderr:string}>{
                let serializedObject = JSON.stringify(object);
                return {stdout:serializedObject,stderr:""};
            };
            let mapper = new DotNetCoreFPTAppMapper(".",fakeExec);
            
            return assert.rejects(function(){return mapper.getLevels();},Error("A bad object was recieved from runCommand."));
        });
        test("return serialized level array", async function(){
            let object : Level[] = [{
                Name:"yodel",
                Id:"yodel",
                InstructionsFilepath:"yodel",
                VerifierFilepath:"yodel",
                FolderPath:"yodel"
            },{
                Name:"Bojack",
                Id:"Horseman",
                InstructionsFilepath:"Mr",
                VerifierFilepath:"Adult",
                FolderPath:"Man"
            }];
            let fakeExec : promisifiedExec = async function(command:string):Promise<{stdout:string,stderr:string}>{
                let serializedObject = JSON.stringify(object);
                return {stdout:serializedObject,stderr:""};
            };
            let mapper = new DotNetCoreFPTAppMapper(".",fakeExec);

            return assert.deepStrictEqual( await mapper.getLevels(),object);
        });
    });
    
});