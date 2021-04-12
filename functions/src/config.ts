import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const tokyo = "asia-northeast1";
export const timezone = " GMT+09:00"

export const func = functions.region(tokyo).https
export const logger = functions.logger

export const firestore = admin.initializeApp().firestore()