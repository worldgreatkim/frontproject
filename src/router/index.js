import { createRouter, createWebHistory } from "vue-router";
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
    path: "/travel",
    name: "Travel",
    component: () => import("../components/travel/TravelPlanner.vue"),
  },
  {
    path: "/plan",
    name: "Plan",
    component: () => import("@/views/PlanPage.vue"),
  },
  {
    path: "/reviews",
    name: "Reviews",
    component: () => import("@/views/ReviewsPage.vue"),
  },
  {
    path: "/board",
    name: "Board",
    component: () => import("../components/board/BoardList.vue"),
  },
  {
    path: "/board/write",
    name: "BoardWrite",
    component: () => import("@/components/board/BoardWrite.vue"),
  },
  {
    path: "/board/:id",  // /boards/:id에서 /board/:id로 변경
    name: "article-detail",
    component: () => import("@/components/board/BoardDetail.vue"),
  },
  {
    path: "/board/modify/:id",
    name: "article-modify",
    component: () => import("@/components/board/BoardModify.vue"),
  },
  {
    path: "/guide",
    name: "Guide",
    component: () => import("@/views/GuidePage.vue"),
  },
  {
    path: "/terms",
    name: "Terms",
    component: () => import("@/views/TermsPage.vue"),
  },
  {
    path: "/privacy",
    name: "Privacy",
    component: () => import("@/views/PrivacyPage.vue"),
  },
  {
    path: "/support",
    name: "Support",
    component: () => import("@/views/SupportPage.vue"),
    meta: {
      title: "고객지원 - 길벗누리",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/", 
  "/login", 
  "/signup", 
  "/guide", 
  "/terms", 
  "/privacy", 
  "/board",
  "/board/:id"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");

  if (authRequired && !loggedIn) {
    return next("/login");
  }

  next();
});

export default router;