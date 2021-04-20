import { motion, Variants } from "framer-motion";
import React, { FC, useContext, useRef } from "react";
// import { BackdropContext } from "../App";
const Backdrop: FC<{ onClick?: () => void }> = ({ onClick }) => {
  // const { value: visible } = useContext(BackdropContext);
  const variants = useRef<Variants>({
    shown: {
      opacity: 0.5,
      height: "100vh",
      width: "100vw",
      left: "0%",
      top: "0%",
    },
    hidden: {
      opacity: 0,
      height: 0,
      width: 0,
      left: "50%",
      top: "50%",
    },
  }).current;
  return (
    <motion.div
      // animate={visible ? "shown" : "hidden"}
      variants={variants}
      transition={{ duration: 0.5 }}
      {...(!!onClick ? { onClick } : {})}
      className=" fixed  bg-gray-900 z-10"
    />
  );
};

export default Backdrop;
