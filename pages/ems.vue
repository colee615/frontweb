<template>
  <div class="cb-page cb-ems-page" :style="themeStyles" :class="{ 'cb-page--ready': !isBootLoading }">
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

    <div v-if="isBootLoading" class="cb-home-skeleton cb-ems-skeleton" aria-hidden="true">
      <section class="cb-home-skeleton__hero">
        <div class="cb-shell cb-ems-skeleton__hero">
          <div class="cb-skeleton-card cb-skeleton-card--hero cb-ems-skeleton__hero-card">
            <div class="cb-skeleton cb-skeleton--eyebrow cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--title cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--title cb-skeleton--short cb-skeleton--wave" />
          </div>
        </div>
      </section>

      <section class="cb-section cb-section--tight">
        <div class="cb-shell cb-ems-skeleton__intro">
          <div class="cb-skeleton-card cb-skeleton-card--banner">
            <div class="cb-skeleton cb-skeleton--banner cb-skeleton--wave" />
          </div>
          <div class="cb-skeleton-card cb-skeleton-card--tool">
            <div class="cb-skeleton cb-skeleton--section-title cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--medium cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--button cb-skeleton--wave" />
          </div>
        </div>
      </section>
    </div>

    <main v-else class="cb-page__content cb-ems">
      <section id="ems-hero" class="cb-ems-hero">
        <div class="cb-shell">
          <div class="cb-ems-hero__frame cb-ems-reveal" data-reveal>
            <span class="cb-ems-hero__corner cb-ems-hero__corner--left" aria-hidden="true"></span>
            <span class="cb-ems-hero__corner cb-ems-hero__corner--right" aria-hidden="true"></span>
            <span v-if="introSettings.watermark_text" class="cb-ems-hero__watermark" aria-hidden="true">{{ introSettings.watermark_text }}</span>
            <div v-if="introSettings.eyebrow || introSettings.hero_title" class="cb-ems-hero__card">
              <p v-if="introSettings.eyebrow" class="cb-ems-hero__eyebrow">{{ introSettings.eyebrow }}</p>
              <h1 v-if="introSettings.hero_title">{{ introSettings.hero_title }}</h1>
            </div>
          </div>
        </div>
      </section>

      <section id="ems-intro" class="cb-ems-intro">
        <div class="cb-shell cb-ems-intro__grid">
          <article class="cb-ems-visual cb-ems-reveal" data-reveal style="--cb-delay: 0ms;">
            <span class="cb-ems-visual__accent cb-ems-visual__accent--top" aria-hidden="true"></span>
            <span class="cb-ems-visual__accent cb-ems-visual__accent--bottom" aria-hidden="true"></span>
            <div class="cb-ems-visual__surface">
              <img
                v-if="introSettings.image"
                class="cb-ems-visual__image"
                :src="introSettings.image"
                alt=""
              >
              <div v-else-if="introSettings.visual_icon" class="cb-ems-visual__icon" v-html="resolveIcon(introSettings.visual_icon)"></div>
            </div>
          </article>

          <article class="cb-ems-copy cb-ems-reveal" data-reveal style="--cb-delay: 120ms;">
            <h2>{{ introSettings.title }}</h2>
            <p v-if="introSettings.highlight_text" class="cb-ems-copy__highlight">{{ introSettings.highlight_text }}</p>
            <p v-for="(paragraph, index) in introParagraphs" :key="`intro-paragraph-${index}`">{{ paragraph }}</p>

            <component
              v-if="introSettings.primary_button_label && introSettings.primary_button_url"
              :is="isInternalRoute(introSettings.primary_button_url) ? 'nuxt-link' : 'a'"
              class="cb-ems-btn cb-ems-btn--primary"
              v-bind="linkAttrs(introSettings.primary_button_url)"
            >
              {{ introSettings.primary_button_label }}
            </component>
          </article>
        </div>
      </section>

      <section id="ems-benefits" class="cb-ems-benefits">
        <div class="cb-shell">
          <div class="cb-ems-section-heading cb-ems-reveal" data-reveal>
            <h2>{{ benefitsSettings.title }}</h2>
          </div>

          <div class="cb-ems-benefits__grid">
            <article
              v-for="(item, index) in benefitItems"
              :key="item.id || item.title || index"
              :id="`ems-benefit-item-${item.id || index}`"
              class="cb-ems-benefit-card cb-ems-reveal"
              data-reveal
              :style="{ '--cb-delay': `${index * 80}ms` }"
            >
              <div class="cb-ems-benefit-card__icon" v-html="resolveIcon(item.icon)"></div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="ems-national" class="cb-ems-national">
        <div class="cb-shell">
          <div class="cb-ems-section-heading cb-ems-section-heading--national cb-ems-reveal" data-reveal>
            <h2>{{ nationalSettings.title }}</h2>
            <p v-if="nationalSettings.subtitle">{{ nationalSettings.subtitle }}</p>
          </div>

          <div class="cb-ems-national__network">
            <span class="cb-ems-national__line cb-ems-national__line--vertical" aria-hidden="true"></span>
            <span class="cb-ems-national__line cb-ems-national__line--horizontal" aria-hidden="true"></span>
            <span class="cb-ems-national__dot cb-ems-national__dot--top" aria-hidden="true"></span>
            <span class="cb-ems-national__dot cb-ems-national__dot--mid-left" aria-hidden="true"></span>
            <span class="cb-ems-national__dot cb-ems-national__dot--mid-right" aria-hidden="true"></span>
            <span class="cb-ems-national__dot cb-ems-national__dot--bottom" aria-hidden="true"></span>

            <div class="cb-ems-national__grid">
              <article
                v-for="(item, index) in nationalItems"
                :key="item.id || item.title || index"
                :id="`ems-national-item-${item.id || index}`"
                class="cb-ems-national-card cb-ems-reveal"
                :class="{ 'cb-ems-national-card--featured': isNationalFeatured(item) }"
                data-reveal
                :style="{ '--cb-delay': `${index * 75}ms` }"
              >
                <div class="cb-ems-national-card__icon" v-html="resolveIcon(item.icon)"></div>
                <div>
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.text }}</p>
                </div>
              </article>
            </div>

            <article
              v-if="nationalSettings.stat_label || nationalSettings.stat_value || nationalSettings.stat_caption"
              class="cb-ems-national__metric cb-ems-reveal"
              data-reveal
              style="--cb-delay: 220ms;"
            >
              <p>{{ nationalSettings.stat_label }}</p>
              <strong>{{ nationalSettings.stat_value }}</strong>
              <span>{{ nationalSettings.stat_caption }}</span>
            </article>
          </div>
        </div>
      </section>

      <section id="ems-international" class="cb-ems-global">
        <div class="cb-shell">
          <div class="cb-ems-global__heading cb-ems-reveal" data-reveal>
            <h2>{{ internationalSettings.title }}</h2>
            <p v-html="highlightedInternationalSubtitle"></p>
          </div>

          <div class="cb-ems-global__grid">
            <article
              v-for="(item, index) in internationalItems"
              :key="item.id || item.title || index"
              :id="`ems-global-item-${item.id || index}`"
              class="cb-ems-global-card cb-ems-reveal"
              data-reveal
              :style="{ '--cb-delay': `${index * 70}ms` }"
            >
              <div class="cb-ems-global-card__frame"></div>
              <div class="cb-ems-global-card__icon" v-html="resolveIcon(item.icon)"></div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
              <span v-if="item.badge" class="cb-ems-global-card__badge">{{ item.badge }}</span>
            </article>
          </div>

          <article class="cb-ems-global__cta cb-ems-reveal" data-reveal style="--cb-delay: 200ms;">
            <p>{{ internationalSettings.cta_text }}</p>
            <component
              v-if="internationalSettings.secondary_button_label && internationalSettings.secondary_button_url"
              :is="isInternalRoute(internationalSettings.secondary_button_url) ? 'nuxt-link' : 'a'"
              class="cb-ems-btn cb-ems-btn--secondary"
              v-bind="linkAttrs(internationalSettings.secondary_button_url)"
            >
              {{ internationalSettings.secondary_button_label }}
            </component>
          </article>
        </div>
      </section>
    </main>

    <HomeFooter v-if="!isBootLoading" :logo-url="logoUrl" :icons="icons" :content="footerSettings" :links="footerLinks" />
  </div>
