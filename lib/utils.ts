import { Console } from "node:console";
import { stderr, stdout } from "node:process";

export class Logger extends Console {
  constructor(constext = "") {
    super(stdout, stderr);
  }

  verbose(message: string) {
    this.debug(message);
  }
}

export function mergeObjects(obj1: any, obj2: any): any {
  const result: any = {};

  // get union of keys of both objects
  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  keys.forEach((key) => {
    // if both have the property and its an array, combine them
    if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      result[key] = [...obj1[key], ...obj2[key]];
    }
    // if only one of them has the key, take it
    else if (key in obj1 && !(key in obj2)) {
      result[key] = obj1[key];
    } else if (key in obj2 && !(key in obj1)) {
      result[key] = obj2[key];
    }
    // if both are objects recursive!
    else if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
      result[key] = mergeObjects(obj1[key], obj2[key]);
    } 
  });

  return result;
}
