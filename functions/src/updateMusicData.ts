import { func, firestore } from "./config";
import { getUid } from "./util";

type musicDataItem = {
  music_id?: number,
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

const getMusicId = async (item: any): Promise<number> => {
  let musicSelect = firestore
    .collection("music")
    .where("music_name", "==", item.name)
  if (item.genre) {
    musicSelect = musicSelect.where("genre_name", "==", item.genre)
  }

  const musicIdSnap = await musicSelect.get()

  if (musicIdSnap.docs.length == 0) {
    return -1
  }
  return musicIdSnap.docs[0].data()["music_id"]
}

export const updateMusicData = func.onRequest(async (req, res) => {
  //functions.logger.info("Hello logs!", { structuredData: true });
  res.set('Access-Control-Allow-Origin', '*');
  res.set("Access-Control-Allow-Headers", "*");

  const body = req.body

  if (!body.key || !body.score || !body.diff) {
    res.status(400).send({ "message": "No key or payload in body." })
    return
  }

  const uid = await getUid(body.key)
    .catch(_ => {
      res.status(400).send({ "message": "Get user info failed." })
    }) as string

  let musicData: musicData = {}

  for (let item of body.score) {
    const musicId = await getMusicId(item)
      .catch(_ => {
        res.status(400).send({ "message": "Get music info failed." })
      }) as number

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
    })

  res.status(200).send({ "message": "Data saved." })
});
