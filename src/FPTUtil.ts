import { isArray } from "util";
import { Random } from "random-js";
export function isTArray<T>(objectArray: any, comparer: (object: any) => object is T): objectArray is T[] {
    return isArray(objectArray) && objectArray.every(comparer);
}
type looseObject = { [key: string]: any };

export function createRandomObject(
    random: Random, 
    maxNestingLevel: number, 
    minProperties: number, 
    maxProperties: number,
    allowedObjects : {
        makeBooleans?: boolean,
        makeIntegers?: boolean,
        makeStrings?: boolean,
        makeFloats?: boolean,
        makeObjects?: boolean,
    } = {
        makeBooleans: true,
        makeIntegers: true,
        makeStrings: true,
        makeFloats: true,
        makeObjects: true
    }) {
    let object: any;
    let b = 1000;//Random integer bounds. Totally arbritrary.
    let randomStringMaxLengths = 15;
    let options: ((() => boolean) | (() => number) | (() => string) | (() => looseObject))[] = [];
    if(allowedObjects.makeBooleans){
        options.push(random.bool);
    }
    if(allowedObjects.makeFloats){
        options.push(() => random.real(-b, b));
    }
    if(allowedObjects.makeIntegers){
        options.push(() => random.integer(-b, b));
    }
    if(allowedObjects.makeObjects){
        options.push(() => { return {}; });    
    }
    if(allowedObjects.makeStrings){
        options.push(() => random.string(random.integer(0, randomStringMaxLengths)));
    }

    let result: boolean | number | string | looseObject = random.pick(options)();
    if (result === {} && maxNestingLevel > 0) {
        let propertyCount = random.integer(minProperties, maxProperties);
        for (let i = 0; i < propertyCount; i++) {
            result[random.string(random.integer(1, randomStringMaxLengths))] = createRandomObject(random, maxNestingLevel - 1, minProperties, maxProperties);
        }
    }
    return result;
}