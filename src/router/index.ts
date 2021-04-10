import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
//@ts-ignore
import Login from "../pages/Login.vue"
//@ts-ignore
import Register from "../pages/Register.vue"
//@ts-ignore
import Main from "../components/HelloWorld.vue"
//@ts-ignore
import Data from "../pages/Data.vue"
//@ts-ignore
import Setting from "../pages/Setting.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => Login,
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