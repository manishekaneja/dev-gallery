import { motion, Variants } from "framer-motion";
import { FC, useRef } from "react";
const TabMenu: FC<{
  user: string;
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
  fetchPublicImages: () => void;
  fetchUserImages: (user: string) => void;
  askLogin: () => void;

}> = ({
  user,
  selectedTab,
  setSelectedTab,
  fetchPublicImages,
  fetchUserImages,
  askLogin
}) => {
  const selectedVarriant = useRef<Variants>({
    left: {
      translateX: "0%",
    },
    center: {
      translateX: "100%",
    },
  }).current;

  return (
    <div
      style={{ minHeight: 40 }}
      className="w-full border-red-300 border-2  h-10 flex items-center justify-around my-3 relative p-0"
    >
      <motion.div
        variants={selectedVarriant}
        transition={{duration:0.3}}
        animate={selectedTab === 0 ? "center" : "left"}
        className="absolute w-3/6 h-full bg-red-300 z-0 left-0 top-0"
      ></motion.div>
      <button
        className="flex-1 flex items-center justify-center z-10 focus:outline-none"
        onClick={() => {
          setSelectedTab(-1);
          fetchPublicImages();
        }}
      >
        Public
      </button>
      <button
        className={`flex-1 flex items-center justify-center z-10 focus:outline-none ${
          !user ? "cursor-not-allowed opacity-20" : " "
        } `}
        onClick={() => {
          if (user) {
            setSelectedTab(0);
            fetchUserImages(user);
          }
          else{
              askLogin();
          }
        }}
      >
        Personal
      </button>
    </div>
  );
};

export default TabMenu;
