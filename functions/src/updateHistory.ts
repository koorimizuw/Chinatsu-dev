import { func, firestore, timezone } from "./config";
import { getUid } from "./util";
export const updateHistory = func.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");

  const body = req.body;

  if (!body.key || !body.playlog) {
    res.status(400).send({ message: "No key or payload in body." });
    return;
  }

  const uid = (await getUid(body.key).catch((_) => {
    res.status(400).send({ message: "Get user info failed." });
  })) as string;

  for (let log of body.playlog) {
    const playDate = new Date(log["play_date"] + timezone).getTime() / 1000;
    await firestore
      .collection("data")
      .doc(uid)
      .collection("history")
      .doc(String(playDate))
      .set(log);
  }

  res.status(200).send({ message: "Data saved." });
});
