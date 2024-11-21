// router/index.js
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
    path: "/travel",
    name: "Travel",
    component: () => import("../components/travel/TravelPlanner.vue"),
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
  },
  {
    path: "/board/write",
    name: "BoardWrite",
    component: () => import("@/components/board/BoardWrite.vue"),
  },
  // 추가된 라우트
  // router/index.js에 이미 있는 코드
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
  // 404 페이지
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
  {
    path: "/support",
    name: "Support",
    component: () => import("@/views/SupportPage.vue"),
    meta: {
      title: "고객지원 - 길벗누리",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = [
    "/",
    "/login",
    "/signup",
    "/guide",
    "/terms",
    "/privacy",
  ];
  //여기에 경로를 추가하지 않으면
  const authRequired = !publicPages.includes(to.path); //여기에서 로그인 체크 여부를 당하게 된다
  const loggedIn = localStorage.getItem("user");

  if (authRequired && !loggedIn) {
    return next("/login");
  }

  next();
});

export default router;
