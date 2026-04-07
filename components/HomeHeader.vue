<template>
  <header class="cb-header">
    <div class="cb-topbar cb-shell">
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
        <button type="button" class="cb-top-link">
          <span class="cb-top-link__icon" v-html="icons.accessibility"></span>
          <span class="cb-top-link__text">{{ content.accessibility_label || '' }}</span>
        </button>
      </div>

      <div class="cb-topbar-group cb-topbar-group--right">
        <button type="button" class="cb-top-link">
          <span class="cb-top-link__icon" v-html="icons.help"></span>
          <span class="cb-top-link__text">
            <span>{{ content.help_label || '' }}</span>
          </span>
        </button>
        <button type="button" class="cb-top-link">
          <span class="cb-top-link__icon" v-html="icons.login"></span>
          <span class="cb-top-link__text"><span>{{ content.login_label || '' }}</span></span>
        </button>
      </div>
    </div>

    <div class="cb-navbar">
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
          <form class="cb-search-pill" @submit.prevent="submitSearch">
            <span class="cb-inline-icon" v-html="icons.search"></span>
            <input
              v-model.trim="searchTerm"
              type="search"
              :placeholder="content.search_placeholder || 'Buscar...'"
              aria-label="Buscar contenido"
            >
          </form>
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
      searchTerm: ''
    }
  },
  computed: {
    navLinks() {
      return this.links.map((link) => ({
        ...link,
        url: this.resolveRoute(link)
      }))
    }
  },
  watch: {
    $route() {
      this.syncSearchFromRoute()
      this.closeMenu()
    }
  },
  mounted() {
    this.syncSearchFromRoute()
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
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    closeMenu() {
      this.isMenuOpen = false
    },
    submitSearch() {
      const query = this.searchTerm.trim()
      const target = {
        path: '/noticias',
        query: query ? { q: query } : {}
      }

      if (this.$route.path === '/noticias' && (this.$route.query.q || '') === query) {
        return
      }

      this.$router.push(target)
      this.closeMenu()
    },
    syncSearchFromRoute() {
      this.searchTerm = typeof this.$route.query.q === 'string' ? this.$route.query.q : ''
    }
  }
}
</script>
