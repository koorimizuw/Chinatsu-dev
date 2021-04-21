import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import firebase from "firebase";

const publicPath = ["Login", "Register", "Main"];

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/pages/Register.vue"),
  },
  {
    path: "/",
    name: "Main",
    component: () => import("@/components/HelloWorld.vue"),
  },
  {
    path: "/data",
    name: "Data",
    component: () => import("@/pages/data/Index.vue"),
  },
  {
    path: "/data/playlog",
    name: "Playlog",
    component: () => import("@/pages/data/Playlog.vue"),
  },
  {
    path: "/data/detail",
    name: "Detail",
    component: () => import("@/pages/data/Detail.vue"),
  },
  {
    path: "/data/rating",
    name: "Rating",
    component: () => import("@/pages/data/Rating.vue"),
  },
  {
    path: "/setting",
    name: "Setting",
    component: () => import("@/pages/setting/Index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (!publicPath.includes(<string>to.name)) {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        next({ name: "Login" });
      } else next();
    });
  } else next();
});

export default router;
