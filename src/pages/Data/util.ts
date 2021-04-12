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
