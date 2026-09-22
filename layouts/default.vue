<template>
  <div class="cb-app-layout">
    <transition name="cb-route-skeleton">
      <div v-if="isRouteLoading" class="cb-route-skeleton" role="status" aria-live="polite" aria-busy="true">
        <div class="cb-route-skeleton__topline"></div>
        <div class="cb-route-skeleton__shell">
          <div class="cb-route-skeleton__utility">
            <span class="cb-route-skeleton__block cb-route-skeleton__block--utility"></span>
            <span class="cb-route-skeleton__block cb-route-skeleton__block--utility-short"></span>
          </div>

          <header class="cb-route-skeleton__header">
            <span class="cb-route-skeleton__block cb-route-skeleton__block--logo"></span>
            <div class="cb-route-skeleton__nav">
              <span class="cb-route-skeleton__block cb-route-skeleton__block--nav"></span>
              <span class="cb-route-skeleton__block cb-route-skeleton__block--nav"></span>
              <span class="cb-route-skeleton__block cb-route-skeleton__block--nav-short"></span>
            </div>
            <span class="cb-route-skeleton__block cb-route-skeleton__block--search"></span>
          </header>

          <section class="cb-route-skeleton__hero">
            <div class="cb-route-skeleton__hero-copy">
              <span class="cb-route-skeleton__block cb-route-skeleton__block--eyebrow"></span>
              <span class="cb-route-skeleton__block cb-route-skeleton__block--title"></span>
              <span class="cb-route-skeleton__block cb-route-skeleton__block--title-short"></span>
              <span class="cb-route-skeleton__block cb-route-skeleton__block--text"></span>
              <span class="cb-route-skeleton__block cb-route-skeleton__block--text-short"></span>
            </div>
            <div class="cb-route-skeleton__hero-panel">
              <span class="cb-route-skeleton__block cb-route-skeleton__block--panel-title"></span>
              <span class="cb-route-skeleton__block cb-route-skeleton__block--panel-line"></span>
              <span class="cb-route-skeleton__block cb-route-skeleton__block--panel-line"></span>
              <span class="cb-route-skeleton__block cb-route-skeleton__block--panel-line-short"></span>
            </div>
          </section>

          <section class="cb-route-skeleton__content">
            <div class="cb-route-skeleton__heading">
              <span class="cb-route-skeleton__block cb-route-skeleton__block--eyebrow"></span>
              <span class="cb-route-skeleton__block cb-route-skeleton__block--section-title"></span>
            </div>
            <div class="cb-route-skeleton__toolbar">
              <span class="cb-route-skeleton__block cb-route-skeleton__block--input"></span>
              <span class="cb-route-skeleton__block cb-route-skeleton__block--filter"></span>
              <span class="cb-route-skeleton__block cb-route-skeleton__block--filter"></span>
              <span class="cb-route-skeleton__block cb-route-skeleton__block--filter-short"></span>
            </div>
            <div class="cb-route-skeleton__cards">
              <article v-for="card in 3" :key="card" class="cb-route-skeleton__card">
                <span class="cb-route-skeleton__block cb-route-skeleton__block--card-heading"></span>
                <span class="cb-route-skeleton__block cb-route-skeleton__block--card-image"></span>
                <span class="cb-route-skeleton__block cb-route-skeleton__block--card-text"></span>
                <span class="cb-route-skeleton__block cb-route-skeleton__block--card-text-short"></span>
              </article>
            </div>
          </section>
        </div>
      </div>
    </transition>

    <Nuxt />
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      isRouteLoading: true,
      routeLoadToken: 0,
      removeBeforeEach: null,
      removeAfterEach: null,
      documentClickHandler: null
    }
  },
  mounted() {
    this.documentClickHandler = (event) => this.handleDocumentNavigationClick(event)
    document.addEventListener('click', this.documentClickHandler, true)

    this.removeBeforeEach = this.$router.beforeEach((_to, _from, next) => {
      this.routeLoadToken += 1
      this.isRouteLoading = true
      next()
    })

    this.removeAfterEach = this.$router.afterEach(() => {
      this.waitForPageAssets()
    })

    if (typeof this.$router.onError === 'function') {
      this.$router.onError(() => this.finishRouteLoading())
    }

    this.waitForPageAssets()
  },
  beforeDestroy() {
    if (typeof this.removeBeforeEach === 'function') {
      this.removeBeforeEach()
    }

    if (typeof this.removeAfterEach === 'function') {
      this.removeAfterEach()
    }

    if (this.documentClickHandler) {
      document.removeEventListener('click', this.documentClickHandler, true)
    }
  },
  methods: {
    handleDocumentNavigationClick(event) {
      if (!event || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }

      const origin = event.target && typeof event.target.closest === 'function'
        ? event.target.closest('a[href]')
        : null

      if (!origin || origin.hasAttribute('download') || (origin.target && origin.target !== '_self')) {
        return
      }

      const rawHref = origin.getAttribute('href')

      if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:')) {
        return
      }

      let targetUrl

      try {
        targetUrl = new URL(rawHref, window.location.href)
      } catch (error) {
        return
      }

      if (targetUrl.origin !== window.location.origin) {
        return
      }

      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
      const destinationUrl = `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`

      if (currentUrl === destinationUrl) {
        return
      }

      this.routeLoadToken += 1
      this.isRouteLoading = true
    },
    waitForPageAssets() {
      const token = ++this.routeLoadToken
      const startedAt = Date.now()

      const check = () => {
        if (token !== this.routeLoadToken) {
          return
        }

        const elapsed = Date.now() - startedAt
        const pageRoot = document.querySelector('.cb-page')
        const pageReady = pageRoot
          ? pageRoot.classList.contains('cb-page--ready') || elapsed > 8000
          : elapsed >= 800
        const pendingImages = Array.from(document.images).filter((image) => {
          if (image.closest('.cb-route-skeleton') || image.complete) {
            return false
          }

          // Do not keep the whole route covered by a skeleton for images that
          // are intentionally lazy and still far below the viewport.
          if (image.getAttribute('loading') === 'lazy') {
            const bounds = image.getBoundingClientRect()
            const viewportMargin = window.innerHeight * 1.5
            return bounds.top < window.innerHeight + viewportMargin && bounds.bottom > -viewportMargin
          }

          return true
        })

        if (elapsed >= 420 && pageReady && pendingImages.length === 0) {
          this.isRouteLoading = false
          return
        }

        if (elapsed >= 12000) {
          this.isRouteLoading = false
          return
        }

        window.setTimeout(check, pendingImages.length ? 80 : 50)
      }

      this.$nextTick(() => window.setTimeout(check, 0))
    },
    finishRouteLoading() {
      this.routeLoadToken += 1
      this.isRouteLoading = false
    }
  }
}
</script>
