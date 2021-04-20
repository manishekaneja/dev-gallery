import React, { FC } from "react";

const Switch: FC<{
  text?: string;
  value: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}> = ({ value, onChange, text="" }) => {
  return (
    <label className="content flex items-center justify-center w-full ">
        <span className="px-4">
        {text}
        </span>
      <div className="switch">
        <input type="checkbox" checked={value} onChange={onChange} />
        <span className="slider round"></span>
      </div>
    </label>
  );
};
export default Switch;
