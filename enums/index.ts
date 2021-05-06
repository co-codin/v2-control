import { Status } from './Status';

export function toSelectArray(e: object): object[] {
  return Object.keys(e).map(key => {
    return {
      // @ts-ignore
      value: e[key],
      text: key,
    }
  });
}

export default {};
