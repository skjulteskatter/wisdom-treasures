import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/stores/session'

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
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('../views/NotFoundView.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

let stackCount = 0;

router.beforeEach((to, _from, next) => {
  const store = useSessionStore();

  const loggedIn = store.userExist && store.userEmailVerified;

  //Redirect to "login" if the user is not logged in and the site requires auth
  if (to.matched.some(x => x.meta.requiresAuth) && !loggedIn) next({ name: "login"});
  //Redirect the user to "home" if the user tries to access a site 
  //that requires the user NOT to be logged in. Like the login screen
  else if (to.matched.some(x => x.meta.requiresAuth === false) && loggedIn) next({ name : "home"}); 
  else if (to.matched.length === 0) next({ name : "notfound"})
  else next();
});

export default router

export async function navigateTo(to: string | undefined){
  console.log(stackCount);
  if(to) {
    router.push({name : to});
    stackCount++;
  } else if (stackCount <= 0) {
      router.push({name: "home"});
  } else {
      router.back();
      stackCount--;
  }
}
