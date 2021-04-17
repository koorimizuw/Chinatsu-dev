import firebase from "firebase";

export function getFunctions() {
  const app = firebase.app();
  /*
  if (window.location.host.includes("localhost")) {
    firebase.functions().useEmulator("localhost", 5001);
    return app.functions(); // for emulator
  }*/
  return app.functions("asia-northeast1"); // for prod
}

export const isMobile = () => {
  if (window.innerWidth <= 600) {
    return true;
  }
  return false;
};
