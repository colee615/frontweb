<template>
  <div class="cb-page" :style="themeStyles" :class="{ 'cb-page--ready': !isBootLoading }">
    <transition name="cb-page-loader">
      <div v-if="isBootLoading" class="cb-page-loading-line" aria-live="polite" aria-busy="true">
        <span />
      </div>
    </transition>

    <div v-if="isBootLoading" class="cb-header-skeleton" aria-hidden="true">
      <div class="cb-shell cb-header-skeleton__top">
        <div class="cb-header-skeleton__meta">
          <span class="cb-skeleton cb-skeleton--meta cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--meta cb-skeleton--shorter cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--meta cb-skeleton--tiny cb-skeleton--wave" />
        </div>
        <div class="cb-header-skeleton__meta cb-header-skeleton__meta--right">
          <span class="cb-skeleton cb-skeleton--meta cb-skeleton--shorter cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--meta cb-skeleton--tiny cb-skeleton--wave" />
        </div>
      </div>
      <div class="cb-shell cb-header-skeleton__main">
        <div class="cb-skeleton cb-skeleton--logo cb-skeleton--wave" />
        <div class="cb-header-skeleton__nav">
          <span class="cb-skeleton cb-skeleton--nav cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--nav cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--nav cb-skeleton--shorter cb-skeleton--wave" />
        </div>
        <div class="cb-header-skeleton__actions">
          <span class="cb-skeleton cb-skeleton--search cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--menu cb-skeleton--wave" />
        </div>
      </div>
    </div>
    <HomeHeader v-else :logo-url="logoUrl" :icons="icons" :content="sectionSettings.header" :links="headerLinks" />

    <div v-if="isBootLoading" class="cb-home-skeleton" aria-hidden="true">
      <section class="cb-home-skeleton__hero">
        <div class="cb-shell cb-home-skeleton__hero-grid">
          <div class="cb-skeleton-card cb-skeleton-card--hero">
            <div class="cb-skeleton cb-skeleton--eyebrow cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--title cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--title cb-skeleton--short cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--medium cb-skeleton--wave" />
          </div>
          <div class="cb-skeleton-card cb-skeleton-card--panel">
            <div class="cb-skeleton cb-skeleton--label cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--input cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--input cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--button cb-skeleton--wave" />
          </div>
        </div>
      </section>

      <section class="cb-section cb-section--tight">
        <div class="cb-shell">
          <div class="cb-home-skeleton__heading">
            <div class="cb-skeleton cb-skeleton--section-title cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--section-text cb-skeleton--wave" />
          </div>
          <div class="cb-home-skeleton__services">
            <div v-for="index in 8" :key="`service-${index}`" class="cb-skeleton-card cb-skeleton-card--service">
              <div class="cb-skeleton cb-skeleton--icon cb-skeleton--wave" />
              <div class="cb-skeleton cb-skeleton--label cb-skeleton--wave" />
              <div class="cb-skeleton cb-skeleton--service-title cb-skeleton--wave" />
              <div class="cb-skeleton cb-skeleton--text cb-skeleton--wave" />
            </div>
          </div>
        </div>
      </section>

      <section class="cb-section cb-section--tight">
        <div class="cb-shell cb-home-skeleton__tools">
          <div class="cb-skeleton-card cb-skeleton-card--tool">
            <div class="cb-skeleton cb-skeleton--panel-title cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--map cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--button cb-skeleton--wave" />
          </div>
          <div class="cb-skeleton-card cb-skeleton-card--tool">
            <div class="cb-skeleton cb-skeleton--panel-title cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--input cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--input cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--input cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--button cb-skeleton--wave" />
          </div>
        </div>
      </section>

      <section class="cb-section cb-section--tight">
        <div class="cb-shell">
          <div class="cb-skeleton-card cb-skeleton-card--banner">
            <div class="cb-skeleton cb-skeleton--banner cb-skeleton--wave" />
          </div>
        </div>
      </section>
    </div>

    <HomeAnnouncementModal
      v-if="!isBootLoading"
      :content="sectionSettings.announcement_modal"
      :slides="announcementSlides"
    />

    <div v-if="!isBootLoading" class="cb-page__content">
      <section id="home-hero">
        <HomeHero :icons="icons" :content="sectionSettings.hero" :slides="heroSlides" />
      </section>
      <section id="home-services">
        <HomeServices :services="services" :icons="icons" :content="sectionSettings.services" />
      </section>
      <section id="home-tools">
        <HomeTools :icons="icons" :content="sectionSettings.tools" :offices="toolOffices" />
      </section>
      <section id="home-app">
        <HomeAppBanner :content="sectionSettings.app_banner" :slides="appBannerSlides" />
      </section>
      <section id="home-market">
        <HomeMarket :products="products" :icons="icons" :content="sectionSettings.market" />
      </section>
      <HomeFooter :logo-url="logoUrl" :icons="icons" :content="sectionSettings.footer" :links="footerLinks" />
    </div>
  </div>
