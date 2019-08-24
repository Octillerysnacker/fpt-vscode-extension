//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import { DotNetCoreFPTApp } from '../DotNetCoreFPTApp';
import { FPTInternalError } from '../FPTInternalError';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';
type promisifiedExec = (command: string) => Promise<{ stdout: string }>;

describe("DotNetCoreFPTApp", function () {
    describe("runAsync", function () {
        describe("should deserialize and return serialized object", function () {
            let dataset: any[] = [{ Hi: "pie", Id: "random" }, "The quick rown fox", 1, 3.14];

            let getTest = (data: any) => {
                return async function () {
                    let fakeExec: promisifiedExec = async function () {
                        return { stdout: JSON.stringify(data) };
                    };
                    let app = new DotNetCoreFPTApp(fakeExec, "");

                    let result = await app.runAsync();

                    assert.deepStrictEqual(result, data);
                };
            };

            dataset.forEach(data => {
                it(JSON.stringify(data), getTest(data));
            });
        });
        describe("should throw FPTInteralError when invalid json recieved", function () {
            let dataset: string[] = ["yeet", "your feet", "{badObject:\"noot\"", "["];

            let getTest = (data: string) => {
                return async function () {
                    let fakeExec: promisifiedExec = async function () {
                        return { stdout: data };
                    };
                    let app = new DotNetCoreFPTApp(fakeExec, "");

                    return assert.rejects(app.runAsync(), function (e: any) {
                        assert.ok(e instanceof FPTInternalError);
                        assert.ok(e.InnerError instanceof SyntaxError);
                        assert.strictEqual(e.message, "A bad result was recieved from the main FPT app.");

                        return true;
                    }, undefined);
                };
            };

            dataset.forEach(data => {
                it(JSON.stringify(data), getTest(data));
            });
        });
        describe("does not swallow unknown exceptions", function () {
            let dataset: Error[] = [new Error(), new EvalError(), new RangeError()];

            let getTest = (data: Error) => {
                return async function () {
                    let fakeExec: promisifiedExec = async function () {
                        throw data;
                    };

                    let app = new DotNetCoreFPTApp(fakeExec, "");

                    return assert.rejects(app.runAsync(), data);
                };
            };

            dataset.forEach(data => {
                it(JSON.stringify(data), getTest(data));
            });
        });
        describe("sends correct command to exec", function () {
            interface Data {
                readonly CommandArray: string[];
                readonly AppFilePath: string;
                readonly Expected: string;
            }

            let dataset: Data[] = [{
                CommandArray: ["some", "lovely", "parameters"],
                AppFilePath: "some/file/path",
                Expected: "dotnet some/file/path some lovely parameters"
            },
            {
                CommandArray: ["different", "parameters", "this", "time"],
                AppFilePath: "a different file path",
                Expected: "dotnet a different file path different parameters this time"
            },
            {
                CommandArray: ["yet another", "test"],
                AppFilePath: "again",
                Expected: "dotnet again yet another test"
            }];

            let getTest = (data: Data) => {
                return async function () {
                    let result: string = "";
                    let fakeExec: promisifiedExec = async function (command: string) {
                        result = command;
                        return { stdout: "{}" };
                    };
                    let app = new DotNetCoreFPTApp(fakeExec, data.AppFilePath);

                    await app.runAsync(...data.CommandArray);

                    assert.strictEqual(result, data.Expected);
                };
            };

            dataset.forEach(data => {
                it(JSON.stringify(data), getTest(data));
            });
        });
    });
});