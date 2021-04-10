import { func, firestore, timezone } from "./config";

export const updateHistory = func.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set("Access-Control-Allow-Headers", "*");

  const body = req.body

  if (!body.key || !body.playlog) {
    res.status(400).send({ "message": "No key or payload in body." })
    return
  }

  for (let log of body.playlog) {
    await firestore
      .collection("users")
      .where("key", "==", body.key)
      .get()
      .then(async v => {
        const uid: string = v.docs[0].data()["uid"]
        await firestore
          .collection("data")
          .doc(uid)
          .collection("history")
          .doc(String(new Date(log["playDate"] + timezone).getTime() / 1000))
          .set(log)
      })
      .catch(_ => {
        res.status(400).send({ "message": "Read firebase failed." })
      })
  }

  res.status(200).send({ "message": "Data saved." })
});