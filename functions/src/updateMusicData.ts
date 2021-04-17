import { func, firestore, logger } from "./config";
import { getUid, getMusicInfo, calcRank } from "./util";
import { scoreData } from "./types";

export const updateMusicData = func.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "86400");
    res.status(204).send("");
  } else if (req.method === "POST") {
    const body = req.body;

    if (!body.key || !body.score || !body.diff) {
      res.status(400).send({ message: "No key or payload in body." });
      return;
    }

    const uid = (await getUid(body.key).catch((_) => {
      res.status(400).send({ message: "Get user info failed." });
    })) as string;

    let musicData: scoreData = {};

    const isLunatic = body.diff == "10";
    const musicInfo: any = await getMusicInfo().catch((_) => {
      res.status(400).send({ message: "Get music info failed." });
    });

    for (let item of body.score) {
      const songInfo: any = Object.values(musicInfo).find((element: any) => {
        const matchMusicName = item.music_name == element.music_name;
        const matchGenre = item.genre_name
          ? item.genre_name == element.genre_name
          : true;
        const matchArtist = item.artist
          ? item.artist == element.artist_name
          : true;
        const matchLunatic = isLunatic ? element.is_lunatic : true;

        return matchMusicName && matchGenre && matchArtist && matchLunatic;
      });

      if (!songInfo) {
        logger.error("No song info in database.", { item });
        continue;
      }

      item.diff = Number(body.diff);
      item.level = songInfo.level[body.diff];
      item.artist_name = songInfo.artist_name;
      item.genre_name = songInfo.genre_name;
      item.boss_level = songInfo.boss_level;
      item.level_name = String(Math.floor(item.level));
      const frac = item.level % 1;
      if (frac % 1 > 0.6 && frac % 1 < 1.0) {
        item.level_name += "+";
      }

      item.ab_lamp = item.is_all_break
        ? "AB"
        : item.is_full_combo
        ? "FC"
        : null;
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
  }
});
