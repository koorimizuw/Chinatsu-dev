import { func, firestore } from "./config";
import { scoreDataItem } from "./types";

export const getMusicData = func.onCall(async (_, ctx) => {
  if (!ctx.auth) {
    return {};
  }

  const uid = ctx.auth.uid;

  const scoreData: scoreDataItem[] = [];

  const querySnapshot = await firestore
    .collection("data")
    .doc(uid)
    .collection("score")
    .get();

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    for (const id in data) {
      if (!data[id].rank) {
        continue;
      }
      scoreData.push(data[id]);
    }
  });

  return scoreData;
});
