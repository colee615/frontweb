<template>
  <div class="cb-page cb-page--ready cb-status-page" :style="themeStyles">
    <HomeHeader :logo-url="logoUrl" :icons="icons" :content="headerSettings" :links="headerLinks" />

    <main class="cb-status">
      <section class="cb-status-content" aria-labelledby="status-title">
        <h1 id="status-title" class="cb-status-visually-hidden">{{ statusTitle }}</h1>
        <div class="cb-status-poster-frame">
          <img class="cb-status-poster" :src="poster.src" :alt="poster.alt">
        </div>
        <nav class="cb-status-actions" aria-label="Opciones de navegación">
          <nuxt-link to="/" class="cb-status-button">
            <svg class="cb-status-button__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M3 10.7 12 3l9 7.7v9.1a1.2 1.2 0 0 1-1.2 1.2h-5.1v-6.2H9.3V21H4.2A1.2 1.2 0 0 1 3 19.8z" />
            </svg>
            <span>Volver al Inicio</span>
          </nuxt-link>
        </nav>
      </section>
    </main>

    <HomeFooter :logo-url="logoUrl" :icons="icons" :content="footerSettings" :links="footerLinks" />
  </div>
</template>

<script>
export default {
  name: 'StatusPage',
  props: {
    variant: { type: String, default: 'not-found' },
    sitePage: { type: Object, default: () => ({ theme: {}, section_map: {}, sections: [] }) }
  },
  computed: {
    isNotFound() { return this.variant === 'not-found' },
    statusTitle() {
      return this.isNotFound
        ? '404. Página no encontrada.'
        : 'Estamos trabajando. La página estará disponible próximamente.'
    },
    poster() {
      return this.isNotFound
        ? { src: '/404.png', alt: 'Correos de Bolivia: página no encontrada. La dirección puede no estar disponible o haber sido movida.' }
        : { src: '/desarrollo.png', alt: 'Correos de Bolivia: página en desarrollo. Estamos trabajando para brindarte una mejor experiencia.' }
    },
    logoUrl() { return (this.sitePage.theme && this.sitePage.theme.logo_url) || '' },
    headerSettings() { return this.getSectionSettings('header') },
    footerSettings() { return this.getSectionSettings('footer') },
    headerLinks() { return this.getSectionItems('header') },
    footerLinks() { return this.getSectionItems('footer') },
    themeStyles() {
      const theme = this.sitePage.theme || {}
      return { '--cb-blue': theme.primary_color || '#20539a', '--cb-yellow': theme.accent_color || '#fecc36', '--cb-ink': theme.secondary_color || '#2f3f5c' }
    },
    icons() {
      return {
        search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>',
        globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"></path></svg>',
        help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4M12 17h.01"></path></svg>'
      }
    }
  },
  methods: {
    getSection(key) {
      const sectionMap = this.sitePage.section_map || {}
      return (this.sitePage.sections || []).find((section) => section.key === key) || sectionMap[key] || null
    },
    getSectionSettings(key) {
      const section = this.getSection(key)
      return section ? section.settings || {} : {}
    },
    getSectionItems(key) {
      const section = this.getSection(key)
      return section && Array.isArray(section.items) ? section.items.map((item) => ({ ...(item.data || {}), id: item.id, type: item.type, itemName: item.name })) : []
    }
  }
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/status-pages.css"></style>
