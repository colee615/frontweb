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
        <a class="cb-logo" href="#">
          <img :src="logoUrl" alt="Correos de Bolivia">
        </a>

        <nav class="cb-nav-links">
          <a v-for="link in navLinks" :key="link.label" :href="link.url || '#'">{{ link.label }}</a>
        </nav>

        <div class="cb-nav-actions">
          <button class="cb-search-pill" type="button">
            <span class="cb-inline-icon" v-html="icons.search"></span>
            <span>{{ content.search_placeholder || '' }}</span>
          </button>
          <button class="cb-menu-btn" type="button" aria-label="Abrir menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
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
  computed: {
    navLinks() {
      return this.links
    }
  }
}
</script>