</template>

<script>
import { sanitizeContentTree } from '~/utils/contentSecurity'

const EMS_SOURCE_PAGE = {
  meta_title: '',
  meta_description: '',
  theme: { logo_url: '', primary_color: '#20539a', secondary_color: '#2f3f5c', accent_color: '#fecc36' },
  sections: [
    { key: 'header', settings: { help_label: '', login_label: '', search_placeholder: '', language_primary: '', language_secondary: '', accessibility_label: '' }, items: [] },
    { key: 'ems_intro', settings: { eyebrow: '', hero_title: '', watermark_text: '', title: '', highlight_text: '', paragraph_one: '', paragraph_two: '', paragraph_three: '', primary_button_label: '', primary_button_url: '', visual_icon: '', image: '' }, items: [] },
    { key: 'ems_benefits', settings: { title: '' }, items: [] },
    { key: 'ems_national', settings: { title: '', subtitle: '', stat_label: '', stat_value: '', stat_caption: '' }, items: [] },
    { key: 'ems_international', settings: { title: '', subtitle: '', highlight_text: '', cta_text: '', secondary_button_label: '', secondary_button_url: '' }, items: [] },
    { key: 'footer', settings: { help_title: '', company_title: '', contact_title: '', social_title: '', social_text: '', address: '', phone: '', email: '', copyright: '', legal_text: '' }, items: [] }
  ]
}

