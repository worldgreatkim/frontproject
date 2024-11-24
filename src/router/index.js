import { createRouter, createWebHistory } from "vue-router";
import { getToken, TOKEN_TYPE } from "@/util/auth";
import HomePage from "../views/HomePage.vue";

const routes = [
 {
   path: "/",
   name: "Home",
   component: HomePage,
 },
 {
   path: "/signup",
   name: "Signup",
   component: () => import("../components/login/AppSignUp.vue"),
 },
 {
   path: "/login",
   name: "Login",
   component: () => import("../components/login/AppLogin.vue"),
 },
 {
   path: "/board",
   name: "Board",
   component: () => import("../components/board/BoardList.vue"),
   meta: { requiresAuth: true }
 },
 // 주의: 동적 라우트(:id)보다 명시적인 라우트(write)를 먼저 정의해야 합니다
 {
   path: "/board/write",
   name: "article-write",
   component: () => import("../components/board/BoardWrite.vue"),
   meta: { requiresAuth: true }
 },
 {
   path: "/board/:id",
   name: "article-detail",
   component: () => import("../components/board/BoardDetail.vue"),
   meta: { requiresAuth: true }
 },
 {
   path: "/board/modify/:id",
   name: "article-modify",
   component: () => import("../components/board/BoardModify.vue"),
   meta: { requiresAuth: true }
 }
];

const router = createRouter({
 history: createWebHistory(process.env.BASE_URL),
 routes,
});

router.beforeEach((to, from, next) => {
 const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
 const token = getToken(TOKEN_TYPE.ACCESS);

 if (requiresAuth && !token) {
   next('/login');
 } else {
   next();
 }
});

export default router;