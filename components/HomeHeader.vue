<template>
  <header
    ref="header"
    :class="['cb-header', { 'cb-header--navbar-fixed': isNavbarPinned }]"
    :style="{ '--cb-navbar-height': `${navbarHeight}px` }"
  >
    <div ref="topbar" class="cb-topbar cb-shell">
      <div class="cb-topbar-group cb-topbar-group--left">
        <button type="button" class="cb-top-link">
          <span class="cb-top-link__icon" v-html="icons.globe"></span>
          <span class="cb-top-link__text">
            <span class="cb-top-link__light-es">ES</span>
            <strong>{{ content.language_primary || '' }}</strong>
            <span class="cb-top-link__sep">|</span>
            <span class="cb-top-link__light-us">US</span>
            <strong>{{ content.language_secondary || '' }}</strong>
          </span>
        </button>
        <button type="button" class="cb-top-link cb-top-link--hidden">
          <span class="cb-top-link__icon" v-html="icons.accessibility"></span>
          <span class="cb-top-link__text">{{ content.accessibility_label || '' }}</span>
        </button>
      </div>

      <div class="cb-topbar-group cb-topbar-group--right">
        <button type="button" class="cb-top-link" @click="scrollToFooter">
          <span class="cb-top-link__icon" v-html="icons.help"></span>
          <span class="cb-top-link__text">
            <span>{{ content.help_label || '' }}</span>
          </span>
        </button>
        <button type="button" class="cb-top-link cb-top-link--hidden">
          <span class="cb-top-link__icon" v-html="icons.login"></span>
          <span class="cb-top-link__text"><span>{{ content.login_label || '' }}</span></span>
        </button>
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
  </header>
</template>

<script>
import { buildSearchEntriesFromPayloads, highlightSearchMatch, searchSiteEntries } from '~/utils/siteSearch'

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
      isNavbarPinned: false,
      navbarHeight: 64
    }
  },
  computed: {
    navLinks() {
      return this.links.map((link) => ({
        ...link,
        url: this.resolveRoute(link)
      }))
    },
    searchResults() {
      const query = this.searchTerm.trim()
      const results = query
        ? searchSiteEntries(query, this.searchEntries, this.$route.path)
        : []

      return results.map((result) => {
        if (result.anchor === 'site-footer' && ['/', '/noticias', '/quienes-somos'].includes(this.$route.path)) {
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
    resolveRoute(link) {
      const label = this.normalizeLabel(link.label)
      const url = typeof link.url === 'string' ? link.url.trim() : ''

      if (url && url !== '#') {
        return url
      }

      if (label.includes('quienes somos')) {
        return '/quienes-somos'
      }

      if (label.includes('noticias')) {
        return '/noticias'
      }

      return '#'
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
          this.$api.$get('/api/site/pages/home'),
          this.$api.$get('/api/site/pages/quienes-somos'),
          this.$api.$get('/api/site/pages/noticias')
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
      const topbar = this.$refs.topbar

      if (!topbar || typeof window === 'undefined') {
        this.isNavbarPinned = false
        return
      }

      this.isNavbarPinned = window.scrollY > topbar.offsetHeight
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
    scrollToFooter() {
      const footer = document.getElementById('site-footer')

      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }
}
</script>
