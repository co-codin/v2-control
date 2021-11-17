export function toTree(dataset, key = 'id', parentKey = 'parent_id') {
    const hashTable = Object.create(null);
    dataset.forEach((item) => (hashTable[item[key]] = { ...item, children: [] }));
    let dataTree = [];
    dataset.forEach((item) => {
        if (item[parentKey]) hashTable[item[parentKey]].children.push(hashTable[item[key]]);
        else dataTree.push(hashTable[item[key]]);
    });
    dataTree = dataTree
        .map((item, index) => {
            return {
                ...item,
                children: dataTree[index].children.sort((a, b) => {
                    let ret = 0;
                    if (a.name < b.name) {
                        ret = -1;
                    }
                    if (a.name > b.name) {
                        ret = 1;
                    }
                    return ret;
                }),
            };
        })
        .sort((a, b) => {
            let ret = 0;
            if (a.name < b.name) {
                ret = -1;
            }
            if (a.name > b.name) {
                ret = 1;
            }
            return ret;
        });
    return dataTree;
}

export async function fetchAllEntries(loader) {
    let page = 1;
    let response = await loader(page);
    let items = response.data.data;
    while (response.data.meta.current_page < response.data.meta.last_page) {
        response = await loader(++page);
        items = items.concat(response.data.data);
    }
    return items;
}
