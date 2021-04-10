import { func, firestore } from "./config";

export const getPlaylog = func.onCall(async (_, ctx) => {
	if (!ctx.auth) {
		return {}
	}

	const uid = ctx.auth?.uid

	const playlogSnap = await firestore
		.collection("data")
		.doc(uid)
		.collection("history")
		.get()

	let playlogList = []
	for (let v of playlogSnap.docs) {
		playlogList.push(v.data())
	}

	return playlogList
});
