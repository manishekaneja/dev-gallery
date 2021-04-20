import firebase from "firebase/app";
import { useCallback, useEffect, useState } from "react";
import { projectAuth, projectFirestore } from "..";

export const useFirebaseAuthHook = () => {
  const [user, setUser] = useState<string>("");
  useEffect(() => {
    projectAuth.onAuthStateChanged((user) => {
      if (user && user.email) {
        setUser(user.email || "");
        projectFirestore.collection("devGallery").doc(user.email).set(
          {
            id: user.email,
          },
          {
            merge: true,
          }
        );
      } else {
        setUser("");
      }
    });
  }, []);

  const signOut = useCallback(() => {
    projectAuth.signOut();
  }, []);

  const googleLogin = useCallback(
    () => projectAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()),
    []
  );
  return { user, signOut, googleLogin };
};
