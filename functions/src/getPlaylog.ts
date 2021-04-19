import { func, firestore } from "./config";

export const getPlaylog = func.onCall(async (_, ctx) => {
  if (!ctx.auth) {
    return {};
  }

  const uid = ctx.auth.uid;

  const querySnapshot = await firestore
    .collection("data")
    .doc(uid)
    .collection("history")
    .doc("info")
    .get();

  return Object.values({...querySnapshot.data()}).reverse();
});
