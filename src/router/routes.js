
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Index.vue'),
        meta: {
          isPublic: false
        }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/Auth.vue'),
    children: [
      {
        path: 'login', component: () => import('pages/Auth/Login.vue'),
        meta: {
          isPublic: true
        }
      },
      {
        path: 'register', component: () => import('pages/Auth/Register.vue'),
        meta: {
          isPublic: true
        }
      },
      {
        path: 'confirm-email', component: () => import('pages/Auth/ConfirmEmail.vue'),
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

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
