import { useState, useEffect, useRef } from "react";
import {
  findNodesByLabel,
  constructNodePathToRoot,
  insertFamily,
  findNodesByKey,
} from "../utils";
import cloneDeep from 'lodash/cloneDeep'
import List from "./List";

import "../App.css";


function Select({ options, value, onChange }: { options: [], value?: string, onChange?: (selectedKey: string, selectedOption: {}) => void;}) {
  const familyOptions = useRef(insertFamily(options))

  const [searchValue, setSearchValue] = useState(value);
  /* 输入框focus状态 */
  const [focus, setFocus] = useState(false);
  /* 列表要渲染的数据 */
  const [renderData, setRenderData] = useState<[] | null>([]);
  /* 选中的值，只记录叶子节点 */
  const [selectedOption, setSelectedOption] = useState("");

  /**
   * 有初始值时 
   * 判断如果值是叶子节点，是则选中它，否则不选中
   */
  useEffect(() => {
    if (value) {
      const nodes = findNodesByKey(familyOptions.current, value);
      if (nodes.length === 1 && nodes[0].children.length === 0) {
        const selectedItem = nodes[0];
        setSelectedOption(selectedItem);
        setSearchValue(selectedItem.label)
        handleInputChange(selectedItem.label);
      }
    }
  }, [])

  /**
   * focus时, 默认显示第一列子元素
   */
  const handleInputFocus = () => {
    setFocus(true);
    setRenderData(familyOptions.current);
  };

  /**
   * 输入框内容变化时
   * 无值时，默认显示第一列
   * 有值时，根据输入框值查找节点
   *  1. 查到节点，输出父路径，用父路径和节点构建label
   *  2. 查不到节点，显示“no data”
   */
  const handleInputChange = (value: string) => {
    setSearchValue(value);

    if (!value) {
      setRenderData(familyOptions.current);
    }

    if (value) {
      const nodes = findNodesByLabel(familyOptions.current, value);

      if (nodes.length) {
        /** 深复制，避免因为引用对象改到其他搜索结果的children */
        const copyNodes = JSON.parse(JSON.stringify(nodes))

        copyNodes.forEach((node) => {
          const path = constructNodePathToRoot(node, familyOptions.current);
          /* 构建父路径label */
          node.label = path.map((item) => item.label).join("/");
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
    const label = item.label.split("/").pop();
    const resultItem = {...item, label};

    setSearchValue(label);
    setSelectedOption(resultItem);
    setFocus(false);
    onChange?.(item.key, resultItem);
  };

  return (
    <>
      {/* 选择、编辑区 */}
      <input
        type="text"
        placeholder="输入框"
        value={searchValue}
        onFocus={handleInputFocus}
        // onBlur={() => setFocus(false)}
        onChange={(e) => handleInputChange(e.target.value)}
      />

      {/* 展示区 */}
      {focus && (
        <div>
          {renderData ? (
            <List
              renderData={renderData}
              selectedKeys={selectedOption.family || []}
              handleSelect={handleSelect}
            />
          ) : (
            "no data"
          )}
        </div>
      )}
    </>
  );
}

export default Select;
