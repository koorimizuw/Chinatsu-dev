import { corsFn, firestore, logger } from "./config";
import { getUid, getMusicInfo, calcRank } from "./util";
import {
  updateRatingDataRequestBody,
  scoreDataItem,
  ratingScoreData,
} from "./types";

export const updateRatingData = corsFn(async (req, res) => {
    const body: updateRatingDataRequestBody = req.body;

    if (
      !body.key ||
      !body.new ||
      !body.best ||
      !body.recent ||
      !body.candidate
    ) {
      res.status(400).send({ message: "No key or payload in body." });
      return;
    }

    const uid = (await getUid(body.key).catch((_) => {
      res.status(400).send({ message: "Get user info failed." });
    })) as string;

    const musicInfo: any = await getMusicInfo().catch((_) => {
      res.status(400).send({ message: "Get music info failed." });
    });

    const ratingScoreData: ratingScoreData = {
      new: [],
      best: [],
      recent: [],
      candidate: [],
    };

    Object.keys(body).forEach((cas) => {
      for (const item of body[cas]) {
        if (typeof item === "string") {
          continue;
        }

        const songInfo: any = Object.values(musicInfo).find((element: any) => {
          const matchMusicName = item.music_name == element.music_name;
          const matchGenre = item.genre_name
            ? item.genre_name == element.genre_name
            : true;
          const matchArtist = item.artist
            ? item.artist == element.artist_name
            : true;
          const matchLunatic = item.diff == 10 ? element.is_lunatic : true;

          return matchMusicName && matchGenre && matchArtist && matchLunatic;
        });

        if (!songInfo) {
          logger.error("No song info in database.", { item });
          continue;
        }

        let scoreData: scoreDataItem = {
          music_name: item.music_name,
          diff: item.diff,
          genre_name: songInfo.genre_name,
          level: songInfo.level[item.diff],
          artist_name: songInfo.artist_name,
          technical_score: item.score,
          rank: calcRank(item.score),
        };

        scoreData.level_name = String(Math.floor(scoreData.level));
        const frac = scoreData.level % 1;
        if (frac % 1 > 0.6 && frac % 1 < 1.0) {
          scoreData.level_name += "+";
        }

        ratingScoreData[cas].push(scoreData);
      }
    });

    await firestore
      .collection("data")
      .doc(uid)
      .collection("rating")
      .doc("info")
      .set(ratingScoreData)
      .catch((_) => {
        res.status(400).send({ message: "Insert data failed." });
      });

    res.status(200).send({ message: "Data saved." });
});
