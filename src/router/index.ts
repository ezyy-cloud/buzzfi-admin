import { createRouter, createWebHistory } from 'vue-router'

// Template Views
import FormElementsView from '@/ui/views/Templates/Forms/FormElementsView.vue'
import FormLayoutView from '@/ui/views/Templates/Forms/FormLayoutView.vue'
import AlertsView from '@/ui/views/Templates/UiElements/AlertsView.vue'
import ButtonsView from '@/ui/views/Templates/UiElements/ButtonsView.vue'

// Sales Views
import DahsboardView from '@/ui/views/Sales/SalesDahsboardView.vue'
import AgentsView from '@/ui/views/Sales/AgentsView.vue'
import SitesView from '@/ui/views/Sales/SitesView.vue'
import SalesView from '@/ui/views/Sales/SalesView.vue'
import VouchersView from '@/ui/views/Sales/VouchersView.vue'
import CalendarView from '@/ui/views/Sales/CalendarView.vue'

// Account Views
import SettingsView from '@/ui/views/Account/SettingsView.vue'
import ProfileView from '@/ui/views/Account/ProfileView.vue'

// Auth Views
import SigninView from '@/ui/views/Authentication/SigninView.vue'
import SignupView from '@/ui/views/Authentication/SignupView.vue'

// Network Views
import NetworkView from '@/ui/views/Network/NetworkDashboardView.vue'
import AccessPointsView from '@/ui/views/Network/AccessPointsView.vue'
import BandwidthView from '@/ui/views/Network/BandwidthView.vue'
import SupportTicketsView from '@/ui/views/Network/SupportTicketsView.vue' 
import TrafficShapingView from '@/ui/views/Network/TrafficShapingView.vue'

const routes = [
  // Sales routes
  {
    path: '/',
    name: 'Dashboard',
    component: DahsboardView,
    meta: {
      title: 'Dashboard'
    }
  },
  {
    path: '/sales',
    name: 'sales',
    component: SalesView,
    meta: {
      title: 'Voucher Sales'
    }
  },
  {
    path: '/agents',
    name: 'agents',
    component: AgentsView,
    meta: {
      title: 'Agents'
    }
  },
  {
    path: '/sites',
    name: 'sites',
    component: SitesView,
    meta: {
      title: 'Sites'
    }
  },
  {
    path: '/vouchers',
    name: 'vouchers',
    component: VouchersView,
    meta: {
      title: 'Vouchers'
    }
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarView,
    meta: {
      title: 'Calendar'
    }
  },

  // Network routes
  {
    path: '/network',
    name: 'network',
    component: NetworkView,
    meta: {
      title: 'Network'
    }
  },
  {
    path: '/accessPoints',
    name: 'accessPoints',
    component: AccessPointsView,
    meta: {
      title: 'Access Points'
    }
  },
  {
    path: '/bandwidth',
    name: 'bandwidth',
    component: BandwidthView,
    meta: {
      title: 'Bandwidth'
    }
  },
  {
    path: '/support',
    name: 'support',
    component: SupportTicketsView,
    meta: {
      title: 'Support Tickets'
    }
  },
  {
    path: '/trafficShaping',
    name: 'trafficShaping',
    component: TrafficShapingView,
    meta: {
      title: 'Traffic Shaping'
    }
  },

  // Account routes
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: 'Profile'
    }
  },
  {
    path: '/pages/settings',
    name: 'settings',
    component: SettingsView,
    meta: {
      title: 'Settings'
    }
  },

  // Auth routes
  {
    path: '/auth/signin',
    name: 'signin',
    component: SigninView,
    meta: {
      title: 'Signin'
    }
  },
  {
    path: '/auth/signup',
    name: 'signup',
    component: SignupView,
    meta: {
      title: 'Signup'
    }
  },

  // Template routes 
  {
    path: '/forms/form-elements',
    name: 'formElements',
    component: FormElementsView,
    meta: {
      title: 'Form Elements'
    }
  },
  {
    path: '/forms/form-layout',
    name: 'formLayout',
    component: FormLayoutView,
    meta: {
      title: 'Form Layout'
    }
  },
  {
    path: '/ui-elements/alerts',
    name: 'alerts',
    component: AlertsView,
    meta: {
      title: 'Alerts'
    }
  },
  {
    path: '/ui-elements/buttons',
    name: 'buttons',
    component: ButtonsView,
    meta: {
      title: 'Buttons'
    }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`
  next()
})

export default router
