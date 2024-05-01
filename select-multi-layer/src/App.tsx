import { useState } from "react";
import Select from "./components/Select";
import { city } from "./data";
import { translateOriginDataToTree } from "./utils";
import { OptionType } from "./type";

import "./App.css";

function App() {
  const options = translateOriginDataToTree(city);

  const defaultValue: string | undefined = "1-2-1";
  /* 选中的值 */
  const [value, setValue] = useState<string | undefined>(defaultValue);

  const onChange = (selectedKey: string, selectedOption: OptionType) => {
    console.log(selectedKey, selectedOption);
    setValue(selectedOption.label);
  };

  return (
    <>
      <div>
        <p>受控Select</p>
        <Select options={options} value={value} onChange={onChange} />
      </div>
      <br />
      <div>
        <p>非受控Select</p>
        <Select options={options} />
      </div>
    </>
  );
}

export default App;
