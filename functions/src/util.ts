import { firestore } from "./config";

export const getUid = async (key: string): Promise<string> => {
  const uidSnap = await firestore
    .collection("users")
    .where("key", "==", key)
    .get() as FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
  if (uidSnap.docs.length == 0) {
    return ''
  }
  return uidSnap.docs[0].data()["uid"]
}

export const getMusicInfo = async () => {
  const musicInfo: any = {}
  const QuerySnapshot = await firestore
    .collection("music")
    .get()

  for (let doc of QuerySnapshot.docs) {
    musicInfo[String(doc.data().music_id)] = doc.data()
  }

  return musicInfo
}

export const randomPassword = (len: number) => {
  let str = ""
  for (let i = 0; i < len; i = i + 8) {
    str += Math.random().toString(36).slice(-8)
  }
  return str
}

export const calcRank = (score: number) => {
  if (score === 0) {
    return null
  } else if (score === 1010000) {
    return "MAX"
  } else if (score >= 1007500) {
    return "SSS+"
  } else if (score >= 1000000) {
    return "SSS"
  } else if (score >= 990000) {
    return "SS"
  } else if (score >= 970000) {
    return "S"
  } else if (score >= 940000) {
    return "AAA"
  } else if (score >= 900000) {
    return "AA"
  } else if (score >= 850000) {
    return "A"
  } else if (score < 850000) {
    return ""
  }
  return null
}