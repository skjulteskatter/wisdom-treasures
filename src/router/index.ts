import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/services/auth';

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/landingview',
    name: 'landingview',
    component: () => import('../views/LandingView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('../views/NotFoundView.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach((to, _from, next) => {

  const loggedIn = !!auth.currentUser;

  //If the site requires auth and the user is not logged in: redirect to login
  if (to.matched.some(x => x.meta.requiresAuth) && loggedIn === false) next({ name: "login"});

  //If the site requires the user to be logged off and the user is logged in: redirect to home
  else if (to.matched.some(x => x.meta.requiresAuth === false) && loggedIn) next({ name : "home"}); 

  else next();
});

export default router
