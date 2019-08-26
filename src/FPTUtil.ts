import { isArray } from "util";
import {Random} from "random-js";
export function isTArray<T>(objectArray: any, comparer: (object: any) => object is T):objectArray is T[]{
    return isArray(objectArray) && objectArray.every(comparer);
}
type looseObject = {[key: string]: any};

export function createRandomObject(random: Random, maxNestingLevel: number,minProperties: number, maxProperties:number){
    let object : any;
    let b = 1000;//Random integer bounds. Totally arbritrary.
    let randomStringMaxLengths = 15;
    let options:((() => boolean) | (() => number) | (() => string) | (() => looseObject))[] = [
        random.bool,
        () => random.integer(-b,b),
        () => random.string(random.integer(0,randomStringMaxLengths)),
        () => random.real(-b,b),
        () => {return {};}];
    let result : boolean | number | string | looseObject = random.pick(options)();
    if(result === {} && maxNestingLevel > 0){
        let propertyCount = random.integer(minProperties, maxProperties);
        for(let i = 0;i<propertyCount;i++){
            result[random.string(random.integer(1,randomStringMaxLengths))] = createRandomObject(random,maxNestingLevel - 1,minProperties,maxProperties);
        }
    }
    return result;
}