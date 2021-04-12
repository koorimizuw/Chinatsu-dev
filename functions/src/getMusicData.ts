import { func, firestore, logger } from "./config";
import { getMusicInfo, calcRank } from "./util";

export const getMusicData = func.onCall(async (_, ctx) => {
  if (!ctx.auth) {
    return {}
  }

  const uid = ctx.auth.uid

  const musicInfo = await getMusicInfo()
  const musicData = []

  const querySnapshot = await firestore
    .collection("data")
    .doc(uid)
    .collection("score")
    .get()

  for (let doc of querySnapshot.docs) {
    const diff = doc.id
    const data = doc.data()

    for (let id in data) {
      if (!musicInfo[id]) {
        logger.error("No music info in database.", { id: id })
        continue
      }

      delete data[id].music_id
      data[id].music_name = musicInfo[id].music_name
      data[id].diff = Number(diff)
      data[id].level = musicInfo[id].level[diff]
      data[id].artist_name = musicInfo[id].artist_name
      data[id].genre_name = musicInfo[id].genre_name
      data[id].boss_level = musicInfo[id].boss_level

      data[id].level_name = String(Math.floor(data[id].level))

      const frac = data[id].level % 1
      if (frac % 1 > 0.6 && frac % 1 < 1.0) {
        data[id].level_name += "+"
      }

      data[id].ab_lamp = data[id].is_all_break ? 'AB' : data[id].is_full_combo ? 'FC' : null
      data[id].fb_lamp = data[id].is_full_bell ? 'FB' : null
      data[id].rank = calcRank(data[id].technical_score)

      musicData.push(data[id])
    }
  }

  return musicData
});
