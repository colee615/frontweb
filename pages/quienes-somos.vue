<template>
  <div class="cb-page cb-about-page" :style="themeStyles" :class="{ 'cb-page--ready': !isBootLoading }">
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
    <HomeHeader v-else :logo-url="logoUrl" :icons="icons" :content="headerSettings" :links="headerLinks" />

    <div v-if="isBootLoading" class="cb-home-skeleton cb-about-skeleton" aria-hidden="true">
      <section class="cb-home-skeleton__hero">
        <div class="cb-shell cb-home-skeleton__hero-grid cb-about-skeleton__hero-grid">
          <div class="cb-skeleton-card cb-skeleton-card--hero cb-about-skeleton__hero-card">
            <div class="cb-skeleton cb-skeleton--eyebrow cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--title cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--title cb-skeleton--short cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--medium cb-skeleton--wave" />
          </div>
        </div>
      </section>

      <section class="cb-section cb-section--tight">
        <div class="cb-shell cb-about-skeleton__mission">
          <div class="cb-skeleton-card cb-skeleton-card--tool">
            <div class="cb-skeleton cb-skeleton--section-title cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--medium cb-skeleton--wave" />
          </div>
          <div class="cb-skeleton-card cb-skeleton-card--tool">
            <div class="cb-skeleton cb-skeleton--section-title cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--medium cb-skeleton--wave" />
          </div>
        </div>
      </section>

      <section class="cb-section cb-section--tight">
        <div class="cb-shell cb-about-skeleton__history">
          <div class="cb-skeleton-card cb-skeleton-card--tool">
            <div class="cb-skeleton cb-skeleton--section-title cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--medium cb-skeleton--wave" />
          </div>
          <div class="cb-skeleton-card cb-skeleton-card--banner">
            <div class="cb-skeleton cb-skeleton--banner cb-skeleton--wave" />
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
            <div v-for="index in 6" :key="`principle-skeleton-${index}`" class="cb-skeleton-card cb-skeleton-card--service">
              <div class="cb-skeleton cb-skeleton--icon cb-skeleton--wave" />
              <div class="cb-skeleton cb-skeleton--service-title cb-skeleton--wave" />
              <div class="cb-skeleton cb-skeleton--text cb-skeleton--wave" />
            </div>
          </div>
        </div>
      </section>
    </div>

    <main v-else class="cb-about">
      <section class="cb-about-hero">
        <div class="cb-about-hero__media" :style="heroSlideStyle">
          <div class="cb-about-hero__veil"></div>
          <button
            v-if="heroSlides.length > 1"
            type="button"
            class="cb-about-carousel__arrow cb-about-carousel__arrow--left"
            aria-label="Ver foto anterior"
            @click="stepHero(-1)"
          >
            <span v-html="icons.chevronLeft"></span>
          </button>

          <div class="cb-shell cb-about-hero__content">
            <div class="cb-about-hero__copy">
              <p v-if="currentHeroSlide.eyebrow" class="cb-about-eyebrow">{{ currentHeroSlide.eyebrow }}</p>
              <h1>{{ currentHeroSlide.title || heroSettings.title }}</h1>
              <p>{{ currentHeroSlide.text || heroSettings.subtitle }}</p>
            </div>
          </div>

          <button
            v-if="heroSlides.length > 1"
            type="button"
            class="cb-about-carousel__arrow cb-about-carousel__arrow--right"
            aria-label="Ver foto siguiente"
            @click="stepHero(1)"
          >
            <span v-html="icons.chevronRight"></span>
          </button>

          <div v-if="heroSlides.length > 1" class="cb-about-carousel__dots">
            <button
              v-for="(slide, index) in heroSlides"
              :key="slide.id || `hero-dot-${index}`"
              type="button"
              :class="['cb-about-carousel__dot', { 'cb-about-carousel__dot--active': index === heroIndex }]"
              :aria-label="`Ir a la fotografia ${index + 1}`"
              @click="heroIndex = index"
            />
          </div>
        </div>
      </section>

      <section class="cb-about-section cb-about-mission">
        <div class="cb-shell cb-about-mission__grid">
          <article class="cb-about-mission__card">
            <h2>{{ missionVisionSettings.mission_title }}</h2>
            <p>{{ missionVisionSettings.mission_text }}</p>
          </article>
          <article class="cb-about-mission__card">
            <h2>{{ missionVisionSettings.vision_title }}</h2>
            <p>{{ missionVisionSettings.vision_text }}</p>
          </article>
        </div>
      </section>

      <section class="cb-about-section cb-about-history">
        <div class="cb-shell cb-about-history__grid">
          <article class="cb-about-story">
            <p v-if="historySettings.kicker" class="cb-about-eyebrow">{{ historySettings.kicker }}</p>
            <h2>{{ historySettings.title }}</h2>
            <p>{{ historySettings.text }}</p>
          </article>

          <article class="cb-about-story-slider">
            <div class="cb-about-story-slider__media" :style="historySlideStyle">
              <div class="cb-about-story-slider__veil"></div>
              <button
                v-if="historySlides.length > 1"
                type="button"
                class="cb-about-carousel__arrow cb-about-carousel__arrow--left"
                aria-label="Ver historia anterior"
                @click="stepHistory(-1)"
              >
                <span v-html="icons.chevronLeft"></span>
              </button>

              <div class="cb-about-story-slider__copy">
                <h3>{{ currentHistorySlide.title || historySettings.carousel_title }}</h3>
                <p>{{ currentHistorySlide.text || historySettings.carousel_text }}</p>
              </div>

              <button
                v-if="historySlides.length > 1"
                type="button"
                class="cb-about-carousel__arrow cb-about-carousel__arrow--right"
                aria-label="Ver historia siguiente"
                @click="stepHistory(1)"
              >
                <span v-html="icons.chevronRight"></span>
              </button>

              <div v-if="historySlides.length > 1" class="cb-about-carousel__dots cb-about-carousel__dots--inside">
                <button
                  v-for="(slide, index) in historySlides"
                  :key="slide.id || `history-dot-${index}`"
                  type="button"
                  :class="['cb-about-carousel__dot', { 'cb-about-carousel__dot--active': index === historyIndex }]"
                  :aria-label="`Ir a la historia ${index + 1}`"
                  @click="historyIndex = index"
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="cb-about-principles">
        <div class="cb-shell">
          <div class="cb-about-section__heading cb-about-section__heading--center">
            <h2>{{ principlesSettings.title }}</h2>
            <p v-if="principlesSettings.subtitle">{{ principlesSettings.subtitle }}</p>
          </div>

          <div class="cb-about-principles__grid">
            <article v-for="principle in principles" :key="principle.id || principle.title" class="cb-about-principle-card">
              <div class="cb-about-principle-card__icon" v-html="resolveIcon(principle.icon, 'heart')"></div>
              <div>
                <h3>{{ principle.title }}</h3>
                <p>{{ principle.text }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="cb-about-section cb-about-organigram">
        <div class="cb-shell">
          <div class="cb-about-section__heading cb-about-section__heading--center">
            <h2>{{ organigramSettings.title }}</h2>
          </div>

          <article class="cb-about-organigram__frame" :style="organigramStyle">
            <div class="cb-about-organigram__veil"></div>
            <div class="cb-about-organigram__copy">
              <h3>{{ organigramSettings.card_title }}</h3>
              <p>{{ organigramSettings.card_text }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="cb-about-section cb-about-objectives">
        <div class="cb-shell">
          <div class="cb-about-section__heading">
            <h2>{{ objectivesSettings.title }}</h2>
          </div>

          <div class="cb-about-objectives__list">
            <article v-for="objective in objectives" :key="objective.id || objective.text" class="cb-about-objective">
              <div class="cb-about-objective__icon" v-html="resolveIcon(objective.icon, 'target')"></div>
              <p>{{ objective.text }}</p>
            </article>
          </div>
        </div>
      </section>
    </main>

    <HomeFooter v-if="!isBootLoading" :logo-url="logoUrl" :icons="icons" :content="footerSettings" :links="footerLinks" />
  </div>
</template>

<script>
import { sanitizeContentTree } from '~/utils/contentSecurity'

const SHARED_LAYOUT_PAGE = {
  theme: { logo_url: '', primary_color: '#20539a', secondary_color: '#2f3f5c', accent_color: '#fecc36' },
  sections: [
    { key: 'header', settings: { help_label: '', login_label: '', search_placeholder: '', language_primary: '', language_secondary: '', accessibility_label: '' }, items: [] },
    { key: 'footer', settings: { help_title: '', company_title: '', contact_title: '', social_title: '', social_text: '', address: '', phone: '', email: '', copyright: '', legal_text: '' }, items: [] }
  ]
}

const ABOUT_PAGE = {
  meta_title: 'Quienes Somos | Correos de Bolivia',
  meta_description: 'Historia, principios, organigrama y objetivos institucionales de Correos de Bolivia.',
  theme: { logo_url: '', primary_color: '#20539a', secondary_color: '#2f3f5c', accent_color: '#fecc36' },
  sections: [
    { key: 'hero_gallery', settings: { title: '', subtitle: '' }, items: [] },
    { key: 'mission_vision', settings: { mission_title: '', mission_text: '', vision_title: '', vision_text: '' }, items: [] },
    { key: 'history', settings: { kicker: '', title: '', text: '', carousel_title: '', carousel_text: '' }, items: [] },
    { key: 'principles', settings: { title: '', subtitle: '' }, items: [] },
    { key: 'organigram', settings: { title: '', card_title: '', card_text: '', image: '' }, items: [] },
    { key: 'objectives', settings: { title: '', subtitle: '' }, items: [] }
  ]
}

export default {
  name: 'QuienesSomosPage',
  data() {
    return {
      isBootLoading: true,
      heroIndex: 0,
      historyIndex: 0,
      heroTimer: null,
      historyTimer: null
    }
  },
  async asyncData({ $api }) {
    const [homePayload, aboutPayload] = await Promise.all([
      safeGet($api, '/api/site/pages/home'),
      fetchAbout($api)
    ])

    return {
      homeContent: normalizePage(homePayload || SHARED_LAYOUT_PAGE, SHARED_LAYOUT_PAGE),
      aboutContent: normalizePage(aboutPayload || ABOUT_PAGE, ABOUT_PAGE)
    }
  },
  async mounted() {
    await this.refreshPageContent()
    this.startHero()
    this.startHistory()
  },
  beforeDestroy() {
    this.stopHero()
    this.stopHistory()
  },
  computed: {
    icons() {
      return buildIcons()
    },
    logoUrl() {
      return this.homeContent.theme.logo_url || this.aboutContent.theme.logo_url || ''
    },
    headerSettings() {
      return this.getSectionSettings(this.homeContent, 'header')
    },
    footerSettings() {
      return this.getSectionSettings(this.homeContent, 'footer')
    },
    headerLinks() {
      return this.getSectionItems(this.homeContent, 'header')
    },
    footerLinks() {
      return this.getSectionItems(this.homeContent, 'footer')
    },
    heroSettings() {
      return this.getSectionSettings(this.aboutContent, 'hero_gallery')
    },
    missionVisionSettings() {
      return this.getSectionSettings(this.aboutContent, 'mission_vision')
    },
    historySettings() {
      return this.getSectionSettings(this.aboutContent, 'history')
    },
    principlesSettings() {
      return this.getSectionSettings(this.aboutContent, 'principles')
    },
    organigramSettings() {
      return this.getSectionSettings(this.aboutContent, 'organigram')
    },
    objectivesSettings() {
      return this.getSectionSettings(this.aboutContent, 'objectives')
    },
    heroSlides() {
      return this.getSectionItems(this.aboutContent, 'hero_gallery')
    },
    historySlides() {
      return this.getSectionItems(this.aboutContent, 'history')
    },
    principles() {
      return this.getSectionItems(this.aboutContent, 'principles')
    },
    objectives() {
      return this.getSectionItems(this.aboutContent, 'objectives')
    },
    currentHeroSlide() {
      return this.heroSlides[this.heroIndex] || {}
    },
    currentHistorySlide() {
      return this.historySlides[this.historyIndex] || {}
    },
    heroSlideStyle() {
      return createBackground(this.currentHeroSlide.image)
    },
    historySlideStyle() {
      return createBackground(this.currentHistorySlide.image)
    },
    organigramStyle() {
      return createBackground(this.organigramSettings.image)
    },
    themeStyles() {
      const theme = this.homeContent.theme || {}
      const aboutTheme = this.aboutContent.theme || {}

      return {
        '--cb-blue': aboutTheme.primary_color || theme.primary_color || '#20539a',
        '--cb-yellow': aboutTheme.accent_color || theme.accent_color || '#fecc36',
        '--cb-ink': aboutTheme.secondary_color || theme.secondary_color || '#2f3f5c'
      }
    }
  },
  methods: {
    async refreshPageContent() {
      const startedAt = Date.now()

      try {
        const [homePayload, aboutPayload] = await Promise.all([
          safeGet(this.$api, '/api/site/pages/home'),
          fetchAbout(this.$api)
        ])

        this.homeContent = normalizePage(homePayload || SHARED_LAYOUT_PAGE, SHARED_LAYOUT_PAGE)
        this.aboutContent = normalizePage(aboutPayload || ABOUT_PAGE, ABOUT_PAGE)
      } finally {
        const minimumRevealDelay = 900
        const elapsed = Date.now() - startedAt
        const remaining = Math.max(0, minimumRevealDelay - elapsed)

        window.setTimeout(() => {
          this.isBootLoading = false
        }, remaining)
      }
    },
    getSectionSettings(page, key) {
      const section = page.sections.find((item) => item.key === key)
      return section ? section.settings || {} : {}
    },
    getSectionItems(page, key) {
      const section = page.sections.find((item) => item.key === key)

      if (!section || !Array.isArray(section.items)) {
        return []
      }

      return section.items.map((item) => ({
        ...(item.data || {}),
        id: item.id,
        type: item.type,
        itemName: item.name
      }))
    },
    stepHero(direction) {
      if (!this.heroSlides.length) {
        return
      }

      this.heroIndex = (this.heroIndex + direction + this.heroSlides.length) % this.heroSlides.length
      this.startHero()
    },
    stepHistory(direction) {
      if (!this.historySlides.length) {
        return
      }

      this.historyIndex = (this.historyIndex + direction + this.historySlides.length) % this.historySlides.length
      this.startHistory()
    },
    startHero() {
      this.stopHero()
      if (this.heroSlides.length > 1) {
        this.heroTimer = window.setInterval(() => this.stepHero(1), 5000)
      }
    },
    stopHero() {
      if (this.heroTimer) {
        window.clearInterval(this.heroTimer)
        this.heroTimer = null
      }
    },
    startHistory() {
      this.stopHistory()
      if (this.historySlides.length > 1) {
        this.historyTimer = window.setInterval(() => this.stepHistory(1), 6000)
      }
    },
    stopHistory() {
      if (this.historyTimer) {
        window.clearInterval(this.historyTimer)
        this.historyTimer = null
      }
    },
    resolveIcon(icon, fallback) {
      return this.icons[icon] || this.icons[fallback]
    }
  },
  head() {
    return {
      title: this.aboutContent.meta_title || 'Quienes Somos',
      meta: [
        { hid: 'description', name: 'description', content: this.aboutContent.meta_description || '' }
      ],
      htmlAttrs: { lang: 'es' }
    }
  }
}

async function fetchAbout($api) {
  const endpoints = ['/api/site/pages/quienes-somos', '/api/site/pages/quienes_somos', '/api/site/pages/about']
  for (const endpoint of endpoints) {
    const payload = await safeGet($api, endpoint)
    if (payload) {
      return payload
    }
  }
  return null
}

async function safeGet($api, endpoint) {
  try {
    return await $api.$get(endpoint)
  } catch (error) {
    return null
  }
}

function normalizePage(payload = {}, base = ABOUT_PAGE) {
  const sectionMap = payload.section_map || {}
  const fallbackMap = base.sections.reduce((accumulator, section) => {
    accumulator[section.key] = section
    return accumulator
  }, {})

  return {
    ...base,
    ...payload,
    theme: {
      ...(base.theme || {}),
      ...sanitizeContentTree(payload.theme || {})
    },
    sections: Object.keys(fallbackMap).map((key, index) => {
      const fallback = fallbackMap[key]
      const section = sectionMap[key] || (Array.isArray(payload.sections) ? payload.sections.find((item) => item.key === key) : null)
      if (!section) {
        return fallback
      }
      return sanitizeContentTree({
        ...fallback,
        ...section,
        sort_order: typeof section.sort_order === 'number' ? section.sort_order : index,
        settings: {
          ...(fallback.settings || {}),
          ...(section.settings || {})
        },
        items: Array.isArray(section.items) ? section.items : fallback.items
      })
    })
  }
}

function createBackground(image) {
  if (!image) {
    return {}
  }
  return {
    backgroundImage: `linear-gradient(135deg, rgba(254, 204, 54, 0.28), rgba(32, 83, 154, 0.22)), url('${image}')`
  }
}

function buildIcons() {
  return {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="20" y1="20" x2="16.65" y2="16.65"></line></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
    'phone-call': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.3a2 2 0 0 1 2.11-.45c.85.3 1.74.52 2.64.64A2 2 0 0 1 22 16.92z"></path></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
    accessibility: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.8"></circle><path d="M7 8h10"></path><path d="M12 8v5"></path><path d="m9 21 3-6 3 6"></path><path d="m8 12 4 2 4-2"></path></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"></path><path d="M12 17h.01"></path></svg>',
    login: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path></svg>',
    chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z"></path></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"></circle><path d="M12 2.5v2.3"></path><path d="M12 19.2v2.3"></path><path d="m4.93 4.93 1.63 1.63"></path><path d="m17.44 17.44 1.63 1.63"></path><path d="M2.5 12h2.3"></path><path d="M19.2 12h2.3"></path><path d="m4.93 19.07 1.63-1.63"></path><path d="m17.44 6.56 1.63-1.63"></path></svg>',
    scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"></path><path d="M7 7h10"></path><path d="M5 7 3 12h4L5 7Z"></path><path d="m19 7-2 5h4l-2-5Z"></path><path d="M8 21h8"></path></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18 3 20V6l6-2 6 2 6-2v14l-6 2-6-2Z"></path><path d="M9 4v14"></path><path d="M15 6v14"></path></svg>',
    thumbs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v10"></path><path d="M12 21h5.2a2 2 0 0 0 2-1.63l1-5.4A2 2 0 0 0 18.24 12H14V8.5A2.5 2.5 0 0 0 11.5 6L7 10Z"></path><path d="M4 10h3v11H4z"></path></svg>',
    equal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9h12"></path><path d="M6 15h12"></path></svg>',
    searchPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="M11 8v6"></path><path d="M8 11h6"></path><path d="m20 20-3.5-3.5"></path></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M6 21V7l6-3 6 3v14"></path><path d="M9 10h.01"></path><path d="M12 10h.01"></path><path d="M15 10h.01"></path><path d="M9 14h.01"></path><path d="M12 14h.01"></path><path d="M15 14h.01"></path></svg>',
    trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16 10 10 14 14 20 8"></path><path d="M20 8v5"></path><path d="M15 8h5"></path></svg>',
    handshake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2a2 2 0 0 0 2.83 0L21 7"></path><path d="M13.5 6.5 11 4 3 12l3 3"></path><path d="m7 16 2 2"></path><path d="m4 13 2 2"></path></svg>',
    anchor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"></circle><path d="M12 7v11"></path><path d="M5 12a7 7 0 0 0 14 0"></path><path d="M5 12H3"></path><path d="M21 12h-2"></path></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"></path></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="m8.5 12 2.5 2.5 4.5-5"></path></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"></path><path d="M5 6H3a3 3 0 0 0 3 3"></path><path d="M19 6h2a3 3 0 0 1-3 3"></path></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="4"></circle><circle cx="12" cy="12" r="1"></circle></svg>'
  }
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/about.css"></style>
