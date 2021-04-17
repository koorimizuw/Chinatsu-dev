import { func, firestore } from "./config";

export const getPlaylog = func.onCall(async (_, ctx) => {
  if (!ctx.auth) {
    return {};
  }

  const uid = ctx.auth.uid;

  const playlog = [];

  const querySnapshot = await firestore
    .collection("data")
    .doc(uid)
    .collection("history")
    .doc("info")
    .get();

  const data = querySnapshot.data();
  for (const item in data) {
    playlog.push(data[item]);
  }

  return playlog.reverse();
});
