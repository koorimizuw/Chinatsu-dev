import { func, firestore } from "./config";

export const getRatingData = func.onCall(async (_, ctx) => {
  if (!ctx.auth) {
    return {};
  }

  const uid = ctx.auth.uid;

  const querySnapshot = await firestore
    .collection("data")
    .doc(uid)
    .collection("rating")
    .doc("info")
    .get();

  return querySnapshot.data();
});
