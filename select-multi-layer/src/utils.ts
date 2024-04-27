/**
 * 实现将原始数据转换为树形结构的函数
 *
 * const treeCity = [
 * 	{
 * 		key: '1',
 * 		label: '广东省',
 * 		children: [
 *       {
 *         key: '1-1',
 *         label: '广州市'，
 *         children: [...]
 *       },
 *       {
 *         key: '1-2',
 *         label: '佛山市'，
 *         children: [...]
 *       },
 * 		]
 * 	}
 * ]
 */
export const translateOriginDataToTree = (data: string[]) => {
  const result = data.reduce((acc, item) => {
    const arr = item.split("/");
    buildChildrenRecursive(arr, "", acc);
    return acc;
  }, []);

  return result;
};

const buildChildrenRecursive = (
  arr: string[],
  parentId: string,
  result: []
) => {
  const label = arr.shift();

  const existedObj = result.find((item) => item.label === label);
  if (existedObj) {
    buildChildrenRecursive(arr, existedObj.key, existedObj.children);
  } else {
    const obj = {
      key: parentId
        ? `${parentId}-${result.length + 1}`
        : `${result.length + 1}`,
      label,
      children: [],
    };
    if (arr.length) {
      buildChildrenRecursive(arr, obj.key, obj.children);
    }
    result.push(obj);
  }
};


/**
 * Select组件内部对树结构数据插入family字段，记录每个节点到根节点的key路径
 */
export const insertFamily = (data) => {
  const result = data.map((item) => {
    item.family = [item.key];
    buildFamilyRecursive(item.family, item.children);
    return item;
  });

  return result;
}

const buildFamilyRecursive = (
  parentFamily: string[],
  children: []
) => {
  if (children.length) {
    return children.map((item) => {
      item.family = parentFamily.concat([item.key]);
      buildFamilyRecursive(item.family, item.children);
      return item;
    })
  }
};



/**
 * 通过key查找树中包含该字符串的所有树节点
 */
export const findNodesByKey = (data: [], key: string) => {
  const result = [];
  data.forEach((item) => {
    findTreeNodeByKey(item, key, result);
  });

  return result;
};

/**
 * 通过key查找树节点
 */
const findTreeNodeByKey = (
  node: { key: string; label: string; family: string[], children: [] },
  key: string,
  resultNodes: []
) => {
  if (node.family.includes(key)) {
    resultNodes.push(node);
  }

  if (node.children.length > 0) {
    for (const child of node.children) {
      const result = findTreeNodeByKey(child, key, resultNodes);
      if (result) {
        return result;
      }
    }
  }

  return null;
};


/**
 * 通过label查找树中包含该字符串的所有树节点
 */
export const findNodesByLabel = (data: [], str: string) => {
  const result = [];
  data.forEach((item) => {
    findTreeNodeByLabel(item, str, result);
  });

  return result;
};

/**
 * 通过label查找树节点
 */
const findTreeNodeByLabel = (
  node: { key: string; label: string; children: [] },
  str: string,
  resultNodes: []
) => {
  if (node.label.includes(str)) {
    resultNodes.push(node);
  }

  if (node.children.length > 0) {
    for (const child of node.children) {
      const result = findTreeNodeByLabel(child, str, resultNodes);
      if (result) {
        return result;
      }
    }
  }

  return null;
};

/**
 * 根据节点的key，解析出从该节点开始到根节点路径的所有节点的key
 * 例：节点key为'1-1-2-3', 期望解析出['1', '1-1', '1-1-2', '1-1-2-3']
 */
// export const findPathKeys = (key: string) => {
//   const parts = key.split("-");
//   return parts.reduce((acc, part) => {
//     if (acc.length > 0) {
//       acc.push(acc[acc.length - 1] + "-" + part);
//     } else {
//       acc.push(part);
//     }
//     return acc;
//   }, []);
// };

/**
 * 构建某个节点到根节点的路径
 */
export const constructNodePathToRoot = (node, treeData) => {
  /**
   * 节点的key不包含'-'表示为第一层的节点，没有父节点，此时直接返回
   */
  if (!node.key.includes("-")) {
    return [node];
  }

  const path = [];
  /**
   * 1. 获取node节点到根节点的keys
   */
  const keys = JSON.parse(JSON.stringify(node.family));
  /**
   * 2. 获取根节点
   */
  const rootkey = keys.shift();
  const rootNode = treeData.find((item) => item.key === rootkey);
  path.push(rootNode);

  /**
   * 3. 根节点到当前节点node之间的节点的keys
   * 参数的node已经知道子节点的label，不需要再对这个节点进行查找，所以pop一下，只保留父节点的keys
   */
  keys.pop();
  while (keys.length) {
    const key = keys.shift();
    const parentNode = rootNode.children.find((item) => item.key === key);
    path.push(parentNode);
  }

  /**
   * 4. 将当前子节点node也放入path
   */
  path.push(node);

  return path;
};