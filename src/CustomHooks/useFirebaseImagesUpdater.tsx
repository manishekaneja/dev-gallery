import { useCallback, useEffect, useState } from "react";
import { projectFirestore } from "..";

export const useFirebaseImagesUpdater = (user: string) => {
  const [imageList, setImageList] = useState<
    Array<{ url: string; liked: boolean; }>
  >([]);
  const [publicImageList, setPublicImageList] = useState<
    Array<{ url: string; liked: boolean; }>
  >([]);

  const fetchUserImages = useCallback((user: string) => {
    if (user) {
      projectFirestore
        .doc(`devGallery/${user}`)
        .get()
        .then((snap) => {
          const data = snap.data() as {
            images: Array<{ url: string; liked: boolean; }>;
          };
          if (data && "images" in data) {
            setImageList(data.images);
          } else {
            setImageList([]);
          }
        });
    }
  }, []);
  const fetchPublicImages = useCallback(() => {
    projectFirestore
      .doc(`devGallery/public`)
      .get()
      .then((snap) => {
        const data = snap.data() as {
          images: Array<{ url: string; liked: boolean; }>;
        };
        if (data && "images" in data) {
          setPublicImageList(data.images);
        } else {
          setPublicImageList([]);
        }
      });
  }, []);
  useEffect(() => {
    fetchPublicImages();
    if (user) {
      fetchUserImages(user);
    }
  }, [user, fetchUserImages, fetchPublicImages]);
  return { imageList, fetchUserImages, fetchPublicImages, publicImageList };
};
