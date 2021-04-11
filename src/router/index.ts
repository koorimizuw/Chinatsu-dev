import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import Register from "../pages/Register.vue"
import Main from "../components/HelloWorld.vue"
import Data from "../pages/Data/Index.vue"
import Playlog from "../pages/Data/Playlog.vue"
import Setting from "../pages/Setting.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => Register,
  },
  {
    path: "/",
    name: "Main",
    component: () => Main,
  },
  {
    path: "/data",
    name: "Data",
    component: () => Data,
  },
  {
    path: "/data/playlog",
    name: "Playlog",
    component: () => Playlog,
  },
  {
    path: "/setting",
    name: "Setting",
    component: () => Setting,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;