</template>

<script>
import { sanitizeContentTree } from '~/utils/contentSecurity'

const EMPTY_PAGE = {
  meta_title: '',
  meta_description: '',
  theme: {
    logo_url: '',
    primary_color: '#20539a',
    secondary_color: '#2f3f5c',
    accent_color: '#fecc36'
  },
  sections: [
    {
      key: 'announcement_modal',
      settings: {
        enabled: false,
        show_once: false,
        storage_key: 'cb-home-announcement',
        poster_image: '',
        poster_alt: '',
        poster_title: '',
        poster_caption: ''
      },
      items: []
    },
    { key: 'header', settings: { help_label: '', login_label: '', search_placeholder: '', language_primary: '', language_secondary: '', accessibility_label: '' }, items: [] },
    { key: 'hero', settings: { title: '', subtitle: '', tracking_title: '', tracking_text: '', tracking_label: '', tracking_placeholder: '', tracking_button: '' }, items: [] },
    { key: 'services', settings: { title: '', subtitle: '', kicker: '' }, items: [] },
    { key: 'tools', settings: { map_title: '', map_text: '', map_button_label: '', calculator_title: '', calculator_text: '', origin_label: '', origin_placeholder: '', destination_label: '', destination_placeholder: '', weight_label: '', weight_placeholder: '', calculate_button_label: '' }, items: [] },
    { key: 'app_banner', settings: { title: '', text: '', app_store_label: '', play_store_label: '', app_store_url: '', play_store_url: '', background_image: '' }, items: [] },
    { key: 'market', settings: { title: '', subtitle: '', view_all_label: '', view_all_url: '' }, items: [] },
    { key: 'footer', settings: { help_title: '', company_title: '', contact_title: '', social_title: '', social_text: '', address: '', phone: '', email: '', copyright: '', legal_text: '' }, items: [] }
  ]
}

