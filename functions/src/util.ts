import { firestore } from "./config";

export const getUid = async (key: string): Promise<string> => {
	const uidSnap = await firestore
		.collection("users")
		.where("key", "==", key)
		.get() as FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
	if (uidSnap.docs.length == 0) {
		return ''
	}
	return uidSnap.docs[0].data()["uid"]
}

export const randomPassword = (len: number) => {
	let str = ""
	for (let i = 0; i < len; i = i + 8) {
		str += Math.random().toString(36).slice(-8)
	}
	return str
}