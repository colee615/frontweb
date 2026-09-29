<template>
  <div class="cb-app-layout">
    <transition name="cb-route-skeleton">
      <div v-if="isRouteLoading" class="cb-route-skeleton notranslate" translate="no" role="status" aria-live="polite" aria-busy="true">
        <span class="sr-only">Cargando página en español…</span>
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

        <div class="cb-route-skeleton__courier" aria-hidden="true">
          <div class="cb-route-skeleton__courier-stage">
            <div class="cb-route-skeleton__courier-road">
              <span class="cb-route-skeleton__courier-track"></span>
              <img
                class="cb-route-skeleton__courier-image"
                src="/moto.png"
                alt=""
                width="168"
                height="126"
                fetchpriority="high"
                draggable="false"
              >
            </div>
            <div class="cb-route-skeleton__courier-caption">
              <span class="cb-route-skeleton__courier-status"></span>
              <span>Preparando tu contenido</span>
              <span class="cb-route-skeleton__courier-dots"><i></i><i></i><i></i></span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div ref="pageContent" class="cb-route-content" :inert="isRouteLoading ? '' : null" :aria-busy="isRouteLoading ? 'true' : 'false'">
      <Nuxt />
    </div>
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
      const cssBackgroundAssets = new Map()
      let lastBackgroundScan = 0

      const trackCssBackgroundImages = () => {
        const now = Date.now()
        if (now - lastBackgroundScan < 250) return
        lastBackgroundScan = now

        const pageContent = this.$refs.pageContent
        if (!pageContent) return

        const elements = [pageContent, ...Array.from(pageContent.querySelectorAll('*'))]
        const urlPattern = /url\(\s*(?:"([^"]+)"|'([^']+)'|([^)]*))\s*\)/g

        elements.forEach((element) => {
          const backgroundImage = window.getComputedStyle(element).backgroundImage
          let match

          while ((match = urlPattern.exec(backgroundImage))) {
            const source = (match[1] || match[2] || match[3] || '').trim()
            if (!source || source.charAt(0) === '#' || cssBackgroundAssets.has(source)) continue

            const image = new window.Image()
            const asset = { image, loaded: false }
            const markLoaded = () => { asset.loaded = true }

            image.onload = markLoaded
            image.onerror = markLoaded
            cssBackgroundAssets.set(source, asset)
            image.src = source

            if (image.complete) markLoaded()
          }
        })
      }

      const check = () => {
        if (token !== this.routeLoadToken) {
          return
        }

        const elapsed = Date.now() - startedAt
        const pageRoot = document.querySelector('.cb-page')
        const pageReady = pageRoot
          ? pageRoot.classList.contains('cb-page--ready') || elapsed > 8000
          : elapsed >= 800
        const pageImages = Array.from(document.images).filter((image) => !image.closest('.cb-route-skeleton'))

        // Load lazy images too; the route loader should wait for the complete page on mobile.
        pageImages.forEach((image) => {
          if (image.loading === 'lazy') image.loading = 'eager'
        })

        trackCssBackgroundImages()

        const pendingImages = pageImages.filter((image) => !image.complete)
        const pendingBackgroundImages = Array.from(cssBackgroundAssets.values()).some((asset) => !asset.loaded)

        if (elapsed >= 420 && pageReady && pendingImages.length === 0 && !pendingBackgroundImages) {
          this.finishPageLoad(token)
          return
        }

        window.setTimeout(check, pendingImages.length || pendingBackgroundImages ? 80 : 50)
      }

      this.$nextTick(() => window.setTimeout(check, 0))
    },
    finishPageLoad(token) {
      if (token === this.routeLoadToken) this.isRouteLoading = false
    },
    finishRouteLoading() {
      this.routeLoadToken += 1
      this.isRouteLoading = false
    }
  }
}
</script>
