import { orderBy } from "lodash";

export function enumToSelectArray(_enum)
{
  const items = _enum instanceof Map
    ? prepareMapEnumItems(_enum)
    : prepareObjectEnumItems(_enum);

  return orderBy(items, ["text"]);
}

function prepareObjectEnumItems(objectEnum) {
  const enumItems = Object.entries(enumObject);
  const items = [];

  for (const [key, value] of enumItems) {
    items.push({
      value: value,
      text: key,
    })
  }
}

function prepareMapEnumItems(mapEnum) {
  const items = [];
  mapEnum.forEach(([value, key]) => {
    console.log(value, key);
  })
  return items;
}
