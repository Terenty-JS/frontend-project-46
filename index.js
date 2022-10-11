import { cwd } from 'node:process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import _ from 'lodash';

const getfilepath = (filepath) => resolve(cwd(), filepath);
const readFile = (path) => readFileSync(path, 'utf-8');
const parsesFile = (file) => JSON.parse(file);

const getDiff = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const keys = _.sortBy(_.union(keys1, keys2));
  
    const result = keys.map((key) => {
      const value1 = obj1[key];
      const value2 = obj2[key];
  
      if (_.isEqual(value1, value2)) {
        return {
          type: 'noChanges',
          key,
          value: value1,
        };
      }
      if (value1 && value2 && value1 !== value2) {
        return {
          type: 'changed',
          key,
          value1,
          value2,
        };
      }
      if (!Object.hasOwn(obj2, key)) {
        return {
          type: 'deleted',
          key,
          value: value1,
        };
      }
      if (!Object.hasOwn(obj1, key)) {
        return {
          type: 'added',
          key,
          value: value2,
        };
      }
    });
    return result;
  };

const gendiff = (filepath1, filepath2) => {
    const file1 = readFile(getfilepath(filepath1));
    const file2 = readFile(getfilepath(filepath2));
  
    const informationDiff = getDiff(parsesFile(file1), parsesFile(file2));
    const result = informationDiff.map((diff) => {
      const typeDiff = diff.type;
      switch (typeDiff) {
        case 'deleted':
          return `  - ${diff.key}: ${diff.value}`;
        case 'noChanges':
          return `    ${diff.key}: ${diff.value}`;
        case 'changed':
          return `  - ${diff.key}: ${diff.value1} \n  + ${diff.key}: ${diff.value2}`;
        case 'added':
          return `  + ${diff.key}: ${diff.value}`;
        default:
          return null;
      }
    });
    return `{\n${result.join('\n')}\n}`;
  };

export default gendiff