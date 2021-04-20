import firebase from "firebase";
import { motion, Variants } from "framer-motion";
import React, { FC, useCallback, useRef } from "react";
import { projectFirestore } from "..";

const ImageBox: FC<{
  isSelected: boolean;
  user: string;
  isPublic?: boolean;
  onClick: () => void;
  askLogin: () => void;

  getUpdatedArray: (url: string) => Array<{ url: string; liked: boolean }>;
  image: { url: string; liked: boolean };
  onUploadAction: (user: string) => void;
}> = ({
  isSelected,
  onClick,
  isPublic,
  askLogin,
  image,
  user,
  onUploadAction,
  getUpdatedArray,
}) => {
  const variants = useRef<Variants>({
    selected: {
      zIndex: 20,
      opacity: 1,
    },
    unselected: {
      zIndex: 0,
      opacity: 1,
      transition: {
        delay: 0.3,
      },
    },
  }).current;
  const bgVariants = useRef<Variants>({
    selected: {
      backgroundColor: "#333333a3",
    },
    unselected: {
      backgroundImage: `url(${image.url})`,
      backgroundColor: "#333333",
      transition: {
        delay: 0.3,
      },
    },
  }).current;
  const optionsVariants = useRef<Variants>({
    selected: {
      height: "fit-content",
      opacity: 1,
    },
    unselected: {
      height: "0px",
      opacity: 0,
      display: "none",
    },
  }).current;

  const removeImage = useCallback(
    (image) => {
      projectFirestore
        .doc(`devGallery/${user}`)
        .update({
          images: firebase.firestore.FieldValue.arrayRemove(image),
        })
        .then(() => {
          onUploadAction(user);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [user, onUploadAction]
  );
  const likeImage = useCallback(
    (image) => {
      projectFirestore
        .doc(`devGallery/${user}`)
        .update({
          images: getUpdatedArray(image.url),
        })
        .then(() => {
          onUploadAction(user);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [user, onUploadAction, getUpdatedArray]
  );
  const addPublicImage = useCallback(
    (image) => {
      if (user) {
        projectFirestore
          .doc(`devGallery/${user}`)
          .update({
            images: firebase.firestore.FieldValue.arrayUnion({
              url: image.url,
              liked: false,
            }),
          })
          .then(() => {
            onUploadAction(user);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        askLogin();
      }
    },
    [user, onUploadAction,askLogin]
  );

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
      }}
      onClick={onClick}
      variants={variants}
      animate={isSelected ? "selected" : "unselected"}
      className={`w-full max-h-96 h-96 z-0 ${isSelected ? "" : " shadow-md"}`}
    >
      <motion.div
        layout
        animate={isSelected ? "selected" : "unselected"}
        variants={bgVariants}
        className={`w-full h-full flex items-center justify-center bg-center flex-col  ${
          isSelected ? "fixed  top-0 left-0 z-20 p-5" : "opacity-90"
        }`}
      >
        <motion.img
          layout
          animate={{ maxHeight: isSelected ? "60%" : "100%" }}
          className="h-full max-h-full object-cover"
          src={image && image.url}
        />
        {!isPublic && (
          <motion.div
            layout
            className=""
            animate={isSelected ? "selected" : "unselected"}
            variants={optionsVariants}
          >
            <motion.button
              layout
              className="bg-green-300 w-36 mx-1 my-2 p-2"
              transition={{ delay: 0.3 }}
              onClick={(event) => {
                event.stopPropagation();
                likeImage(image);
              }}
            >
              {image.liked ? "Remove from Fav" : "Add to Fav"}
            </motion.button>
            {!image.liked && (
              <motion.button
                layout
                transition={{ delay: 0.3 }}
                className="bg-red-300 w-36 mx-1 my-2 p-2"
                onClick={(event) => {
                  event.stopPropagation();
                  removeImage(image);
                }}
              >
                Delete
              </motion.button>
            )}
          </motion.div>
        )}
        {isPublic && (
          <motion.div
            layout
            className=""
            animate={isSelected ? "selected" : "unselected"}
            variants={optionsVariants}
          >
            <motion.button
              layout
              className="bg-green-300 w-36 mx-1 my-2 p-2"
              transition={{ delay: 0.3 }}
              onClick={(event) => {
                event.stopPropagation();
                addPublicImage(image);
              }}
            >
              Add to Personal
            </motion.button>
            {/* <motion.button
              layout
              transition={{ delay: 0.3 }}
              className="bg-red-300 w-36 mx-1 my-2 p-2"
              onClick={(event) => {
                event.stopPropagation();
                removeImage(image);
              }}
            >
              Request to Delete
            </motion.button> */}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ImageBox;
