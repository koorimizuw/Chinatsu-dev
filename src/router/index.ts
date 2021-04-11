import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

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
    component: () => import("@/pages/Data/Index.vue"),
  },
  {
    path: "/data/playlog",
    name: "Playlog",
    component: () => import("@/pages/Data/Playlog.vue"),
  },
  {
    path: "/setting",
    name: "Setting",
    component: () => import("@/pages/Setting.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;