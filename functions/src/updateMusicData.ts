import { func, firestore } from "./config";

type musicDataItem = {
  music_id?: string,
  over_damage: string,
  battle_score: number,
  technical_score: number,
  is_full_bell: boolean,
  is_full_combo: boolean,
  is_all_break: boolean,
}

type musicData = {
  [key: string]: musicDataItem;
};

export const updateMusicData = func.onRequest(async (req, res) => {
  //functions.logger.info("Hello logs!", { structuredData: true });
  res.set('Access-Control-Allow-Origin', '*');
  res.set("Access-Control-Allow-Headers", "*");

  const body = req.body

  if (!body.key || !body.score || !body.diff) {
    res.status(400).send({ "message": "No key or payload in body." })
    return
  }

  const uidSnap = await firestore
    .collection("users")
    .where("key", "==", body.key)
    .get()
    .catch(_ => {
      res.status(400).send({ "message": "Read database failed." })
      return
    }) as FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
  if (uidSnap.docs.length == 0) {
    res.status(400).send({ "message": "Authenticate failed." })
  }
  const uid: string = uidSnap.docs[0].data()["uid"]

  let musicData: musicData = {}

  for (let item of body.score) {
    let musicSelect = firestore
      .collection("music")
      .where("music_name", "==", item.name)
    if (item.genre) {
      musicSelect = musicSelect.where("genre_name", "==", item.genre)
    }
    const musicIdSnap = await musicSelect
      .get()
      .catch(_ => {
        res.status(400).send({ "message": "Get Music data failed." })
        return
      }) as FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    if (musicIdSnap.docs.length == 0) {
      continue
    }
    const musicId = String(musicIdSnap.docs[0].data()["music_id"])

    musicData[musicId] = {
      music_id: musicId,
      over_damage: item.over_damage,
      battle_score: item.battle_score,
      technical_score: item.technical_score,
      is_full_bell: item.is_full_bell,
      is_full_combo: item.is_full_combo,
      is_all_break: item.is_all_break,
    }
  }

  await firestore
    .collection("data")
    .doc(uid)
    .collection("score")
    .doc(String(body.diff))
    .set(musicData, { merge: true })
    .catch(_ => {
      res.status(400).send({ "message": "Insert data failed." })
      return
    })

  res.status(200).send({ "message": "Data saved." })
});
