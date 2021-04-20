import { motion } from "framer-motion";
import React, { useState } from "react";
import Header from "./component/Header";
import ImageGallery from "./component/ImageGallery";
import ImageUploader from "./component/ImageUploader";
import Switch from "./component/Switch";
import TabMenu from "./component/TabMenu";
import { useFirebaseAuthHook } from "./CustomHooks/useFirebaseAuthHook";
import { useFirebaseImagesUpdater } from "./CustomHooks/useFirebaseImagesUpdater";
function App() {
  const { user, googleLogin, signOut } = useFirebaseAuthHook();
  const {
    imageList,
    publicImageList,
    fetchUserImages,
    fetchPublicImages,
  } = useFirebaseImagesUpdater(user);

  const [selectedTab, setSelectedTab] = useState<number>(-1);
  const [onlyFav, setOnlyFav] = useState(false);
  const [lFlag, setLFlag] = useState(false);

  return (
    <div className="bg-gray-100 w-screen  h-screen overflow-y-auto ">
      <div className="max-w-5xl m-auto w-full h-full flex items-center flex-col ">
        <Header />
        {selectedTab !== 1 && (
          <ImageUploader
            {...{ googleLogin, signOut }}
            isPublic={selectedTab === -1}
            onUploadAction={
              selectedTab === -1 ? fetchPublicImages : fetchUserImages
            }
            bucket={
              selectedTab === -1 ? `devGallery/public` : `devGallery/${user}`
            }
            user={user}
            text={selectedTab === -1 ? "Post a Public Photo" : "Post a Photo"}
          />
        )}

        <TabMenu
          {...{
            fetchUserImages,
            setSelectedTab,
            selectedTab,
            user,
            fetchPublicImages,
            askLogin: () => {
              setLFlag(true);
            },
          }}
        />
        {selectedTab === 0 && (
          <Switch
            value={onlyFav}
            text="Show Only Favourite"
            onChange={({ target: { checked } }) => {
              setOnlyFav(checked);
            }}
          />
        )}
        {selectedTab === 0 ? (
          <ImageGallery
            onUploadAction={fetchUserImages}
            user={user}
            list={onlyFav ? imageList.filter((e) => e.liked) : imageList}
            getUpdatedArray={(url) =>
              imageList.map((image) => ({
                ...image,
                liked: url === image.url ? !image.liked : image.liked,
              }))
            }
            askLogin={() => {
              setLFlag(true);
            }}
            updateRef={selectedTab}
          />
        ) : (
          <ImageGallery
            onUploadAction={fetchPublicImages}
            user={user}
            isPublic={true}
            askLogin={() => {
              setLFlag(true);
            }}
            getUpdatedArray={(url) => publicImageList}
            list={publicImageList}
            updateRef={selectedTab}
          />
        )}
      </div>
      {!user && lFlag && (
        <motion.div
          layout
          initial={{ opacity: 0, width: 0, height: 0, top: "50%", left: "50%" }}
          animate={{
            opacity: 1,
            width: "100vw",
            height: "100vh",
            top: 0,
            left: 0,
            backgroundColor: "#333333c3",
          }}
          transition={{
            duration: 0.5,
          }}
          exit={{ opacity: 0 }}
          className="fixed w-screen h-screen z-50 flex justify-center items-center top-0 left-0 overflow-auto py-4 px-2"
        >
          <motion.div className="m-2 p-2 bg-white flex flex-col items-center">
            <p className="text-lg font-extrabold">
              Oops!!! You not are not loggin in yet.
            </p>
            <p className="text-sm mb-6">
              Use you Google Account to Login and access all features
            </p>
            <div>
              <button
                className="bg-purple-300 border-2 text-sm border-purple-300 mx-2 text-gray-800 px-2 w-48 py-1 focus:outline-none"
                onClick={googleLogin}
              >
                Google Login
              </button>
              <button
                className="bg-red-300 border-2 text-sm border-red-300 mx-2 text-gray-800 px-2 w-48 py-1 focus:outline-none"
                onClick={() => setLFlag(false)}
              >
                Close{" "}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
