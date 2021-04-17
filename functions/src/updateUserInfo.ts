import { func, firestore } from "./config";
import { getUid } from "./util";

export const updateUserInfo = func.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "86400");
    res.status(204).send("");
  } else if (req.method === "POST") {
    const body = req.body;

    if (!body.key || !body.info) {
      res.status(400).send({ message: "No key or payload in body." });
      return;
    }

    const uid = (await getUid(body.key).catch((_) => {
      res.status(400).send({ message: "Get user info failed." });
    })) as string;

    await firestore
      .collection("data")
      .doc(uid)
      .collection("profile")
      .doc("info")
      .set(body.info, { merge: true })
      .catch((_) => {
        res.status(400).send({ message: "Save data failed." });
      });

    res.status(200).send({ message: "Data saved." });
  }
});
