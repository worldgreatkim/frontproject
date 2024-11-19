import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import AppTravel from '../views/AppTravel.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/travel',
    name: 'Travel',
    component: AppTravel,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/login/AppLogin.vue'),
  },
  {
    path: '/board',
    name: 'Board',
    component: () => import('../components/board/BoardList.vue'),
  },
  {
    path: '/board/write',
    name: 'BoardWrite',
    component: () => import('@/components/board/BoardWrite.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
});

export default router;
