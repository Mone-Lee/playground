import React, { useEffect, useState } from "react";

const List = ({ renderData, selectedKeys, handleSelect }) => {
  const [subRenderData, setSubRenderData] = useState([]);

  /**
   * 点击某一项时
   */
  const handleClick = (item) => {
    if (!item.children.length) {
      handleSelect(item);
    } else {
      setSubRenderData(item.children);
    }
  };

  /* 父级数据变化时，清空子级数据 */
  useEffect(() => {
    setSubRenderData([]);
  }, [renderData]);

  return (
    <div className="list">
      {renderData.map((item) => {
        return (
          <div key={item.key}>
            <div onClick={() => handleClick(item)}>
              <span
                style={{
                  color: selectedKeys.includes(item.key)
                    ? "#356dff"
                    : "#474f5e",
                }}
              >
                {item.label}
              </span>
              {!!item.children.length && <span>&gt;</span>}
            </div>
          </div>
        );
      })}

      {subRenderData && !!subRenderData.length && (
        <div style={{ position: "absolute", top: 0, left: 153 }}>
          <List
            renderData={subRenderData}
            selectedKeys={selectedKeys}
            handleSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
};

export default List;
