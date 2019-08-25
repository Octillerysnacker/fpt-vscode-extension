import { ILevel } from "../ILevel";
import { Random } from "random-js";
import { createRandomLevel } from "../LevelExtensions";
import * as assert from "assert";
import { IFPTApp } from "../IFPTApp";
import { FPTAppMapper } from "../FPTAppMapper";

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
                it(JSON.stringify(data),getTest(data));
            });
        });
    });
});