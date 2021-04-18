import { func, firestore } from "./config";

export const getKey = func.onCall(async (_, ctx) => {
  if (!ctx.auth) {
    return {};
  }

  const uid = ctx.auth.uid;

  const querySnapshot = await firestore.collection("users").doc(uid).get();
  const data = querySnapshot.data();
  let key = "";
  if (data) {
    key = data.key;
  }

  return key;
});
