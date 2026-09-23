<template>
  <header
    ref="header"
    :class="['cb-header', { 'cb-header--navbar-fixed': isNavbarPinned }]"
    :style="{ '--cb-navbar-height': `${navbarHeight}px` }"
  >
    <div v-if="headlineItems.length" ref="newsbar" class="cb-news-ticker">
      <div :class="['cb-news-ticker__inner', { 'cb-news-ticker__inner--static': !isTickerAnimated }]">
        <div class="cb-news-ticker__main">
          <span v-if="tickerLabel" class="cb-news-ticker__badge">{{ tickerLabel }}</span>
          <div :class="['cb-news-ticker__viewport', { 'cb-news-ticker__viewport--static': !isTickerAnimated }]" aria-live="polite">
            <div class="cb-news-ticker__track" @animationiteration="rotateTicker">
              <button
                v-for="(item, index) in tickerItems"
                :key="`headline-${index}`"
                type="button"
                :class="['cb-news-ticker__item', { 'cb-news-ticker__item--cycle-end': (index + 1) % orderedTickerItems.length === 0 }]"
                @click="openHeadline(item)"
              >
                <span class="cb-news-ticker__item-text">{{ item.title }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="cb-topbar-group cb-topbar-group--right">
          <button
            type="button"
            class="cb-top-link cb-top-link--language"
            aria-label="Traducir sitio al inglés"
            title="Traducir al inglés"
            @click="openEnglishTranslation"
          >
            <span class="cb-top-link__icon" aria-hidden="true" v-html="icons.globe"></span>
            <span class="cb-top-link__text">
              <span class="cb-top-link__light-es">ES</span>
              <strong class="cb-top-link__language-primary">{{ content.language_primary || 'Español' }}</strong>
              <span class="cb-top-link__sep">|</span>
              <span class="cb-top-link__light-us">US</span>
              <strong>{{ content.language_secondary || 'English' }}</strong>
            </span>
          </button>
          <button type="button" class="cb-top-link" @click="goToContact">
            <span class="cb-top-link__icon cb-top-link__icon--help" aria-hidden="true" v-html="icons.help"></span>
            <span class="cb-top-link__text">
              <span>{{ content.help_label || 'Ayuda / Contacto' }}</span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <div ref="navbar" :class="['cb-navbar', { 'cb-navbar--fixed': isNavbarPinned }]">
      <div class="cb-shell cb-navbar-inner">
        <nuxt-link class="cb-logo" to="/">
          <img :src="logoUrl" alt="Correos de Bolivia">
        </nuxt-link>

        <nav class="cb-nav-links">
          <component
            :is="isInternalRoute(link.url) ? 'nuxt-link' : 'a'"
            v-for="link in navLinks"
            :key="`${link.label}-${link.url}`"
            v-bind="linkAttrs(link.url)"
          >
            {{ link.label }}
          </component>
        </nav>

        <div class="cb-nav-actions">
          <div ref="searchShell" class="cb-search-shell">
            <form class="cb-search-pill" @submit.prevent="submitSearch">
              <span class="cb-inline-icon" v-html="icons.search"></span>
              <input
                ref="searchInput"
                v-model.trim="searchTerm"
                type="search"
                :placeholder="content.search_placeholder || 'Buscar...'"
                aria-label="Buscar contenido"
                :aria-expanded="isSearchOpen ? 'true' : 'false'"
                aria-autocomplete="list"
                @focus="handleSearchFocus"
                @input="handleSearchInput"
                @keydown.down.prevent="moveSearchSelection(1)"
                @keydown.up.prevent="moveSearchSelection(-1)"
                @keydown.enter.prevent="submitSearch"
                @keydown.esc.prevent="closeSearch"
              >
            </form>

            <transition name="cb-search-flyout">
              <div v-if="isSearchOpen && searchResults.length" class="cb-search-dropdown">
                <div class="cb-search-dropdown__head">
                  <strong>Resultados sugeridos</strong>
                  <span>{{ searchResults.length }} opcion{{ searchResults.length === 1 ? '' : 'es' }}</span>
                </div>

                <button
                  v-for="(result, index) in searchResults"
                  :key="result.id"
                  type="button"
                  :class="['cb-search-result', { 'is-active': index === activeSearchIndex }]"
                  @mouseenter="activeSearchIndex = index"
                  @mousedown.prevent="navigateToResult(result)"
                >
                  <span v-if="result.image" class="cb-search-result__thumb">
                    <img :src="result.image" alt="">
                  </span>
                  <span v-else class="cb-search-result__icon">{{ result.type === 'Pagina' ? 'Pg' : (result.type === 'Noticia' ? 'Nt' : 'Ir') }}</span>
                  <span class="cb-search-result__body">
                    <span class="cb-search-result__meta">
                      <span class="cb-search-result__pill">{{ result.type }}</span>
                      <span>{{ result.section }}</span>
                    </span>
                    <strong v-html="highlightResult(result.label)"></strong>
                    <small v-html="highlightResult(result.description)"></small>
                  </span>
                </button>
              </div>
            </transition>
          </div>

          <button
            class="cb-menu-btn"
            type="button"
            :aria-expanded="isMenuOpen ? 'true' : 'false'"
            aria-label="Abrir menu"
            @click="toggleMenu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <transition name="cb-mobile-menu">
        <div v-if="isMenuOpen" class="cb-mobile-nav">
          <div class="cb-shell cb-mobile-nav__inner">
            <component
              :is="isInternalRoute(link.url) ? 'nuxt-link' : 'a'"
              v-for="link in navLinks"
              :key="`mobile-${link.label}-${link.url}`"
              class="cb-mobile-nav__link"
              v-bind="linkAttrs(link.url)"
              @click.native="closeMenu"
            >
              {{ link.label }}
            </component>
          </div>
        </div>
      </transition>
    </div>

    <div id="cb-google-translate" class="cb-google-translate" aria-hidden="true"></div>
  </header>
</template>

<script>
import { buildSearchEntriesFromPayloads, highlightSearchMatch, searchSiteEntries } from '~/utils/siteSearch'

const CONTACT_ROUTE = '/contacto'

export default {
  name: 'HomeHeader',
  props: {
    logoUrl: {
      type: String,
      required: true
    },
    icons: {
      type: Object,
      required: true
    },
    content: {
      type: Object,
      default: () => ({})
    },
    links: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isMenuOpen: false,
      searchTerm: '',
      isSearchOpen: false,
      activeSearchIndex: 0,
      searchEntries: [],
      isSearchReady: false,
      searchTimer: null,
      headlineItems: [],
      tickerOffset: 0,
      isNavbarPinned: false,
      navbarHeight: 64,
      googleTranslatePromise: null,
      googleTranslateInitialized: false
    }
  },
  computed: {
    tickerLabel() {
      return String(this.content.news_ticker_label || 'NOVEDADES').trim()
    },
    isTickerAnimated() {
      return this.headlineItems.length > 1
    },
    orderedTickerItems() {
      const sourceItems = Array.isArray(this.headlineItems) ? this.headlineItems : []
      const findItem = (keywords, fallback) => sourceItems.find((item) => {
        const label = this.normalizeLabel(item && item.title)
        return keywords.some((keyword) => label.includes(keyword))
      }) || fallback

      return [
        findItem(['siguenos', 'rrss', 'redes sociales'], {
          id: 'fallback-social',
          title: 'SÍGUENOS EN NUESTRAS RRSS',
          url: '/noticias'
        }),
        findItem(['delivery express', 'delivery'], {
          id: 'fallback-delivery',
          title: 'DELIVERY EXPRESS',
          url: '/deliveryexpress'
        }),
        findItem(['servicio al cliente', 'contacto', 'consulta'], {
          id: 'fallback-customer-service',
          title: 'SERVICIO AL CLIENTE',
          url: '/contacto'
        })
      ]
    },
    tickerItems() {
      const items = this.orderedTickerItems
      const offset = items.length ? this.tickerOffset % items.length : 0
      const rotatedItems = [...items.slice(offset), ...items.slice(0, offset)]

      return this.isTickerAnimated
        ? Array.from({ length: 4 }, () => rotatedItems).flat()
        : rotatedItems
    },
    navLinks() {
      const sourceLinks = Array.isArray(this.links) ? this.links : []
      const findLink = (keywords) => sourceLinks.find((link) => {
        const normalizedLabel = this.normalizeLabel(link.label)
        return keywords.some((keyword) => normalizedLabel.includes(keyword))
      })
      const buildNavLink = ({ label, keywords, fallbackUrl, preferOriginalUrl = false }) => {
        const sourceLink = findLink(keywords)
        const originalUrl = sourceLink && typeof sourceLink.url === 'string'
          ? sourceLink.url.trim()
          : ''

        let resolvedUrl = fallbackUrl

        if (sourceLink) {
          resolvedUrl = preferOriginalUrl && originalUrl && originalUrl !== '#'
            ? originalUrl
            : this.resolveRoute(sourceLink)
        }

        return {
          ...(sourceLink || {}),
          label,
          url: resolvedUrl || fallbackUrl || '#'
        }
      }

      return [
        buildNavLink({
          label: '¿Quiénes somos?',
          keywords: ['quienes somos'],
          fallbackUrl: '/quienes-somos'
        }),
        buildNavLink({
          label: 'Noticias',
          keywords: ['noticias'],
          fallbackUrl: '/noticias'
        }),
        buildNavLink({
          label: 'Contáctanos',
          keywords: ['contacto', 'contactanos', 'consulta'],
          fallbackUrl: CONTACT_ROUTE
        }),
        buildNavLink({
          label: 'Institucional',
          keywords: ['institucional'],
          fallbackUrl: '#',
          preferOriginalUrl: true
        }),
        buildNavLink({
          label: 'Delivery Express',
          keywords: ['delivery express', 'delivery'],
          fallbackUrl: '/deliveryexpress'
        })
      ]
    },
    searchResults() {
      const query = this.searchTerm.trim()
      const results = query
        ? searchSiteEntries(query, this.searchEntries, this.$route.path)
        : []

      return results.map((result) => {
        if (result.anchor === 'site-footer' && ['/', '/noticias', '/quienes-somos', '/ems', '/deliveryexpress', '/eca', '/encomienda'].includes(this.$route.path)) {
          return {
            ...result,
            route: this.$route.path
          }
        }

        return result
      })
    }
  },
  watch: {
    $route() {
      this.closeMenu()
      this.closeSearch()
      this.searchTerm = ''
    },
    searchResults() {
      this.activeSearchIndex = 0
      this.isSearchOpen = this.searchResults.length > 0 && this.searchTerm.trim().length > 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.measureNavbar()
      this.handleScroll()
    })

    this.loadHeadlines()
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    window.addEventListener('resize', this.handleResize, { passive: true })
    document.addEventListener('click', this.handleDocumentClick)
  },
  beforeDestroy() {
    if (this.searchTimer) {
      window.clearTimeout(this.searchTimer)
    }

    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('click', this.handleDocumentClick)
  },
  methods: {
    async loadHeadlines() {
      const configuredItems = Array.isArray(this.content.news_ticker_items)
        ? this.content.news_ticker_items
          .map((item, index) => {
            const title = String((item && (item.title || item.label)) || '').trim()
            const url = String((item && item.url) || '').trim() || '/noticias'

            if (!title) {
              return null
            }

            return {
              id: item.id || `configured-${index}`,
              title,
              url
            }
          })
          .filter(Boolean)
        : []

      this.headlineItems = configuredItems.length
        ? configuredItems
        : [
            { id: 'fallback-1', title: 'SÍGUENOS EN NUESTRAS RRSS', url: '/noticias' },
            { id: 'fallback-2', title: 'DELIVERY EXPRESS', url: '/deliveryexpress' },
            { id: 'fallback-3', title: 'SERVICIO AL CLIENTE', url: '/contacto' }
          ]

      this.$nextTick(() => {
        this.handleScroll()
      })
    },
    openHeadline(item) {
      if (!item) {
        return
      }

      const targetUrl = String(item.url || '').trim()

      if (!targetUrl) {
        return
      }

      if (this.isInternalRoute(targetUrl)) {
        this.$router.push(targetUrl)
        return
      }

      window.open(targetUrl, '_blank', 'noopener')
    },
    rotateTicker() {
      if (this.orderedTickerItems.length > 1) {
        this.tickerOffset = (this.tickerOffset + 1) % this.orderedTickerItems.length
      }
    },
    resolveRoute(link) {
      const label = this.normalizeLabel(link.label)
      const url = typeof link.url === 'string' ? link.url.trim() : ''

      if (label.includes('quienes somos')) {
        return '/quienes-somos'
      }

      if (label.includes('ems') || label.includes('express mail')) {
        return '/ems'
      }

      if (label.includes('delivery express') || label.includes('delivery')) {
        return '/deliveryexpress'
      }

      if (label.includes('eca')) {
        return '/eca'
      }

      if (label.includes('encomienda')) {
        return '/encomienda'
      }

      if (label.includes('noticias')) {
        return '/noticias'
      }

      if (
        label.includes('contacto') ||
        label.includes('contactanos') ||
        label.includes('consulta')
      ) {
        return CONTACT_ROUTE
      }

      if (url && url !== '#') {
        return url
      }

      return url || '#'
    },
    normalizeLabel(value) {
      if (typeof value !== 'string') {
        return ''
      }

      return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()
    },
    isInternalRoute(url) {
      return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//')
    },
    linkAttrs(url) {
      if (this.isInternalRoute(url)) {
        return { to: url }
      }

      return { href: url || '#' }
    },
    handleSearchFocus() {
      if (this.searchTerm.trim() && this.searchResults.length) {
        this.isSearchOpen = true
      }
    },
    handleSearchInput() {
      if (this.searchTimer) {
        window.clearTimeout(this.searchTimer)
      }

      const query = this.searchTerm.trim()

      if (!query) {
        this.closeSearch()
        return
      }

      this.searchTimer = window.setTimeout(async () => {
        await this.ensureSearchEntries()
        this.activeSearchIndex = 0
        this.isSearchOpen = this.searchResults.length > 0
      }, 160)
    },
    closeSearch() {
      this.isSearchOpen = false
      this.activeSearchIndex = 0
    },
    handleDocumentClick(event) {
      const shell = this.$refs.searchShell

      if (!shell || shell.contains(event.target)) {
        return
      }

      this.closeSearch()
    },
    moveSearchSelection(direction) {
      if (!this.searchResults.length) {
        return
      }

      this.isSearchOpen = true

      const nextIndex = this.activeSearchIndex + direction

      if (nextIndex < 0) {
        this.activeSearchIndex = this.searchResults.length - 1
        return
      }

      if (nextIndex >= this.searchResults.length) {
        this.activeSearchIndex = 0
        return
      }

      this.activeSearchIndex = nextIndex
    },
    highlightResult(text) {
      return highlightSearchMatch(text, this.searchTerm)
    },
    async ensureSearchEntries() {
      if (this.isSearchReady) {
        return
      }

      try {
        const payloads = await Promise.all([
          this.$api.$get('/frontapi/api/site/pages/home'),
          this.$api.$get('/frontapi/api/site/pages/quienes-somos'),
          this.$api.$get('/frontapi/api/site/pages/noticias'),
          this.$api.$get('/frontapi/api/site/pages/deliveryexpress'),
          this.$api.$get('/frontapi/api/site/pages/eca'),
          this.$api.$get('/frontapi/api/site/pages/encomienda')
        ])

        this.searchEntries = buildSearchEntriesFromPayloads(payloads)
      } catch (error) {
        this.searchEntries = []
      } finally {
        this.isSearchReady = true
      }
    },
    async navigateToResult(result) {
      const targetHash = result.anchor ? `#${result.anchor}` : ''
      this.closeSearch()
      this.closeMenu()

      if (this.$route.path === result.route) {
        if (targetHash) {
          this.scrollToAnchor(result.anchor)
        }
        return
      }

      await this.$router.push({
        path: result.route,
        hash: targetHash
      })

      if (result.anchor) {
        window.setTimeout(() => this.scrollToAnchor(result.anchor), 180)
      }
    },
    scrollToAnchor(anchor) {
      const tryScroll = (attempt = 0) => {
        const target = document.getElementById(anchor)

        if (!target) {
          if (attempt < 10) {
            window.setTimeout(() => tryScroll(attempt + 1), 140)
          }
          return
        }

        const offset = this.navbarHeight + 16
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset
        window.scrollTo({ top, behavior: 'smooth' })
        this.flashTarget(target)
      }

      tryScroll()
    },
    flashTarget(target) {
      if (!target) {
        return
      }

      target.classList.remove('cb-search-target-flash')
      void target.offsetWidth
      target.classList.add('cb-search-target-flash')

      window.setTimeout(() => {
        target.classList.remove('cb-search-target-flash')
      }, 1800)
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    closeMenu() {
      this.isMenuOpen = false
    },
    handleResize() {
      this.measureNavbar()
      this.handleScroll()
    },
    handleScroll() {
      const newsbar = this.$refs.newsbar
      const topbar = this.$refs.topbar

      if ((!topbar && !newsbar) || typeof window === 'undefined') {
        this.isNavbarPinned = false
        return
      }

      const threshold = (newsbar ? newsbar.offsetHeight : 0) + (topbar ? topbar.offsetHeight : 0)
      this.isNavbarPinned = window.scrollY > threshold
    },
    measureNavbar() {
      const navbar = this.$refs.navbar

      if (navbar) {
        this.navbarHeight = Math.max(Math.round(navbar.offsetHeight), 64)
      }
    },
    submitSearch() {
      if (!this.searchResults.length) {
        return
      }

      const target = this.searchResults[this.activeSearchIndex] || this.searchResults[0]
      this.navigateToResult(target)
    },
    goToContact() {
      if (this.$route.path === '/contacto') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      this.$router.push('/contacto')
    },
    async openEnglishTranslation() {
      if (!process.client) {
        return
      }

      try {
        await this.ensureGoogleTranslate()
        this.applyGoogleLanguage('en')
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('No se pudo cargar Google Translate.', error)
        }
      }
    },
    ensureGoogleTranslate() {
      if (this.googleTranslatePromise) {
        return this.googleTranslatePromise
      }

      this.googleTranslatePromise = new Promise((resolve, reject) => {
        const initialize = () => {
          if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) {
            reject(new Error('Google Translate no está disponible.'))
            return
          }

          const mount = document.getElementById('cb-google-translate')

          if (!mount) {
            reject(new Error('No se encontró el contenedor de Google Translate.'))
            return
          }

          if (!this.googleTranslateInitialized) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'es',
                includedLanguages: 'es,en',
                autoDisplay: false
              },
              'cb-google-translate'
            )
            this.googleTranslateInitialized = true
          }

          this.$nextTick(resolve)
        }

        if (window.google && window.google.translate && window.google.translate.TranslateElement) {
          initialize()
          return
        }

        window.cbGoogleTranslateInit = initialize

        let script = document.getElementById('cb-google-translate-script')

        if (!script) {
          script = document.createElement('script')
          script.id = 'cb-google-translate-script'
          script.src = 'https://translate.google.com/translate_a/element.js?cb=cbGoogleTranslateInit'
          script.async = true
          script.onerror = () => reject(new Error('No se pudo cargar Google Translate.'))
          document.head.appendChild(script)
        } else {
          script.addEventListener('load', initialize, { once: true })
        }
      })

      return this.googleTranslatePromise
    },
    async applyGoogleLanguage(language) {
      for (let attempt = 0; attempt < 20; attempt += 1) {
        const select = document.querySelector('#cb-google-translate select.goog-te-combo') || document.querySelector('select.goog-te-combo')

        if (select) {
          select.value = language
          select.dispatchEvent(new Event('change'))
          return
        }

        await new Promise((resolve) => window.setTimeout(resolve, 50))
      }
    }
  }
}
</script>


