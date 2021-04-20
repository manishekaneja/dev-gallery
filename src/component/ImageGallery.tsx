import React, { FC, useRef, useState } from "react";
import { usePagination } from "../CustomHooks/usePagination";
import ImageBox from "./ImageBox";

const ImageGallery: FC<{
  list: Array<{ url: string; liked: boolean }>;
  user: string;
  isPublic?: boolean;
  updateRef?: any;
  askLogin: () => void;
  onUploadAction: (user: string) => void;
  getUpdatedArray: (url: string) => Array<{ url: string; liked: boolean }>;
}> = ({
  list,
  askLogin,
  onUploadAction,
  user,
  isPublic = false,
  updateRef,
  getUpdatedArray,
}) => {
  const throtle = useRef(false);
  const {
    page,
    nextPage,
    prePage,
    visibleList,
    hasNext,
    hasPrevious,
  } = usePagination(list, updateRef);
  const [selected, setSelected] = useState<number>(-1);
  return (
    <>
      <div className="grid grid-cols-1 grid-rows-6 sm:grid-rows-2 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full p-4 pb-10 relative">
        {visibleList.map((imageUrl,idx) => {
          return (
            <ImageBox
              onUploadAction={onUploadAction}
              user={user}
              askLogin={askLogin}
              isPublic={isPublic}
              key={imageUrl.url + idx}
              getUpdatedArray={getUpdatedArray}
              image={imageUrl}
              isSelected={imageUrl === selected}
              onClick={() => {
                if (throtle.current) {
                  return;
                }
                throtle.current = true;
                setTimeout(() => {
                  throtle.current = false;
                }, 500);
                setSelected((p) => {
                  if (p === imageUrl) {
                    return -1;
                  } else {
                    return imageUrl;
                  }
                });
              }}
            />
          );
        })}
      </div>
      {(hasPrevious || hasNext) && (
        <div className="w-full p-2 flex items-center justify-center">
          <button
            className="bg-green-300 w-28 mx-1 my-2 p-2"
            disabled={!hasPrevious}
            onClick={prePage}
          >
            Previous
          </button>
          <div className="flex items-center justify-center w-28 mx-1 my-2 p-2">
            {page + 1}
          </div>
          <button
            className="bg-green-300 w-28 mx-1 my-2 p-2"
            disabled={!hasNext}
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
