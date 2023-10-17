import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { getCurrentUserPromise } from '@/services/auth';
import { useSessionStore } from '@/stores/session';

const WWCard = {
  path: ':wwNumber(\\d{1,5}$)',
  children: [],
  meta: {
    scrollUp: false,
  }
} as RouteRecordRaw;

const Manna = {
  path: ':mannaPath(\\manna)',
  children: [],
  meta: {
    scrollUp: false,
  }
} as RouteRecordRaw;

const AutoSlug = {
  path: ':autoSlug([^/]+)',
  children: [
    WWCard,
    Manna
  ],
  meta: {
    scrollUp: false,
  }
} as RouteRecordRaw;

const Theme = {
  name: 'themeUUID',
  path: ':themeId([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  children: [AutoSlug],
  meta: {
    scrollUp: true,
  },
  component: () => import('../views/ThemeView.vue'),
} as RouteRecordRaw;

const Origin = {
  name: 'originUUID',
  path: ':originId([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', //TODO a lot here
  children: [AutoSlug],
  meta: {
    scrollUp: true,
  },
  component: () => import('../views/OriginView.vue'),
} as RouteRecordRaw;

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
        children: [
          WWCard,
          Manna,
        ],
        meta: {
          requiresAuth: true,
          scrollUp: true,
          requiresSubscription: true,
        }
      },
      {
        path: '/noSub',
        name: 'dashboardNoSub',
        component: () => import('../views/HomeNoSubscriptionView.vue'),
        children: [
          WWCard,
          Manna,
        ],
        meta: {
          requiresAuth: true,
          scrollUp: true,
          requiresSubscription: false,
        }
      },
      {
        path: '/search',
        name: 'search',
        component: () => import('../views/SearchView.vue'),
        children: [
          WWCard,
          Manna,
        ],
        meta: {
          requiresAuth: true,
          scrollUp: true,
          requiresSubscription: true,
        }
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('../views/ProfileView.vue'),
        meta: {
          requiresAuth: true,
          requiresSubscription: false,
          scrollUp: true,
        },
      },
      {
        path: '/themes',
        name: 'themesIndex',
        meta: {
          requiresAuth: true,
          scrollUp: true,
          requiresSubscription: true,
        },
        children: [
          {
            name: 'themes',
            path: '',
            component: () => import('../views/ThemesView.vue'),
            meta: {
              requiresAuth: true,
              scrollUp: true,
              requiresSubscription: true,
            },
          },
          Theme
        ]
      },
      {
        path: '/origins',
        name: 'originsIndex',
        meta: {
          requiresAuth: true,
          scrollUp: true,
          requiresSubscription: true,
        },
        children: [
          {
            name: 'origins',
            path: '',
            component: () => import('../views/OriginsView.vue'),
            meta: {
              requiresAuth: true,
              scrollUp: true,
              requiresSubscription: true,
            },
          },
          Origin
        ]
      },
      {
        path: '/history',
        name: 'history',
        component: () => import('../views/HistoryView.vue'),
        meta: {
          requiresAuth: true,
          scrollUp: true,
          requiresSubscription: true,
        },
        children: [
          WWCard,
          Manna
        ]
      },
      {
        path: '/success',
        name: 'success',
        component: () => import('../views/SuccessView.vue'),
        meta: {
          requiresAuth: true,
          scrollUp: true,
          requiresSubscription: false,
        },
        children: [
          WWCard,
          Manna
        ]
      },
      {
        path: '/store',
        name: 'store',
        component: () => import('../views/StoreView.vue'),
        meta: {
          requiresAuth: true,
          scrollUp: true,
          requiresSubscription: false
        },
      },
      {
        path: '/favorites',
        name: 'favorites',
        component: () => import('../views/FavoritesView.vue'),
        meta: {
          requiresAuth: true,
          scrollUp: true,
          requiresSubscription: true,
        },
        children: [
          WWCard,
          Manna
        ]
      },
    ]
  },
  {
    path: '/landing',
    name: 'landing',
    component: () => import('../views/LandingView.vue'),
    meta: {
      requiresAuth: false,
      scrollUp: true,
      requiresSubscription: false
    },
    children: []
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/ContactView.vue'),
    meta: {
      requiresAuth: true,
      scrollUp: true,
      requiresSubscription: false
    },
  },
  {
    path: '/insight',
    name: 'insight',
    component: () => import('../views/InsightView.vue'),
    meta: {
      requiresAuth: false,
      scrollUp: true,
      requiresSubscription: false
    },
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: () => import('../views/PrivacyPolicyView.vue'),
    meta: {
      requiresAuth: false,
      scrollUp: true,
      requiresSubscription: false
    },
  },
  {
    path: '/terms-of-purchase',
    name: 'terms-of-purchase',
    component: () => import('../views/TermsOfPurchaseView.vue'),
    meta: {
      requiresAuth: true,
      scrollUp: true,
      requiresSubscription: false
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      requiresAuth: false,
      requiresSubscription: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach(async (to, from, next) => {

  console.log("NAVIGATING TO ", to.name);

  if (to.meta.scrollUp === true && from.meta.scrollUp === true) {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 150);
  }

  const requiresAuth: true | false | undefined = to.matched.every(x => x.meta.requiresAuth === undefined) ? undefined : to.matched.some(x => x.meta.requiresAuth);
  const requiresSubscription: true | false | undefined = to.matched.every(x => x.meta.requiresSubscription === undefined) ? undefined : to.matched.some(x => x.meta.requiresSubscription);

  let loggedIn = undefined;
  let hasSubscription = undefined;

  if (requiresAuth !== undefined || requiresSubscription !== undefined)
    loggedIn = !!(await getCurrentUserPromise());

  if (requiresSubscription !== undefined)
    hasSubscription = await useSessionStore().userHasSubscriptionPromise();

  console.log('Are only people with a subscription allowed to see ', to.name, ' ', requiresSubscription)
  console.log('Does user have a subscription? ', hasSubscription)

  console.log('Do you need to be logged in to see ', to.name, ' ', requiresAuth)
  console.log('Is user logged in?', loggedIn)
  //If the site requires auth and the user is not logged in: redirect to login
  if (requiresAuth && loggedIn === false) {
    useSessionStore().$state.redirectAfterLoginName = to.name?.toString() ?? "";
    console.log('INDEX: This side requires auth, and you are not logged in - sending you to login')
    next({ name: "login" });
  }
  //If the site requires the user to be logged off and the user is logged in: redirect to dashboard
  else if (requiresAuth === false && loggedIn === true) {
    console.log('INDEX: This side requires NO auth, and you are logged in - sending you to dashboard')
    next({ name: "dashboard" });
  }
  // If user has no subscription and the site requires a subscription
  else if (loggedIn && hasSubscription === false && requiresSubscription) {
    console.log('INDEX: This side requires subscription, and you are logged in - sending you to buy subscription')
    next({ name: "dashboardNoSub" });
  }
  
  else {
    console.log('INDEX: All good, passing you by')
    next();
  }

});

export default router
