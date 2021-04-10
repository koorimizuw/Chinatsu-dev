import { func, firestore } from "./config";

export const updateUserInfo = func.onRequest(async (req, res) => {
	const body = req.body

	if (!body.key || !body.info) {
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

	await firestore
		.collection("data")
		.doc(uid)
		.collection("profile")
		.doc("info")
		.set(body.info, { merge: true })
		.catch(_ => {
			res.status(400).send({ "message": "Save data failed." })
		})

	res.status(200).send({ "message": "Data saved." })
})