import firebase from "firebase";

export const diffOptions = [
	{ label: "Basic", value: 0 },
	{ label: "Advanced", value: 1 },
	{ label: "Expert", value: 2 },
	{ label: "Master", value: 3 },
	{ label: "Lunatic", value: 10 },
]
export const scoreRank = [
	{ label: "-", value: null },
	{ label: "A未満", value: "" },
	{ label: "A", value: "A" },
	{ label: "AA", value: "AA" },
	{ label: "AAA", value: "AAA" },
	{ label: "S", value: "S" },
	{ label: "SS", value: "SS" },
	{ label: "SSS", value: "SSS" },
	{ label: "SSS+", value: "SSS+" },
	{ label: "MAX", value: "MAX" },
];
export const abLamp = [
	{ label: "ノーランプ", value: null },
	{ label: "AB", value: "AB" },
	{ label: "FC", value: "FC" },
];
export const fbLamp = [
	{ label: "ノーランプ", value: null },
	{ label: "FB", value: "FB" },
];

export const foramtDiffName = (row) => {
	switch (row.diff) {
		case 0:
			return "Basic";
		case 1:
			return "Advanced";
		case 2:
			return "Expert";
		case 3:
			return "Master";
		case 10:
			return "Lunatic";
	}
};

export const formatRowClass = ({ row }) => {
	switch (row.diff) {
		case 0:
			return "basic";
		case 1:
			return "advanced";
		case 2:
			return "expert";
		case 3:
			return "master";
		case 10:
			return "lunatic";
	}
}

export const calcRank = (score: number) => {
	if (score === 1010000) {
		return "MAX"
	} else if (score >= 1007500) {
		return "SSS+"
	} else if (score >= 1000000) {
		return "SSS"
	} else if (score >= 990000) {
		return "SS"
	} else if (score >= 970000) {
		return "S"
	} else if (score >= 940000) {
		return "AAA"
	} else if (score >= 900000) {
		return "AA"
	} else if (score >= 850000) {
		return "A"
	} else if (score < 850000) {
		return ""
	}
	return null
}

export const getUserInfo = async () => {
	const uid = firebase.auth().currentUser.uid;
	const db = firebase.firestore();

	const profile = await db
		.collection("data")
		.doc(uid)
		.collection("profile")
		.doc("info")
		.get()

	return profile.data()
}

export const getPlaylog = async () => {
	const uid = firebase.auth().currentUser.uid;
	const db = firebase.firestore();

	let plyalog = []
	const querySnapshot = await db
		.collection("data")
		.doc(uid)
		.collection("history")
		.orderBy("play_date", "desc")
		.get()

	for (let doc of querySnapshot.docs) {
		let item = doc.data()
		item.ab_lamp = item.is_all_break ? 'AB' : item.is_full_combo ? 'FC' : null
		item.fb_lamp = item.is_full_bell ? 'FB' : null
		item.rank = calcRank(item.technical_score)
		plyalog.push(item)
	}

	return plyalog
}