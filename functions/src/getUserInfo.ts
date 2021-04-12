import { func, firestore } from "./config";

export const getUserInfo = func.onCall(async (_, ctx) => {
  if (!ctx.auth) {
    return {}
  }

  const uid = ctx.auth.uid

  const profileSnap = await firestore
    .collection("data")
    .doc(uid)
    .collection("profile")
    .doc("info")
    .get()

  return profileSnap.data()
});