export default {
  name: 'IndexPage',
  data() {
    return {
      isBootLoading: true
    }
  },
  async asyncData({ $api }) {
    try {
      const payload = await $api.$get('/api/site/pages/home')

      return {
        pageContent: normalizePageContent(payload)
      }
    } catch (error) {
      return {
        pageContent: normalizePageContent()
      }
    }
  },
  async mounted() {
    await this.refreshPageContent()
  },
  computed: {
    logoUrl() {
      return this.pageContent.theme.logo_url || ''
    },
    services() {
      return this.getSectionItems('services')
    },
    heroSlides() {
      return this.getSectionItems('hero')
    },
    products() {
      return this.getSectionItems('market')
    },
    toolOffices() {
      return this.getSectionItems('tools')
    },
    headerLinks() {
      return this.getSectionItems('header')
    },
    footerLinks() {
      return this.getSectionItems('footer')
    },
    sectionSettings() {
      return {
        announcement_modal: this.getSectionSettings('announcement_modal'),
        header: this.getSectionSettings('header'),
        hero: this.getSectionSettings('hero'),
        services: this.getSectionSettings('services'),
        tools: this.getSectionSettings('tools'),
        app_banner: this.getSectionSettings('app_banner'),
        market: this.getSectionSettings('market'),
        footer: this.getSectionSettings('footer')
      }
    },
    announcementSlides() {
      return this.getSectionItems('announcement_modal')
    },
    appBannerSlides() {
      const items = this.getSectionItems('app_banner')

      if (items.length) {
        return items
      }

      const settings = this.getSectionSettings('app_banner')

      if (!settings.background_image) {
        return []
      }

      return [{
        title: '',
        image: settings.background_image,
        duration_seconds: 5
      }]
    },
    themeStyles() {
      const theme = this.pageContent.theme || {}

      return {
        '--cb-blue': theme.primary_color || EMPTY_PAGE.theme.primary_color,
        '--cb-yellow': theme.accent_color || EMPTY_PAGE.theme.accent_color,
        '--cb-ink': theme.secondary_color || EMPTY_PAGE.theme.secondary_color
      }
    },
    icons() {
      return {
        search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="20" y1="20" x2="16.65" y2="16.65"></line></svg>',
        plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path></svg>',
        truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="1.5"></circle><circle cx="18.5" cy="18.5" r="1.5"></circle></svg>',
        mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
        box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="M3.3 7l8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>',
        grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
        cube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="M3.3 7l8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>',
        clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v6l4 2"></path></svg>',
        stamp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4.8h8"></path><path d="M6.8 6.2h10.4v11.1H6.8z"></path><path d="M9.4 8.8h5.2v5.4H9.4z"></path><path d="M6.8 9.2H5.6"></path><path d="M6.8 12H5.6"></path><path d="M6.8 14.8H5.6"></path><path d="M18.4 9.2h-1.2"></path><path d="M18.4 12h-1.2"></path><path d="M18.4 14.8h-1.2"></path><path d="M9.2 17.3h5.6"></path></svg>',
        pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
        calculator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"></rect><path d="M9 6h6"></path><path d="M9 11h.01"></path><path d="M12 11h.01"></path><path d="M15 11h.01"></path><path d="M9 15h.01"></path><path d="M12 15h.01"></path><path d="M15 15h.01"></path><path d="M9 19h6"></path></svg>',
        phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"></rect><path d="M12 18h.01"></path></svg>',
        download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 21h14"></path></svg>',
        cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1"></circle><circle cx="18" cy="20" r="1"></circle><path d="M2 3h3l3.6 10.59a1 1 0 0 0 .95.68H19a1 1 0 0 0 .96-.73L22 6H7"></path></svg>',
        'phone-call': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.3a2 2 0 0 1 2.11-.45c.85.3 1.74.52 2.64.64A2 2 0 0 1 22 16.92z"></path></svg>',
        globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
        accessibility: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.8"></circle><path d="M7 8h10"></path><path d="M12 8v5"></path><path d="m9 21 3-6 3 6"></path><path d="m8 12 4 2 4-2"></path></svg>',
        help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"></path><path d="M12 17h.01"></path></svg>',
        login: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path></svg>'
      }
    }
  },
  methods: {
    async refreshPageContent() {
      const startedAt = Date.now()

      try {
        const payload = await this.$api.$get('/api/site/pages/home')
        this.pageContent = normalizePageContent(payload)
      } catch (error) {
      } finally {
        const minimumRevealDelay = 900
        const elapsed = Date.now() - startedAt
        const remaining = Math.max(0, minimumRevealDelay - elapsed)

        window.setTimeout(() => {
          this.isBootLoading = false
        }, remaining)
      }
    },
    getSectionSettings(key) {
      const section = this.pageContent.sections.find((item) => item.key === key)
      return section ? section.settings || {} : {}
    },
    getSectionItems(key) {
      const section = this.pageContent.sections.find((item) => item.key === key)

      if (!section || !Array.isArray(section.items)) {
        return []
      }

      return section.items.map((item) => ({
        ...(item.data || {}),
        id: item.id,
        type: item.type,
        itemName: item.name
      }))
    }
  },
  head() {
    return {
      title: this.pageContent.meta_title || '',
      meta: [
        { hid: 'description', name: 'description', content: this.pageContent.meta_description || '' }
      ],
      htmlAttrs: { lang: 'es' }
    }
  }
}

function normalizePageContent(payload = {}) {
  const sectionMap = payload.section_map || {}
  const fallbackSectionMap = EMPTY_PAGE.sections.reduce((accumulator, section) => {
    accumulator[section.key] = section
    return accumulator
  }, {})

  const normalizedSections = Object.keys(fallbackSectionMap).map((key, index) => {
    const fallbackSection = fallbackSectionMap[key]
    const payloadSection = sectionMap[key] || (Array.isArray(payload.sections) ? payload.sections.find((section) => section.key === key) : null)

    if (!payloadSection) {
      return fallbackSection
    }

    return {
      ...fallbackSection,
      ...payloadSection,
      sort_order: typeof payloadSection.sort_order === 'number' ? payloadSection.sort_order : index,
      settings: {
        ...(fallbackSection.settings || {}),
        ...(payloadSection.settings || {})
      },
      items: Array.isArray(payloadSection.items) ? payloadSection.items : fallbackSection.items
    }
  })

  return {
    ...EMPTY_PAGE,
    ...payload,
    theme: {
      ...EMPTY_PAGE.theme,
      ...sanitizeContentTree(payload.theme || {})
    },
    sections: normalizedSections.map((section) => sanitizeContentTree(section))
  }
}
</script>

<style src="~/assets/css/home.css"></style>
