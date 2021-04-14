import { func, firestore } from "./config";
import { randomPassword } from "./util";

type secretKey = {
  uid: string;
  key: string;
};

export const createKey = func.onCall(async (_, ctx) => {
  if (!ctx.auth) {
    return {};
  }

  const uid = ctx.auth.uid;
  const key = randomPassword(256);

  const resp: secretKey = {
    uid: uid,
    key: key,
  };

  await firestore.collection("users").doc(uid).set(resp, { merge: true });

  return resp;
});