export default {
  name: 'EmsPage',
  data() {
    return {
      isBootLoading: true,
      revealObserver: null
    }
  },
  async asyncData({ $api }) {
    const homePayload = await fetchHome($api)

    return {
      homeContent: normalizePage(homePayload || EMS_SOURCE_PAGE, EMS_SOURCE_PAGE)
    }
  },
  async mounted() {
    await this.refreshPageContent()
    this.setupRevealObserver()
  },
  beforeDestroy() {
    this.destroyRevealObserver()
  },
  computed: {
    icons() {
      return buildIcons()
    },
    logoUrl() {
      return this.homeContent.theme.logo_url || ''
    },
    headerSettings() {
      return this.getSectionSettings('header')
    },
    footerSettings() {
      return this.getSectionSettings('footer')
    },
    introSettings() {
      return this.getSectionSettings('ems_intro')
    },
    benefitsSettings() {
      return this.getSectionSettings('ems_benefits')
    },
    nationalSettings() {
      return this.getSectionSettings('ems_national')
    },
    internationalSettings() {
      return this.getSectionSettings('ems_international')
    },
    headerLinks() {
      return this.getSectionItems('header')
    },
    footerLinks() {
      return this.getSectionItems('footer')
    },
    benefitItems() {
      return this.getSectionItems('ems_benefits')
    },
    nationalItems() {
      return this.getSectionItems('ems_national')
    },
    internationalItems() {
      return this.getSectionItems('ems_international')
    },
    introParagraphs() {
      return [
        this.introSettings.paragraph_one,
        this.introSettings.paragraph_two,
        this.introSettings.paragraph_three
      ].filter((item) => String(item || '').trim() !== '')
    },
    highlightedInternationalSubtitle() {
      const text = String(this.internationalSettings.subtitle || '')
      const highlight = String(this.internationalSettings.highlight_text || '').trim()
      const escapedText = escapeHtml(text)

      if (!highlight) {
        return escapedText
      }

      const escapedHighlight = escapeRegExp(highlight)
      return escapedText.replace(new RegExp(escapedHighlight, 'i'), '<span>' + escapeHtml(highlight) + '</span>')
    },
    themeStyles() {
      const theme = this.homeContent.theme || {}

      return {
        '--cb-blue': theme.primary_color || '#20539a',
        '--cb-yellow': theme.accent_color || '#fecc36',
        '--cb-ink': theme.secondary_color || '#2f3f5c'
      }
    }
  },
  methods: {
    async refreshPageContent() {
      const startedAt = Date.now()

      try {
        const payload = await fetchHome(this.$api)

        if (payload) {
          this.homeContent = normalizePage(payload, EMS_SOURCE_PAGE)
        }
      } finally {
        const minimumRevealDelay = 900
        const elapsed = Date.now() - startedAt
        const remaining = Math.max(0, minimumRevealDelay - elapsed)

        window.setTimeout(() => {
          this.isBootLoading = false
          this.$nextTick(() => {
            this.setupRevealObserver()
          })
        }, remaining)
      }
    },
    getSectionSettings(key) {
      const section = this.homeContent.sections.find((item) => item.key === key)
      return section ? section.settings || {} : {}
    },
    getSectionItems(key) {
      const section = this.homeContent.sections.find((item) => item.key === key)

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
    resolveIcon(icon) {
      return this.icons[icon] || ''
    },
    isNationalFeatured(item) {
      const badge = String(item.badge || '').trim().toLowerCase()
      return ['featured', 'destacado', 'highlight', 'primary'].includes(badge)
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
    setupRevealObserver() {
      this.destroyRevealObserver()

      if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        document.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-visible'))
        return
      }

      this.revealObserver = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            this.revealObserver.unobserve(entry.target)
          }
        })
      }, {
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px'
      })

      document.querySelectorAll('[data-reveal]').forEach((node) => {
        if (!node.classList.contains('is-visible')) {
          this.revealObserver.observe(node)
        }
      })
    },
    destroyRevealObserver() {
      if (this.revealObserver) {
        this.revealObserver.disconnect()
        this.revealObserver = null
      }
    }
  },
  head() {
    return {
      title: this.introSettings.hero_title || this.homeContent.meta_title || '',
      meta: [
        { hid: 'description', name: 'description', content: this.homeContent.meta_description || '' }
      ],
      htmlAttrs: { lang: 'es' }
    }
  }
}

