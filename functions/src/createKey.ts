import { func, firestore } from "./config";

const randomPassword = (len: number) => {
  let str = ""
  for (let i = 0; i < len; i = i + 8) {
    str += Math.random().toString(36).slice(-8)
  }
  return str
}

type secretKey = {
  uid: string,
  key: string
}

export const createKey = func.onCall(async (_, ctx) => {
  if (!ctx.auth) {
    return {} as secretKey
  }

  const uid = ctx.auth?.uid
  const key = randomPassword(256)

  await firestore.collection("users").doc(uid).set({
    "uid": uid,
    "key": key
  }, { merge: true })

  return {
    "uid": uid,
    "key": key,
  } as secretKey
});
