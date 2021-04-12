import { func, firestore } from "./config";
import { calcRank } from "./util";

export const getPlaylog = func.onCall(async (_, ctx) => {
	if (!ctx.auth) {
		return {}
	}

	const uid = ctx.auth.uid

	const querySnapshot = await firestore
		.collection("data")
		.doc(uid)
		.collection("history")
		.orderBy("play_date", "desc")
		.get()

	let playlogList = []
	for (let doc of querySnapshot.docs) {
		let item = doc.data()
		item.ab_lamp = item.is_all_break ? 'AB' : item.is_full_combo ? 'FC' : null
		item.fb_lamp = item.is_full_bell ? 'FB' : null
		item.rank = calcRank(item.technical_score)
		playlogList.push(item)
	}

	return playlogList
});