async function safeGet($api, endpoint) {
  try {
    return await $api.$get(endpoint)
  } catch (error) {
    return null
  }
}

async function fetchHome($api) {
  const endpoints = ['/frontapi/api/site/pages/home', '/api/site/pages/home']

  for (const endpoint of endpoints) {
    const payload = await safeGet($api, endpoint)

    if (payload) {
      return payload
    }
  }

  return null
}

function normalizePage(payload = {}, base = EMS_SOURCE_PAGE) {
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

function buildIcons() {
  return {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="20" y1="20" x2="16.65" y2="16.65"></line></svg>',
    plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path></svg>',
    broadcast: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.93 19.07a10 10 0 0 1 0-14.14"></path><path d="M19.07 19.07a10 10 0 0 0 0-14.14"></path><path d="M8.46 15.54a5 5 0 0 1 0-7.08"></path><path d="M15.54 15.54a5 5 0 0 0 0-7.08"></path><circle cx="12" cy="12" r="1.5"></circle></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path></svg>',
    'check-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="m8.5 12 2.5 2.5 4.5-5"></path></svg>',
    package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="M3.3 7l8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v6l4 2"></path></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-9 4.5L12 12l9-4.5L12 3Z"></path><path d="m3 12 9 4.5 9-4.5"></path><path d="m3 16.5 9 4.5 9-4.5"></path></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"></path><path d="M5 9.8V21h14V9.8"></path><path d="M9 21v-6h6v6"></path></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
    award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"></circle><path d="m8.2 12.8-1.7 8.2L12 18l5.5 3-1.7-8.2"></path></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"></path></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><circle cx="9.5" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
    'phone-call': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.3a2 2 0 0 1 2.11-.45c.85.3 1.74.52 2.64.64A2 2 0 0 1 22 16.92z"></path></svg>',
    accessibility: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.8"></circle><path d="M7 8h10"></path><path d="M12 8v5"></path><path d="m9 21 3-6 3 6"></path><path d="m8 12 4 2 4-2"></path></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"></path><path d="M12 17h.01"></path></svg>',
    login: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path></svg>'
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/ems.css"></style>
