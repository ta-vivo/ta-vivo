
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'home',
        path: '', component: () => import('pages/Index.vue'),
        meta: {
          isPublic: false
        }
      },
      {
        path: 'profile',
        component: () => import('pages/User/Profile.vue'),
        meta: {
          isPublic: false
        }
      },
    ]
  },
  {
    path: '/',
    component: () => import('layouts/Auth.vue'),
    children: [

      {
        path: 'about',
        component: () => import('pages/About.vue'),
        meta: {
          isPublic: true
        }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/Auth.vue'),
    children: [
      {
        name: 'login',
        path: 'login', component: () => import('pages/Auth/Login.vue'),
        meta: {
          isPublic: true
        }
      },
      {
        name: 'register',
        path: 'register', component: () => import('pages/Auth/Register.vue'),
        meta: {
          isPublic: true
        }
      },
      {
        name: 'confirm-email',
        path: 'confirm-email', component: () => import('pages/Auth/ConfirmEmail.vue'),
        meta: {
          isPublic: true
        }
      },
      {
        path: 'forgot-password', component: () => import('pages/Auth/ForgotPassword.vue'),
        meta: {
          isPublic: true
        }
      },
    ]
  },
  {
    path: '/checks',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'checks',
        path: '', component: () => import('pages/Checks/Index.vue'),
        meta: {
          isPublic: false
        }
      },
      {
        path: 'add', component: () => import('pages/Checks/Add.vue'),
        meta: {
          isPublic: false
        }
      },
      {
        path: 'edit/:id', component: () => import('pages/Checks/Edit.vue'),
        meta: {
          isPublic: false
        }
      },
    ]
  },
  {
    path: '/integrations',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Integrations/Index.vue'),
        meta: {
          isPublic: false
        }
      },
      {
        path: 'add', component: () => import('pages/Integrations/Add.vue'),
        meta: {
          isPublic: false
        }
      },
      {
        path: 'slack/success', component: () => import('pages/Integrations/SlackSuccess.vue'),
        meta: {
          isPublic: false
        }
      },
      {
        path: 'discord/success', component: () => import('pages/Integrations/DiscordSuccess.vue'),
        meta: {
          isPublic: false
        }
      },
    ]
  },
  {
    path: '/legal',
    component: () => import('layouts/Auth.vue'),
    children: [
      {
        path: 'terms-and-conditions',
        component: () => import('pages/Legal/TermsAndConditions.vue'),
        meta: {
          isPublic: true
        }
      },
      {
        path: 'privacy-policy',
        component: () => import('pages/Legal/PrivacyPolicy.vue'),
        meta: {
          isPublic: true
        }
      }
    ]
  },
  {
    path: '/pricing',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Payments/Pricing.vue'),
        meta: {
          isPublic: false
        }
      }
    ]
  },
  {
    path: '/status-pages',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'status-pages',
        path: '', component: () => import('pages/StatusPages/Index.vue'),
        meta: {
          isPublic: false
        }
      },
      {
        path: 'add', component: () => import('pages/StatusPages/Add.vue'),
        meta: {
          isPublic: false
        }
      },
      {
        path: 'edit/:uuid', component: () => import('pages/StatusPages/Edit.vue'),
        meta: {
          isPublic: false
        }
      }
    ]
  },
  {
    path: '/status-pages',
    component: () => import('layouts/Auth.vue'),
    children: [
      {
        name: 'status-pages-view',
        path: 'view/:uuid', component: () => import('pages/StatusPages/View.vue'),
        meta: {
          isPublic: true
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
