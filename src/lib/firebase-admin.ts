import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? "ea-promo.firebasestorage.app",
    projectId: process.env.FIREBASE_PROJECT_ID ?? "ea-promo",
  });
}

export const db = getFirestore();
export const bucket = getStorage().bucket();
export { FieldValue, Timestamp };

// Collection helpers
export const collections = {
  categories: db.collection("categories"),
  products: db.collection("products"),
  offers: db.collection("offers"),
  orders: db.collection("orders"),
};
