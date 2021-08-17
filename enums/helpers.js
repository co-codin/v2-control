import { orderBy } from "lodash";

export function enumToSelectArray(enumObject) {
  const enumItems = enumObject.entries();
  const items = [];

  for (const [key, value] of enumItems) {
    items.push({
      value: key,
      text: value,
    })
  }

  return orderBy(items, ["text"]);
}
