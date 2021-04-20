import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import CORS from "cors";

export const tokyo = "asia-northeast1";
export const timezone = " GMT+09:00";

export const func = functions.region(tokyo).https;
export const logger = functions.logger;

export const firestore = admin.initializeApp().firestore();

export type Handler = Parameters<typeof func["onRequest"]>[0];

const cors = CORS({ origin: true });

export const corsFn = (handler: Handler): functions.HttpsFunction => {
  return func.onRequest((req, res) =>
    cors(req, res, (err) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      return handler(req, res);
    })
  );
};
