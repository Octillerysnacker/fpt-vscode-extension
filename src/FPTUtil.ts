import { isArray } from "util";

export function isTArray<T>(objectArray: any, comparer: (object: any) => object is T):objectArray is T[]{
    return isArray(objectArray) && objectArray.every(comparer);
}