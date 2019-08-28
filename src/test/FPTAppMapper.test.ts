import { ILevel, isILevel } from "../ILevel";
import { Random } from "random-js";
import { createRandomLevel } from "../LevelExtensions";
import * as assert from "assert";
import { IFPTApp } from "../IFPTApp";
import { FPTAppMapper } from "../FPTAppMapper";
import { FPTBadObjectError } from "../FPTBadObjectError";
import { isTArray, createRandomObject } from "../FPTUtil";

describe("FPTAppMapper", function () {
    describe("getLevels", function () {
        describe("should return all levels from app", function () {
            let dataset: ILevel[][] = [];
            let setCount = 4;
            let random = new Random();
            let randomFieldLength = 10;
            for (let i = 0; i < setCount; i++) {
                dataset.push([]);
                for (let j = 0; j < random.integer(0, 9); j++) {
                    dataset[i].push(createRandomLevel(random, randomFieldLength));
                }
            }

            let getTest = (data: ILevel[]) => {
                return async function () {
                    let fakeFPTApp: IFPTApp = {
                        runAsync: async function () {
                            return data;
                        }
                    };
                    let mapper = new FPTAppMapper(fakeFPTApp);

                    let result = await mapper.getLevels();

                    assert.deepStrictEqual(result, data);
                };
            };

            dataset.forEach(data => {
                it(JSON.stringify(data), getTest(data));
            });
        });
        describe("should throw when an incorrect object is given", function () {
            let dataset: any[] = [{ Lmfao: "what" }, "brown fox", 333333, 3.14, new Error()];

            let getTest = function (data: any) {
                return async function () {
                    let expected = new FPTBadObjectError(
                        data,
                        "An object with an unexpected structure was recieved.");
                    let fakeFPTApp: IFPTApp = {
                        runAsync: async function () {
                            return data;
                        }
                    };
                    let mapper = new FPTAppMapper(fakeFPTApp);

                    return assert.rejects(function () { return mapper.getLevels(); }, expected);
                };
            };

            dataset.forEach(data => {
                it(JSON.stringify(data), getTest(data));
            });
        });
        it("should send correct parameters to app", async function () {
            let result: string[] = [];
            let fakeFPTApp: IFPTApp = {
                runAsync: async function (...command: string[]) {
                    result = command;
                }
            };
            let mapper = new FPTAppMapper(fakeFPTApp);

            try {
                await mapper.getLevels();
                assert.fail("No error was thrown.");
            } catch (e) {//error expected because an incorrect object is thrown
                assert.deepStrictEqual(result, ["levels"]);
            }
        });
    });
    describe("openLevel", function () {
        describe("should return path to project folder from app", function () {
            let random = new Random();
            let makeData = () => random.string(25);
            let dataset: string[] = [makeData(), makeData(), makeData(), makeData()];

            let getTest = (data: string) => {
                return async function () {
                    let app: IFPTApp = {
                        runAsync: async function (...command: string[]) {
                            return data;
                        }
                    };
                    let mapper = new FPTAppMapper(app);

                    let result = await mapper.openLevel("", "");

                    assert.strictEqual(result, data);
                };
            };

            dataset.forEach(data => {
                it(data, getTest(data));
            });
        });
        describe("should send the correct parameters to app", async function () {
            type dataType = { level: string, user: string };
            let random = new Random();
            let makeData = () => {
                return {
                    level: random.string(15),
                    user: random.string(15)
                };
            };
            let dataset: dataType[] = [makeData(), makeData(), makeData(), makeData()];

            let getTest = (data: dataType) => {
                return async function () {
                    let result: string[] = [];
                    let fakeFPTApp: IFPTApp = {
                        runAsync: async function (...command: string[]) {
                            result = command;
                        }
                    };
                    let mapper = new FPTAppMapper(fakeFPTApp);

                    try {
                        await mapper.openLevel(data.level, data.user);
                        assert.fail("No error was thrown.");
                    } catch (e) { //we expect an error to be thrown because an incorrect datatype was given
                        assert.deepStrictEqual(result, ["open", data.level, data.user]);
                    }
                };
            };

            dataset.forEach(data => {
                it(JSON.stringify(data), getTest(data));
            });
        });
        describe("should throw when an incorrect object is given", function () {
            let random = new Random();
            let makeData = () => createRandomObject(random, 3, 0, 4, { makeStrings: false });
            let dataset: any[] = [makeData(), makeData(), makeData(), makeData()];

            let getTest = (data: any) => {
                return async function () {
                    let fakeFPTApp: IFPTApp = {
                        runAsync: async function (...command: string[]) {
                            return data;
                        }
                    };
                    let mapper = new FPTAppMapper(fakeFPTApp);

                    return assert.rejects(mapper.openLevel("", ""), new FPTBadObjectError(data, "An object with an unexpected structure was recieved."));
                };
            };

            dataset.forEach(data => {
                it(JSON.stringify(data), getTest(data));
            });
        });
    });
    describe("getInstructions", function () {
        describe("should return instructions filepath", function () {
            let random = new Random();
            let makeData = () => random.string(35);
            let dataset: string[] = [makeData(), makeData(), makeData(), makeData()];

            let getTest = (data: string) => {
                return async function () {
                    let app: IFPTApp = {
                        runAsync: async function (...command: string[]) {
                            return data;
                        }
                    };
                    let mapper = new FPTAppMapper(app);

                    let result = await mapper.getInstructions("");

                    assert.equal(result, data);
                };
            };

            dataset.forEach((data) => {
                it(data, getTest(data));
            });
        });
        describe("should send correct parameters to app", function () {
            let random = new Random();
            let makeData = () => random.string(20);
            let dataset: string[] = [makeData(), makeData(), makeData(), makeData()];

            let getTest = (data: string) => {
                return async function () {
                    let result: string[] = [];
                    let app: IFPTApp = {
                        runAsync: async function (...command: string[]) {
                            result = command;
                        }
                    };
                    let mapper = new FPTAppMapper(app);

                    try {
                        await mapper.getInstructions(data);
                        assert.fail("No error was thrown.");
                    } catch{//we expect an error to be thrown since an incorrect object is returned
                        assert.deepStrictEqual(result, ["instructions", data]);
                    }
                };
            };

            dataset.forEach(data => {
                it(data, getTest(data));
            });
        });
        describe("should throw when an incorrect object is given", function () {
            let random = new Random();
            let makeData = () => createRandomObject(random, 3, 0, 4, { makeStrings: false });
            let dataset = [makeData(), makeData(), makeData(), makeData()];

            let getTest = (data: any) => {
                return async function () {
                    let app: IFPTApp = {
                        runAsync: async function (...command: string[]) {
                            return data;
                        }
                    };
                    let mapper = new FPTAppMapper(app);

                    return assert.rejects(mapper.getInstructions(""), new FPTBadObjectError(data, "An object with an unexpected structure was recieved."));
                };
            };

            dataset.forEach(data => {
                it(JSON.stringify(data), getTest(data));
            });
        });
    });
});