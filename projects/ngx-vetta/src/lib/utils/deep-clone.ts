export function deepClone<T>(value: T): T {
  let clonedValue: any = null;

  if (isStringOrNumber(value)) return value;

  if (isArray(value)) {
    const itemArray = Object.assign<Array<any>, T>([], value);
    clonedValue = itemArray;

    for (let i = 0; i < (clonedValue as Array<any>).length; i++) {
      clonedValue[i] = deepClone(clonedValue[i]);
    }

    return clonedValue as T;
  }

  if (isObject(value)) {
    const item = Object.assign({}, value);
    clonedValue = item;
    const allKeys = Object.keys(clonedValue);

    for (let j = 0; j < allKeys.length; j++) {
      const key = allKeys[j];
      if (isArray(clonedValue[key])) {
        // if the value is ARRAY
        clonedValue[key] = deepClone(clonedValue[key]);
      } else if (clonedValue[key] instanceof Date) {
        clonedValue[key] = new Date(clonedValue[key].valueOf());
      } else if (isObject(clonedValue[key])) {
        // if the value is OBJECT
        clonedValue[key] = deepClone(clonedValue[key]);
      }
    }

    return clonedValue as T;
  }

  return value;
}

const isStringOrNumber = <T>(value: T): boolean => {
  return typeof value === 'string' || typeof value === 'number';
};

const isObject = <T>(value: T): boolean => {
  return value && typeof value === 'object' && value.constructor === Object;
};

const isArray = <T>(value: T): boolean => {
  return Array.isArray(value) && value instanceof Array;
};
