import { createRouter, createWebHistory } from 'vue-router'
import { auth, getCurrentUserPromise } from '@/services/auth';
import { useSessionStore } from '@/stores/session';

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'dashboard',
        component: () => import('../views/HomeView.vue'),
      },
    ]
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
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: {
      requiresAuth: true,
    }
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

router.beforeEach(async (to, _from, next) => {

  const requiresAuth : boolean | undefined = to.matched.some(x => x.meta.requiresAuth);
  let loggedIn = undefined;

  if (requiresAuth !== undefined)
    loggedIn = !!(await getCurrentUserPromise());

  //If the site requires auth and the user is not logged in: redirect to login
  if (requiresAuth && loggedIn === false) {
    useSessionStore().$state.redirectAfterLoginName = to.name?.toString() ?? "";
    next({ name: "login"});
  }

  //If the site requires the user to be logged off and the user is logged in: redirect to home
  else if (requiresAuth === false && loggedIn === true) next({ name : "home"}); 

  else next();
});

export default router
