import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import "./firebase";

const auth = getAuth();

export const logIn = async ({ email, password }) => {
  let userObj;
  try {
    userObj = await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log("Login error: ", error);
  }

  return userObj;
};

export const logOut = async () => {
  console.log("logOut");
  try {
    await signOut(auth);
  } catch (error) {
    console.log("Logout error: ", error);
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email, undefined);
  } catch (error) {
    console.log("Logout error: ", error);
  }
};
