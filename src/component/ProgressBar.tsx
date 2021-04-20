import { motion } from "framer-motion";
import React, { FC } from "react";
const ProgressBar: FC<{ percent: number }> = ({ percent }) => {
  return (
    <div className="my-2 w-full h-1">
      <motion.div
        layout
        className="h-full bg-green-400"
        style={{ width: percent + "%" }}
      ></motion.div>
    </div>
  );
};

export default ProgressBar;
