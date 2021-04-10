import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";
import { store } from "./store";
import firebase from 'firebase';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

const { VITE_API_KEY, VITE_AUTH_DOMAIN, VITE_PROJECT_ID } = import.meta.env

const firebaseConfig = {
  apiKey: VITE_API_KEY,
  authDomain: VITE_AUTH_DOMAIN,
  projectId: VITE_PROJECT_ID,
};

firebase.initializeApp(firebaseConfig);

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .mount('#app')
