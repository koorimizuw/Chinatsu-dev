import { func, firestore, logger } from "./config";
import { getUid, getMusicInfo, calcRank } from "./util";

type musicDataItem = {
  music_id?: number;
  diff: number;
  level: number;
  music_name: string;
  artist_name: string;
  genre_name: string;
  boss_level: number;
  level_name: string;
  over_damage: string;
  battle_score: number;
  technical_score: number;
  is_full_bell: boolean;
  is_full_combo: boolean;
  is_all_break: boolean;
};

type musicData = {
  [key: string]: musicDataItem;
};

/*
const getMusicId = async (item: any, lunatic: boolean): Promise<number> => {
  let musicSelect = firestore
    .collection("music")
    .where("music_name", "==", item.name);
  if (item.genre) {
    musicSelect = musicSelect.where("genre_name", "==", item.genre);
  }
  if (lunatic) {
    musicSelect = musicSelect.where("is_lunatic", "==", true);
  }

  const musicIdSnap = await musicSelect.get();

  if (musicIdSnap.docs.length == 0) {
    logger.error("Get music id failed.", item);
    return -1;
  }
  return musicIdSnap.docs[0].data()["music_id"];
};*/

export const updateMusicData = func.onRequest(async (req, res) => {
  //functions.logger.info("Hello logs!", { structuredData: true });
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");

  const body = req.body;

  if (!body.key || !body.score || !body.diff) {
    res.status(400).send({ message: "No key or payload in body." });
    return;
  }

  const uid = (await getUid(body.key).catch((_) => {
    res.status(400).send({ message: "Get user info failed." });
  })) as string;

  let musicData: musicData = {};

  const isLunatic = body.diff == "10";
  const musicInfo: any = await getMusicInfo().catch((_) => {
    res.status(400).send({ message: "Get music info failed." });
  });

  for (let item of body.score) {
    const songInfo: any = Object.values(musicInfo).find((element: any) => {
      const matchMusicName = item.name == element.music_name;
      const matchGenre = item.genre ? item.genre == element.genre_name : true;
      const matchLunatic = isLunatic ? element.is_lunatic : true;

      return matchMusicName && matchGenre && matchLunatic;
    });

    if (!songInfo) {
      logger.error("No song info in database.", { item });
      continue;
    }

    item.diff = Number(body.diff);
    item.music_name = songInfo.music_name;
    item.level = songInfo.level[body.diff];
    item.artist_name = songInfo.artist_name;
    item.genre_name = songInfo.genre_name;
    item.boss_level = songInfo.boss_level;
    item.level_name = String(Math.floor(item.level));
    const frac = item.level % 1;
    if (frac % 1 > 0.6 && frac % 1 < 1.0) {
      item.level_name += "+";
    }

    item.ab_lamp = item.is_all_break ? "AB" : item.is_full_combo ? "FC" : null;
    item.fb_lamp = item.is_full_bell ? "FB" : null;
    item.rank = calcRank(item.technical_score);

    musicData[songInfo.music_id] = item;
  }

  await firestore
    .collection("data")
    .doc(uid)
    .collection("score")
    .doc(body.diff)
    .set(musicData, { merge: true })
    .catch((_) => {
      res.status(400).send({ message: "Insert data failed." });
    });

  res.status(200).send({ message: "Data saved." });
});
