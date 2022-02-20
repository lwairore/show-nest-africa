/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns newObject a new object based on obj1 and obj2
 */
export function mergeObjects(objects = []) {
    const newObject = {};

    for (const objectItem of objects) {
        for (const attrname in objectItem) {
            newObject[attrname] = objectItem[attrname];
        }
    }
   
    return newObject;
}
