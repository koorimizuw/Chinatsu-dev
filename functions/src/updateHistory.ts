import { corsFn, firestore, timezone, logger } from "./config";
import { getUid, getMusicInfo, calcRank } from "./util";

export const updateHistory = corsFn(async (req, res) => {
    const body = req.body;

    if (!body.key || !body.playlog) {
      res.status(400).send({ message: "No key or payload in body." });
      return;
    }

    const uid = (await getUid(body.key).catch((_) => {
      res.status(400).send({ message: "Get user info failed." });
      return;
    })) as string;

    const musicInfo: any = await getMusicInfo().catch((_) => {
      res.status(400).send({ message: "Get music info failed." });
      return;
    });

    const playlog: any = {};

    for (let log of body.playlog) {
      const songInfo: any = Object.values(musicInfo).find((element: any) => {
        const matchMusicName = log.music_name == element.music_name;
        const matchGenre = log.genre_name
          ? log.genre_name == element.genre_name
          : true;
        const matchArtist = log.artist
          ? log.artist == element.artist_name
          : true;
        const matchLunatic = log.diff == 10 ? element.is_lunatic : true;

        return matchMusicName && matchGenre && matchArtist && matchLunatic;
      });

      if (!songInfo) {
        logger.error("No song info in database.", { log });
        continue;
      }

      log.music_id = songInfo.music_id;
      log.genre_name = songInfo.genre_name;
      log.level = songInfo.level[String(log.diff)];
      log.level_name = String(Math.floor(log.level));
      const frac = log.level % 1;
      if (frac % 1 > 0.6 && frac % 1 < 1.0) {
        log.level_name += "+";
      }

      log.ab_lamp = log.is_all_break ? "AB" : log.is_full_combo ? "FC" : null;
      log.fb_lamp = log.is_full_bell ? "FB" : null;
      log.rank = calcRank(log.technical_score);

      const playDate = new Date(log["play_date"] + timezone).getTime() / 1000;

      playlog[playDate] = log;
    }

    await firestore
      .collection("data")
      .doc(uid)
      .collection("history")
      .doc("info")
      .set(playlog, { merge: true });

    res.status(200).send({ message: "Data saved." });
});
