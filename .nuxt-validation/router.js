import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _a531090e = () => interopDefault(import('..\\pages\\404.vue' /* webpackChunkName: "pages/404" */))
const _d5105f16 = () => interopDefault(import('..\\pages\\casillas.vue' /* webpackChunkName: "pages/casillas" */))
const _20e9d95e = () => interopDefault(import('..\\pages\\contacto.vue' /* webpackChunkName: "pages/contacto" */))
const _667442b0 = () => interopDefault(import('..\\pages\\correspondencia-agrupada.vue' /* webpackChunkName: "pages/correspondencia-agrupada" */))
const _0affd3bd = () => interopDefault(import('..\\pages\\deliveryexpress.vue' /* webpackChunkName: "pages/deliveryexpress" */))
const _26fa1c44 = () => interopDefault(import('..\\pages\\eca.vue' /* webpackChunkName: "pages/eca" */))
const _3908398c = () => interopDefault(import('..\\pages\\ems.vue' /* webpackChunkName: "pages/ems" */))
const _22c9c4e6 = () => interopDefault(import('..\\pages\\encomienda.vue' /* webpackChunkName: "pages/encomienda" */))
const _a9fd77ec = () => interopDefault(import('..\\pages\\informacion-postal.vue' /* webpackChunkName: "pages/informacion-postal" */))
const _b0ffc2d6 = () => interopDefault(import('..\\pages\\misaplicaciones.vue' /* webpackChunkName: "pages/misaplicaciones" */))
const _30c3a96e = () => interopDefault(import('..\\pages\\misaplicaicones.vue' /* webpackChunkName: "pages/misaplicaicones" */))
const _30005c45 = () => interopDefault(import('..\\pages\\noticias\\index.vue' /* webpackChunkName: "pages/noticias/index" */))
const _4646a4a8 = () => interopDefault(import('..\\pages\\politica-de-privacidad.vue' /* webpackChunkName: "pages/politica-de-privacidad" */))
const _772f4f67 = () => interopDefault(import('..\\pages\\politica-privacidad-trackingbo-app.vue' /* webpackChunkName: "pages/politica-privacidad-trackingbo-app" */))
const _04f5d43d = () => interopDefault(import('..\\pages\\postalshopper.vue' /* webpackChunkName: "pages/postalshopper" */))
const _5415d2f6 = () => interopDefault(import('..\\pages\\quienes-somos.vue' /* webpackChunkName: "pages/quienes-somos" */))
const _082ff062 = () => interopDefault(import('..\\pages\\trabajando.vue' /* webpackChunkName: "pages/trabajando" */))
const _d485af5c = () => interopDefault(import('..\\pages\\tramites.vue' /* webpackChunkName: "pages/tramites" */))
const _152c37d3 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _3a12abed = () => interopDefault(import('..\\pages\\noticias\\_id.vue' /* webpackChunkName: "pages/noticias/_id" */))
const _715d9d60 = () => interopDefault(import('..\\pages\\_.vue' /* webpackChunkName: "pages/_" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/404",
    component: _a531090e,
    name: "404"
  }, {
    path: "/casillas",
    component: _d5105f16,
    name: "casillas"
  }, {
    path: "/contacto",
    component: _20e9d95e,
    name: "contacto"
  }, {
    path: "/correspondencia-agrupada",
    component: _667442b0,
    name: "correspondencia-agrupada"
  }, {
    path: "/deliveryexpress",
    component: _0affd3bd,
    name: "deliveryexpress"
  }, {
    path: "/eca",
    component: _26fa1c44,
    name: "eca"
  }, {
    path: "/ems",
    component: _3908398c,
    name: "ems"
  }, {
    path: "/encomienda",
    component: _22c9c4e6,
    name: "encomienda"
  }, {
    path: "/informacion-postal",
    component: _a9fd77ec,
    name: "informacion-postal"
  }, {
    path: "/misaplicaciones",
    component: _b0ffc2d6,
    name: "misaplicaciones"
  }, {
    path: "/misaplicaicones",
    component: _30c3a96e,
    name: "misaplicaicones"
  }, {
    path: "/noticias",
    component: _30005c45,
    name: "noticias"
  }, {
    path: "/politica-de-privacidad",
    component: _4646a4a8,
    name: "politica-de-privacidad"
  }, {
    path: "/politica-privacidad-trackingbo-app",
    component: _772f4f67,
    name: "politica-privacidad-trackingbo-app"
  }, {
    path: "/postalshopper",
    component: _04f5d43d,
    name: "postalshopper"
  }, {
    path: "/quienes-somos",
    component: _5415d2f6,
    name: "quienes-somos"
  }, {
    path: "/trabajando",
    component: _082ff062,
    name: "trabajando"
  }, {
    path: "/tramites",
    component: _d485af5c,
    name: "tramites"
  }, {
    path: "/",
    component: _152c37d3,
    name: "index"
  }, {
    path: "/noticias/:id",
    component: _3a12abed,
    name: "noticias-id"
  }, {
    path: "/*",
    component: _715d9d60,
    name: "all"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
