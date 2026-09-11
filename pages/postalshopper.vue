<template>
  <div class="cb-page cb-postalshopper-page" :style="themeStyles" :class="{ 'cb-page--ready': !isBootLoading }">
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

    <HomeHeader v-if="!isBootLoading" :logo-url="logoUrl" :icons="icons" :content="headerSettings" :links="headerLinks" />

    <main v-if="!isBootLoading" class="cb-page__content cb-postalshopper">
      <section id="postalshopper-hero" class="cb-ps-hero" :style="heroStyles">
        <div class="cb-shell cb-ps-hero__grid">
          <article class="cb-ps-hero__copy">
            <div v-if="heroSettings.badge" class="cb-ps-hero__badge">
              <span class="cb-ps-hero__badge-dot"></span>
              {{ heroSettings.badge }}
            </div>

            <h1>
              <span v-for="(row, index) in heroTitleRows" :key="`ps-hero-row-${index}`">
                <strong v-if="row.white">{{ row.white }}</strong>
                <em v-if="row.yellow">{{ row.yellow }}</em>
              </span>
            </h1>

            <p v-if="heroSettings.lead_text" class="cb-ps-hero__lead">{{ heroSettings.lead_text }}</p>
            <p v-if="heroSettings.subtitle" class="cb-ps-hero__subtitle">{{ heroSettings.subtitle }}</p>

            <div v-if="heroFeatureItems.length" class="cb-ps-hero__stats">
              <article v-for="(item, index) in heroFeatureItems" :key="item.id || item.value || index" class="cb-ps-hero__stat">
                <span class="cb-ps-hero__stat-icon" v-html="icons.star"></span>
                <strong>{{ item.value }}</strong>
                <small>{{ item.label }}</small>
              </article>
            </div>
          </article>

        </div>
        <div class="cb-ps-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 110" preserveAspectRatio="none" role="presentation">
            <path d="M0,62 C170,38 322,70 498,54 C650,40 802,35 965,45 C1126,55 1274,66 1440,48 L1440,110 L0,110 Z" />
          </svg>
        </div>
      </section>

      <section id="postalshopper-intro" class="cb-ps-intro">
        <div class="cb-shell cb-ps-intro__inner">
          <div class="cb-ps-heading cb-ps-heading--center">
            <div v-if="introSettings.eyebrow" class="cb-ps-heading__eyebrow">
              <span></span>
              <small>{{ introSettings.eyebrow }}</small>
              <span></span>
            </div>
            <h2 v-if="introSettings.title">{{ introSettings.title }}</h2>
            <p v-if="introSettings.paragraph_one" class="cb-ps-intro__lead">{{ introSettings.paragraph_one }}</p>
            <p v-if="introSettings.paragraph_two" class="cb-ps-intro__copy">{{ introSettings.paragraph_two }}</p>
          </div>

          <div v-if="marketChips.length" class="cb-ps-intro__brand-marquee" aria-label="Tiendas compatibles">
            <div class="cb-ps-intro__brand-track">
              <span
                v-for="(item, index) in marketMarqueeItems"
                :key="`${item.id || item.label || index}-${index}`"
                class="cb-ps-intro__brand"
              >
                <strong :class="brandLogoClass(item.label)">
                  <img
                    v-if="marketLogoUrl(item)"
                    :src="marketLogoUrl(item)"
                    :alt="`${item.label || 'Tienda'} logo`"
                    loading="lazy"
                    decoding="async"
                  >
                  <span v-else v-html="brandLogoSvg(item.label)"></span>
                </strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="postalshopper-steps" class="cb-ps-steps">
        <div class="cb-shell">
          <div class="cb-ps-heading cb-ps-heading--center">
            <div class="cb-ps-heading__accent"></div>
            <h2 v-if="stepsSettings.title">{{ stepsSettings.title }}</h2>
            <p v-if="stepsSettings.subtitle">{{ stepsSettings.subtitle }}</p>
          </div>

          <div class="cb-ps-steps__grid">
            <article v-for="(item, index) in stepItems" :key="item.id || item.title || index" class="cb-ps-step-card">
              <span class="cb-ps-step-card__count">{{ item.step }}</span>
              <div class="cb-ps-step-card__icon" v-html="resolveIcon(item.icon || 'pin')"></div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>

          <div class="cb-ps-steps__line" aria-hidden="true"></div>
        </div>
      </section>

      <section id="postalshopper-benefits" class="cb-ps-benefits">
        <div class="cb-shell">
          <div class="cb-ps-heading cb-ps-heading--center cb-ps-heading--light">
            <div class="cb-ps-heading__accent"></div>
            <h2 v-if="benefitsSettings.title">{{ benefitsSettings.title }}</h2>
            <p v-if="benefitsSettings.subtitle">{{ benefitsSettings.subtitle }}</p>
          </div>

          <div class="cb-ps-benefits__grid">
            <article v-for="(item, index) in benefitItems" :key="item.id || item.title || index" class="cb-ps-benefit-card">
              <div class="cb-ps-benefit-card__icon" v-html="resolveIcon(item.icon || 'globe')"></div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>

          <div v-if="benefitsSettings.banner_title || benefitsSettings.banner_text" class="cb-ps-benefits__banner">
            <div class="cb-ps-benefits__banner-icon" v-html="icons.package"></div>
            <div class="cb-ps-benefits__banner-copy">
              <h3 v-if="benefitsSettings.banner_title">{{ benefitsSettings.banner_title }}</h3>
              <p v-if="benefitsSettings.banner_text">{{ benefitsSettings.banner_text }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <HomeFooter v-if="!isBootLoading" :logo-url="logoUrl" :icons="icons" :content="footerSettings" :links="footerLinks" />
  </div>
</template>

<script>
import { sanitizeContentTree } from '~/utils/contentSecurity'

const POSTALSHOPPER_SOURCE_PAGE = {
  meta_title: '',
  meta_description: '',
  theme: { logo_url: '', primary_color: '#0d47b5', secondary_color: '#2a4268', accent_color: '#ffcc18' },
  sections: [
    { key: 'header', settings: {}, items: [] },
    {
      key: 'postalshopper_hero',
      settings: {
        badge: '',
        title_line_one_white: '',
        title_line_one_yellow: '',
        title_line_two_white: '',
        title_line_two_yellow: '',
        title_line_three_yellow: '',
        lead_text: '',
        subtitle: '',
        primary_button_label: '',
        primary_button_url: '',
        secondary_button_label: '',
        secondary_button_url: '',
        background_image: '',
        map_origin_country: '',
        map_origin_city: '',
        map_destination_country: '',
        map_destination_city: '',
        map_caption: ''
      },
      items: []
    },
    { key: 'postalshopper_intro', settings: { eyebrow: '', title: '', paragraph_one: '', paragraph_two: '' }, items: [] },
    { key: 'postalshopper_steps', settings: { title: '', subtitle: '' }, items: [] },
    {
      key: 'postalshopper_benefits',
      settings: { title: '', subtitle: '', banner_title: '', banner_text: '', banner_button_label: '', banner_button_url: '' },
      items: []
    },
    { key: 'footer', settings: {}, items: [] }
  ]
}

export default {
  name: 'PostalShopperPage',
  async asyncData({ $api }) {
    const payload = await fetchPage($api)
    return { pageContent: normalizePage(payload || POSTALSHOPPER_SOURCE_PAGE, POSTALSHOPPER_SOURCE_PAGE) }
  },
  data() {
    return {
      isBootLoading: true
    }
  },
  async mounted() {
    await this.refreshPageContent()
  },
  computed: {
    resolvedPageContent() {
      return this.pageContent || POSTALSHOPPER_SOURCE_PAGE
    },
    icons() {
      return buildIcons()
    },
    logoUrl() {
      return this.resolvedPageContent.theme.logo_url || ''
    },
    themeStyles() {
      const theme = this.resolvedPageContent.theme || {}
      return {
        '--cb-blue': theme.primary_color || '#0d47b5',
        '--cb-yellow': theme.accent_color || '#ffcc18',
        '--cb-ink': theme.secondary_color || '#2a4268'
      }
    },
    heroStyles() {
      const image = this.heroSettings.background_image || '/personajechica.png'
      return { '--cb-ps-hero-image': `url(${image})` }
    },
    headerSettings() {
      return this.getSectionSettings('header')
    },
    footerSettings() {
      return this.getSectionSettings('footer')
    },
    headerLinks() {
      return this.getSectionItems('header')
    },
    footerLinks() {
      return this.getSectionItems('footer')
    },
    heroSettings() {
      return this.getSectionSettings('postalshopper_hero')
    },
    heroTitleRows() {
      const rows = []
      const titleOneWhite = String(this.heroSettings.title_line_one_white || '').trim()
      const titleOneYellow = String(this.heroSettings.title_line_one_yellow || '').trim()
      const titleTwoWhite = String(this.heroSettings.title_line_two_white || '').trim()
      const titleTwoYellow = String(this.heroSettings.title_line_two_yellow || '').trim()
      const titleThreeYellow = String(this.heroSettings.title_line_three_yellow || '').trim()

      if (titleOneWhite) {
        rows.push({ white: titleOneWhite, yellow: '' })
      }

      if (titleOneYellow) {
        const [prefix, ...rest] = titleOneYellow.split(' ')
        rows.push({
          white: rest.length ? prefix : '',
          yellow: rest.length ? rest.join(' ') : titleOneYellow
        })
      }

      if (titleTwoWhite) {
        rows.push({ white: titleTwoWhite, yellow: '' })
      }

      if (titleTwoYellow) {
        rows.push({ white: '', yellow: titleTwoYellow })
      }

      if (titleThreeYellow) {
        rows.push({ white: '', yellow: titleThreeYellow })
      }

      return rows.filter((row) => String(row.white || row.yellow || '').trim() !== '')
    },
    introSettings() {
      return this.getSectionSettings('postalshopper_intro')
    },
    stepsSettings() {
      return this.getSectionSettings('postalshopper_steps')
    },
    benefitsSettings() {
      return this.getSectionSettings('postalshopper_benefits')
    },
    heroFeatureItems() {
      return this.getSectionItems('postalshopper_hero')
    },
    marketChips() {
      return this.getSectionItems('postalshopper_intro')
    },
    marketMarqueeItems() {
      return [...this.marketChips, ...this.marketChips]
    },
    stepItems() {
      return this.getSectionItems('postalshopper_steps')
    },
    benefitItems() {
      return this.getSectionItems('postalshopper_benefits')
    }
  },
  methods: {
    async refreshPageContent() {
      const startedAt = Date.now()

      try {
        const payload = await fetchPage(this.$api)
        if (payload) {
          this.pageContent = normalizePage(payload, POSTALSHOPPER_SOURCE_PAGE)
        }
      } finally {
        const elapsed = Date.now() - startedAt
        const remaining = Math.max(0, 350 - elapsed)

        window.setTimeout(() => {
          this.isBootLoading = false
        }, remaining)
      }
    },
    getSectionSettings(key) {
      const section = this.resolvedPageContent.sections.find((item) => item.key === key)
      return section ? section.settings || {} : {}
    },
    getSectionItems(key) {
      const section = this.resolvedPageContent.sections.find((item) => item.key === key)
      if (!section || !Array.isArray(section.items)) {
        return []
      }
      return section.items.map((item) => ({ ...(item.data || {}), id: item.id, type: item.type }))
    },
    marketLogoUrl(item) {
      return String(item?.logo || item?.image || item?.logo_url || '').trim()
    },
    brandLogoSvg(label) {
      const value = String(label || '').trim()
      const lower = value.toLowerCase()

      if (lower.includes('amazon')) {
        return '<svg viewBox="0 0 118 36" aria-hidden="true"><text x="4" y="21" font-size="18" font-weight="800" font-family="Arial, sans-serif" fill="currentColor">amazon</text><path d="M28 28c18 7 42 5 61-5" fill="none" stroke="#ffb300" stroke-width="3" stroke-linecap="round"/><path d="M84 21l9 1-5 7" fill="none" stroke="#ffb300" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      }
      if (lower.includes('ebay')) {
        return '<svg viewBox="0 0 96 34" aria-hidden="true"><text x="3" y="24" font-size="22" font-weight="800" font-family="Arial, sans-serif" fill="#e53238">e</text><text x="23" y="24" font-size="22" font-weight="800" font-family="Arial, sans-serif" fill="#0064d2">b</text><text x="43" y="24" font-size="22" font-weight="800" font-family="Arial, sans-serif" fill="#f5af02">a</text><text x="63" y="24" font-size="22" font-weight="800" font-family="Arial, sans-serif" fill="#86b817">y</text></svg>'
      }
      if (lower.includes('walmart')) {
        return '<svg viewBox="0 0 128 34" aria-hidden="true"><text x="3" y="23" font-size="20" font-weight="800" font-family="Arial, sans-serif" fill="#0071ce">Walmart</text><g fill="#ffc220" transform="translate(104 17)"><circle cx="0" cy="-11" r="2.4"/><circle cx="0" cy="11" r="2.4"/><circle cx="-10" cy="-5.5" r="2.4"/><circle cx="10" cy="-5.5" r="2.4"/><circle cx="-10" cy="5.5" r="2.4"/><circle cx="10" cy="5.5" r="2.4"/></g></svg>'
      }
      if (lower.includes('shein')) {
        return '<svg viewBox="0 0 92 34" aria-hidden="true"><text x="4" y="24" font-size="22" font-weight="800" letter-spacing="3" font-family="Arial, sans-serif" fill="#111827">SHEIN</text></svg>'
      }
      if (lower.includes('nike')) {
        return '<svg viewBox="0 0 96 34" aria-hidden="true"><path d="M8 22c16 6 37 1 80-14-33 18-58 25-73 24-7 0-11-3-7-10z" fill="#111827"/></svg>'
      }
      if (lower.includes('apple')) {
        return '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#111827" d="M31.4 6.2c1.2-1.5 2-3.6 1.8-5.7-1.8.1-4 .1-5.4 1.8-1.2 1.4-2.2 3.5-1.9 5.5 2 .2 4.2-.5 5.5-1.6zM39 34.4c-.9 2-1.4 2.9-2.6 4.7-1.7 2.6-4.1 5.8-7.1 5.8-2.6 0-3.3-1.7-6.9-1.7s-4.4 1.7-6.9 1.7c-3 0-5.3-2.9-7-5.5-4.8-7.4-5.3-16.1-2.4-20.7 2.1-3.3 5.4-5.2 8.5-5.2 3.2 0 5.2 1.7 7.8 1.7 2.5 0 4.1-1.7 7.8-1.7 2.8 0 5.8 1.5 7.8 4.2-6.9 3.8-5.8 13.6 1 16.7z"/></svg>'
      }
      if (lower.includes('miles')) {
        return '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="19" fill="#ffcc18"/><path d="M24 14v20M14 24h20" stroke="#0f4aad" stroke-width="4" stroke-linecap="round"/></svg>'
      }

      return '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" fill="#ffcc18"/><path d="M24 14v20M14 24h20" stroke="#0f4aad" stroke-width="4" stroke-linecap="round"/></svg>'
    },
    brandLogoClass(label) {
      const value = String(label || '').trim().toLowerCase()

      if (value.includes('amazon')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--amazon'
      if (value.includes('ebay')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--ebay'
      if (value.includes('walmart')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--walmart'
      if (value.includes('shein')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--shein'
      if (value.includes('nike')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--nike'
      if (value.includes('apple')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--apple'
      if (value.includes('miles')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--more'

      return 'cb-ps-intro__brand-logo'
    },
    resolveIcon(icon) {
      return this.icons[icon] || ''
    },
    isInternalRoute(url) {
      return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//')
    },
    linkAttrs(url) {
      if (this.isInternalRoute(url)) {
        return { to: url }
      }
      return { href: url || '#' }
    }
  },
  head() {
    return {
      title: this.resolvedPageContent.meta_title || '',
      titleTemplate: '%s',
      meta: [{ hid: 'description', name: 'description', content: this.resolvedPageContent.meta_description || '' }],
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

async function fetchPage($api) {
  const endpoints = ['/frontapi/api/site/pages/postalshopper', '/api/site/pages/postalshopper']
  for (const endpoint of endpoints) {
    const payload = await safeGet($api, endpoint)
    if (payload) {
      return payload
    }
  }
  return null
}

function normalizePage(payload = {}, base = POSTALSHOPPER_SOURCE_PAGE) {
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
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
    accessibility: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.8"></circle><path d="M7 8h10"></path><path d="M12 8v5"></path><path d="m9 21 3-6 3 6"></path><path d="m8 12 4 2 4-2"></path></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"></path><path d="M12 17h.01"></path></svg>',
    login: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.7 5.47 6.03.88-4.36 4.25 1.03 6.01L12 16.77 6.6 19.61l1.03-6.01L3.27 9.35l6.03-.88L12 3Z"></path></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1"></circle><circle cx="18" cy="20" r="1"></circle><path d="M3 4h3l2.4 10h10.8l2.1-7H7.2"></path></svg>',
    package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 8 4.5v11L12 22 4 17.5v-11L12 2Z"></path><path d="M12 22V11"></path><path d="m20 6.5-8 4.5-8-4.5"></path><path d="m8 4.2 8 4.6"></path></svg>',
    plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"></path><path d="M22 2 15 22l-4-9-9-4 20-7Z"></path></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.86l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.86-.34 1.7 1.7 0 0 0-1 1.54V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.54 1.7 1.7 0 0 0-1.86.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.86 1.7 1.7 0 0 0-1.54-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.54-1 1.7 1.7 0 0 0-.34-1.86l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.86.34h.08a1.7 1.7 0 0 0 1-1.54V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.54 1.7 1.7 0 0 0 1.86-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.86v.08a1.7 1.7 0 0 0 1.54 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.54 1Z"></path></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z"></path></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-2 7 4 1-6 12 2-8-4-1 6-11Z"></path></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
    'phone-call': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.3a2 2 0 0 1 2.11-.45c.85.3 1.74.52 2.64.64A2 2 0 0 1 22 16.92z"></path></svg>'
  }
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/postalshopper.css"></style>
