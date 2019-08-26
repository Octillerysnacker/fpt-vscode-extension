import { ILevel, isILevel } from "../ILevel";
import { Random } from "random-js";
import { createRandomLevel } from "../LevelExtensions";
import * as assert from "assert";
import { IFPTApp } from "../IFPTApp";
import { FPTAppMapper } from "../FPTAppMapper";
import { FPTBadObjectError } from "../FPTBadObjectError";
import { isTArray } from "../FPTUtil";

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
    });
});