import { useState, useMemo } from "react";
import { city } from "./assets/data";
import {
  translateOriginDataToTree,
  findNodes,
  constructNodePathToRoot,
  findPathKeys,
} from "./assets/utils";
import List from "./list";

import "./App.css";

function App() {
  const treeData = translateOriginDataToTree(city);

  /* 输入框的值 */
  const [value, setValue] = useState("");
  /* 输入框focus状态 */
  const [focus, setFocus] = useState(false);
  /* 列表要渲染的数据 */
  const [renderData, setRenderData] = useState<[] | null>([]);
  /* 选中的值，只记录叶子节点的key */
  const [selectedKey, setSelectedKey] = useState("");

  const selectedPathKeys = useMemo(() => {
    return findPathKeys(selectedKey);
  }, [selectedKey]);

  /**
   * focus时, 默认显示第一列子元素
   */
  const handleFocus = () => {
    setFocus(true);
    setRenderData(treeData);
  };

  /**
   * 输入框内容变化时
   * 无值时，默认显示第一列
   * 有值时，根据输入框值查找节点
   *  1. 查到节点，输出父路径，用父路径和节点构建label
   *  2. 查不到节点，显示“no data”
   */
  const handleChange = (e) => {
    const value = e.target.value;
    setValue(e.target.value);

    if (!value) {
      setRenderData(treeData);
    }

    if (value) {
      const nodes = findNodes(treeData, value);

      if (nodes.length) {
        /** 深复制简单做，避免因为引用对象改到其他搜索结果的children */
        const copyNodes = JSON.parse(JSON.stringify(nodes));

        copyNodes.map((node) => {
          const path = constructNodePathToRoot(node, treeData);
          /* 构建父路径label */
          node.label = path.map((item) => item.label).join("/");
          return node;
        });
        setRenderData(copyNodes);
      } else {
        setRenderData(null);
      }
    }
  };

  /**
   * 点击某一项时
   */
  const handleSelect = (item) => {
    setSelectedKey(item.key);
    const value = item.label.split("/").pop();
    setValue(value);
    setFocus(false);
  };

  return (
    <>
      {/* 选择、编辑区 */}
      <input
        type="text"
        placeholder="输入框"
        value={value}
        onFocus={handleFocus}
        onChange={handleChange}
      />

      {/* 展示区 */}
      {focus && (
        <div>
          {renderData ? (
            <List
              renderData={renderData}
              selectedKeys={selectedPathKeys}
              setSelectedItem={(item) => handleSelect(item)}
            />
          ) : (
            "no data"
          )}
        </div>
      )}
    </>
  );
}

export default App;
