export const HomeAnnouncementModal = () => import('../..\\components\\HomeAnnouncementModal.vue' /* webpackChunkName: "components/home-announcement-modal" */).then(c => wrapFunctional(c.default || c))
export const HomeAppBanner = () => import('../..\\components\\HomeAppBanner.vue' /* webpackChunkName: "components/home-app-banner" */).then(c => wrapFunctional(c.default || c))
export const HomeBoliviaMap = () => import('../..\\components\\HomeBoliviaMap.vue' /* webpackChunkName: "components/home-bolivia-map" */).then(c => wrapFunctional(c.default || c))
export const HomeFooter = () => import('../..\\components\\HomeFooter.vue' /* webpackChunkName: "components/home-footer" */).then(c => wrapFunctional(c.default || c))
export const HomeHeader = () => import('../..\\components\\HomeHeader.vue' /* webpackChunkName: "components/home-header" */).then(c => wrapFunctional(c.default || c))
export const HomeHero = () => import('../..\\components\\HomeHero.vue' /* webpackChunkName: "components/home-hero" */).then(c => wrapFunctional(c.default || c))
export const HomeMarket = () => import('../..\\components\\HomeMarket.vue' /* webpackChunkName: "components/home-market" */).then(c => wrapFunctional(c.default || c))
export const HomeServices = () => import('../..\\components\\HomeServices.vue' /* webpackChunkName: "components/home-services" */).then(c => wrapFunctional(c.default || c))
export const HomeStatus = () => import('../..\\components\\HomeStatus.vue' /* webpackChunkName: "components/home-status" */).then(c => wrapFunctional(c.default || c))
export const HomeTools = () => import('../..\\components\\HomeTools.vue' /* webpackChunkName: "components/home-tools" */).then(c => wrapFunctional(c.default || c))
export const StatusPage = () => import('../..\\components\\StatusPage.vue' /* webpackChunkName: "components/status-page" */).then(c => wrapFunctional(c.default || c))

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
