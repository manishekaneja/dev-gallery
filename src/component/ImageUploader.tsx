import firebase from "firebase";
import { motion } from "framer-motion";
import React, { FC, useCallback, useRef, useState } from "react";
import { projectFirestore, projectStorage } from "..";
import ProgressBar from "./ProgressBar";

const ImageUploader: FC<{
  user: string;
  bucket: string;
  onUploadAction: (user: string) => void;
  text: string;
  isPublic: boolean;
  googleLogin: () => Promise<firebase.auth.UserCredential>;
  signOut: () => void;
}> = ({
  user,
  onUploadAction,
  bucket,
  text,
  isPublic,
  googleLogin,
  signOut,
}) => {
  const [isUploadActive, setIsUploadActive] = useState<boolean>(false);
  const [isConverted, setIsConverted] = useState<boolean>(false);
  const imageTag = useRef<HTMLImageElement>(null);
  const bgDiv = useRef<HTMLDivElement>(null);
  const [uplaodedPercentage, setUplaodedPercentage] = useState<number>(0);
  const [flag, setFlag] = useState(false);
  const uploadFileIntoStorage = useCallback(() => {
    if (flag) {
      return;
    }
    setFlag(true);
    if (imageTag.current && imageTag.current.src) {
      const reference = projectStorage.ref(Date.now().toString());
      reference
        .putString(imageTag.current.src.split(",")[1], "base64", {
          contentType: imageTag.current.src.split(";")[0].split("data:")[0],
        })
        .on("state_changed", {
          next: (snap) => {
            setUplaodedPercentage(
              (100 * snap.bytesTransferred) / snap.totalBytes
            );
          },
          error: (err) => {
            console.log(err);
            setFlag(true);
          },
          complete: async () => {
            const url = await reference.getDownloadURL();
            projectFirestore
              .doc(bucket)
              .update({
                images: firebase.firestore.FieldValue.arrayUnion({
                  url,
                  liked: false,
                }),
              })
              .then(() => {
                setIsUploadActive(false);
                setIsConverted(false);
                onUploadAction(user);
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                setFlag(true);
              });
          },
        });
    }
  }, [user, onUploadAction, bucket, flag]);

  const modalOpen = useCallback(() => {
    setIsUploadActive(true);
  }, []);

  const modalClose = useCallback(() => {
    setIsUploadActive(false);
    setIsConverted(false);
  }, []);

  const onFileSelect = useCallback(({ target: { files } }) => {
    if (files && files.length <= 0) {
      return;
    }
    const file: File | undefined | null = files?.item(0);
    if (!file) {
      return;
    }
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(this.result as string);
      };
      reader.onerror = function (error) {
        reject(error);
      };
    })
      .then((base64String) => {
        if (imageTag.current) {
          imageTag.current.src = base64String;
          if (bgDiv.current) {
            bgDiv.current.style.backgroundImage = `url(${base64String})`;
          }
        }
        setIsConverted(true);
      })
      .catch((error) => {
        console.log({ error });
      });
  }, []);

  return (
    <div className="py-4">
      {!user ? (
        <button
          className="bg-purple-300 border-2 border-purple-300 mx-2 text-gray-800 px-4 w-48 py-2 focus:outline-none"
          onClick={googleLogin}
        >
          Google Login
        </button>
      ) : (
        <>
          <button
            className="bg-purple-300 border-2 border-purple-300 mx-2 text-gray-800 px-4 w-48 py-2 focus:outline-none"
            onClick={signOut}
          >
            Log Off
          </button>
        </>
      )}

      <button
        className="border-gray-800  border-2 mx-2 border-solid px-4 py-2 w-48 focus:outline-none"
        disabled={isUploadActive}
        onClick={modalOpen}
      >
        {text}
      </button>
      {isUploadActive && (
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
          className="fixed w-screen h-screen z-50 flex justify-center items-center top-0 left-0 overflow-auto py-4"
        >
          <motion.div
            layout
            className="bg-white p-4 w-full max-w-5xl z-10 h-96 shadow-xl flex flex-col"
          >
            {!isConverted && (
              <div className="border-2 border-dashed flex-1 border-green-300 flex items-center justify-center">
                <label className="bg-green-300 p-3 text-gray-700 font-bold cursor-pointer">
                  <input
                    multiple={false}
                    type="file"
                    accept="image/*"
                    className=" hidden"
                    onChange={onFileSelect}
                  />
                  Select Image
                </label>
              </div>
            )}

            <div
              className={`border-2 border-solid flex-1 max-h-96  overflow-hidden border-green-300 flex items-center justify-center  relative ${
                isConverted ? "" : " hidden  "
              }`}
            >
              <div
                ref={bgDiv}
                className="w-full z-0 opacity-30 bg-center bg-no-repeat bg-cover blur-3xl h-full absolute top-0 left-0"
              />
              <img ref={imageTag} className="z-10 h-full" src="" alt="img" />
            </div>
            {isPublic && (
              <p className="text-sm">
                *Please note that this is a public space.Once uploaded you won't
                be able to remove your image
              </p>
            )}
            <ProgressBar percent={uplaodedPercentage} />
            <div className="m-2 w-full flex justify-center">
              {isConverted && (
                <button
                  className="bg-green-400 w-28 mx-1 p-2"
                  onClick={uploadFileIntoStorage}
                >
                  Upload
                </button>
              )}
              <button className="bg-red-300 w-28 mx-1 p-2" onClick={modalClose}>
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ImageUploader;
