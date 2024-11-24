// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { storeToRefs } from "pinia";
import { useMemberStore } from "@/store/member";
import HomePage from "../views/HomePage.vue";

const onlyAuthUser = async (to, from, next) => {
  const memberStore = useMemberStore();
  const { isLogin } = storeToRefs(memberStore);
  
  if (isLogin.value) {
    next();
  } else {
    alert("로그인이 필요한 페이지입니다.");
    next({ name: "Login" });
  }
};

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
    beforeEnter: onlyAuthUser
  },
  {
    path: "/plan",
    name: "Plan",
    component: () => import("@/views/PlanPage.vue"),
    beforeEnter: onlyAuthUser,
  },
  {
    path: "/reviews",
    name: "Reviews",
    component: () => import("@/views/ReviewsPage.vue"),
    beforeEnter: onlyAuthUser,
  },
  {
    path: "/board",
    name: "Board",
    component: () => import("../components/board/BoardList.vue"),
    beforeEnter: onlyAuthUser
  },
  {
    path: "/board/write",
    name: "BoardWrite",
    component: () => import("@/components/board/BoardWrite.vue"),
    beforeEnter: onlyAuthUser,
  },
  {
    path: "/board/:id",
    name: "article-detail",
    component: () => import("@/components/board/BoardDetail.vue"),
  },
  {
    path: "/board/modify/:id",
    name: "article-modify",
    component: () => import("@/components/board/BoardModify.vue"),
    beforeEnter: onlyAuthUser,
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

// 전역 네비게이션 가드
router.beforeEach(async (to, from, next) => {
  const memberStore = useMemberStore();
  const { isValidToken } = storeToRefs(memberStore);
  const { checkToken } = memberStore;

  const publicPages = [
    "/",
    "/login",
    "/signup",
    "/guide",
    "/terms",
    "/privacy",
    "/board",
    "/board/:id"
  ];
  const authRequired = !publicPages.includes(to.path);
  
  if (authRequired) {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      await checkToken();
      if (isValidToken.value) {
        next();
      } else {
        next("/login");
      }
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;