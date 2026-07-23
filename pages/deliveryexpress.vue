<template>
  <div class="cb-page cb-delivery-page" :style="themeStyles" :class="{ 'cb-page--ready': !isBootLoading }">
    <transition name="cb-page-loader">
      <div v-if="isBootLoading" class="cb-page-loading-line" aria-live="polite" aria-busy="true">
        <span />
      </div>
    </transition>

    <HomeHeader v-if="!isBootLoading" :logo-url="logoUrl" :icons="icons" :content="headerSettings" :links="headerLinks" />

    <main v-if="!isBootLoading" class="cb-page__content cb-delivery">
      <section id="deliveryexpress-hero" class="cb-delivery-hero">
        <div class="cb-shell cb-delivery-hero__grid">
          <article class="cb-delivery-hero__copy cb-delivery-reveal" data-reveal>
            <h1 v-if="heroSettings.title_primary || heroSettings.title_secondary">
              <span v-if="heroSettings.title_primary">{{ heroSettings.title_primary }}</span>
              <span v-if="heroSettings.title_secondary">{{ heroSettings.title_secondary }}</span>
            </h1>
            <p v-if="heroSettings.eyebrow" class="cb-delivery-hero__eyebrow">{{ heroSettings.eyebrow }}</p>
            <p v-if="heroSettings.subtitle" class="cb-delivery-hero__subtitle">{{ heroSettings.subtitle }}</p>

            <div class="cb-delivery-hero__actions">
              <component
                v-if="heroSettings.primary_button_label && heroSettings.primary_button_url"
                :is="isInternalRoute(heroSettings.primary_button_url) ? 'nuxt-link' : 'a'"
                class="cb-delivery-btn cb-delivery-btn--primary"
                v-bind="linkAttrs(heroSettings.primary_button_url)"
              >
                {{ heroSettings.primary_button_label }}
              </component>
            </div>
          </article>

          <article class="cb-delivery-hero__visual cb-delivery-reveal" data-reveal style="--cb-delay: 90ms;">
            <div :class="['cb-delivery-hero__visual-card', { 'cb-delivery-hero__visual-card--has-image': heroHasImage }]">
              <img v-if="heroHasImage" :src="heroSettings.visual_image" alt="" class="cb-delivery-hero__image">
              <div v-else-if="heroHasIcon" class="cb-delivery-hero__icon" v-html="resolveIcon(heroSettings.visual_icon)"></div>
              <span v-if="!heroHasImage" class="cb-delivery-hero__ring cb-delivery-hero__ring--top" aria-hidden="true"></span>
              <span v-if="!heroHasImage" class="cb-delivery-hero__ring cb-delivery-hero__ring--bottom" aria-hidden="true"></span>
              <div v-if="!heroHasImage && heroSettings.floating_icon" class="cb-delivery-hero__floating" v-html="resolveIcon(heroSettings.floating_icon)"></div>
            </div>
          </article>
        </div>
      </section>

      <section id="deliveryexpress-intro" class="cb-delivery-intro">
        <div class="cb-shell cb-delivery-intro__grid">
          <article class="cb-delivery-intro__copy cb-delivery-reveal" data-reveal>
            <h2 v-if="introSettings.title">{{ introSettings.title }}</h2>
            <p v-if="introHighlight.before || introHighlight.after" class="cb-delivery-intro__highlight">
              <strong v-if="introHighlight.before">{{ introHighlight.before }}</strong><span v-if="introHighlight.after"> {{ introHighlight.after }}</span>
            </p>
            <p v-for="(paragraph, index) in introParagraphs" :key="`delivery-intro-${index}`">{{ paragraph }}</p>
            <p v-if="introSettings.closing_text" class="cb-delivery-intro__closing">{{ introSettings.closing_text }}</p>

            <div v-if="introChips.length" class="cb-delivery-intro__chips">
              <span v-for="chip in introChips" :key="chip">{{ chip }}</span>
            </div>
          </article>

          <article class="cb-delivery-intro__visual cb-delivery-reveal" data-reveal style="--cb-delay: 110ms;">
            <div :class="['cb-delivery-intro__visual-card', { 'cb-delivery-intro__visual-card--has-image': introHasImage }]">
              <img v-if="introHasImage" :src="introSettings.visual_image" alt="" class="cb-delivery-intro__image">
              <div v-else-if="introHasIcon" class="cb-delivery-intro__icon" v-html="resolveIcon(introSettings.visual_icon)"></div>
              <span v-if="introSettings.visual_badge" class="cb-delivery-intro__badge">{{ introSettings.visual_badge }}</span>
            </div>
          </article>
        </div>
      </section>

      <section id="deliveryexpress-advantages" class="cb-delivery-advantages">
        <div class="cb-shell">
          <div class="cb-delivery-section-heading cb-delivery-section-heading--light cb-delivery-reveal" data-reveal>
            <h2 v-if="advantagesSettings.title">{{ advantagesSettings.title }}</h2>
            <p v-if="advantagesSettings.subtitle">{{ advantagesSettings.subtitle }}</p>
          </div>

          <div class="cb-delivery-advantages__grid">
            <article
              v-for="(item, index) in advantageItems"
              :key="item.id || item.title || index"
              class="cb-delivery-advantage-card cb-delivery-reveal"
              data-reveal
              :style="{ '--cb-delay': `${index * 70}ms` }"
            >
              <div class="cb-delivery-advantage-card__icon" v-html="resolveIcon(item.icon)"></div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
              <span v-if="item.badge" class="cb-delivery-advantage-card__bar">{{ item.badge }}</span>
            </article>
          </div>
        </div>
      </section>

      <section id="deliveryexpress-process" class="cb-delivery-process">
        <div class="cb-shell">
          <div class="cb-delivery-section-heading cb-delivery-reveal" data-reveal>
            <h2 v-if="processSettings.title">{{ processSettings.title }}</h2>
            <p v-if="processSettings.subtitle">{{ processSettings.subtitle }}</p>
          </div>

          <div class="cb-delivery-process__steps">
            <article
              v-for="(item, index) in processItems"
              :key="item.id || item.title || index"
              class="cb-delivery-step cb-delivery-reveal"
              data-reveal
              :style="{ '--cb-delay': `${index * 90}ms` }"
            >
              <span v-if="item.badge" class="cb-delivery-step__number">{{ item.badge }}</span>
              <div class="cb-delivery-step__icon" v-html="resolveIcon(item.icon)"></div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>

          <div class="cb-delivery-process__panel cb-delivery-reveal" data-reveal style="--cb-delay: 180ms;">
            <div class="cb-delivery-process__feature">
              <h3 v-if="processSettings.feature_title">{{ processSettings.feature_title }}</h3>
              <p v-if="processSettings.feature_text">{{ processSettings.feature_text }}</p>
              <ul v-if="processBullets.length" class="cb-delivery-process__bullets">
                <li v-for="bullet in processBullets" :key="bullet">{{ bullet }}</li>
              </ul>
            </div>

            <div class="cb-delivery-tracker">
              <div class="cb-delivery-tracker__head">
                <strong>{{ processSettings.tracker_title }}</strong>
                <span v-if="processSettings.tracker_status">{{ processSettings.tracker_status }}</span>
              </div>
              <div class="cb-delivery-tracker__map">
                <div class="cb-delivery-tracker__pulse"></div>
                <div class="cb-delivery-tracker__state">
                  <span class="cb-delivery-tracker__state-icon" v-html="icons.package"></span>
                  <strong>{{ processSettings.tracker_stage }}</strong>
                </div>
              </div>
              <div class="cb-delivery-tracker__timeline">
                <article v-for="event in processTimeline" :key="event.title + event.time" :class="{ 'is-muted': !event.title }">
                  <span></span>
                  <div>
                    <strong>{{ event.title }}</strong>
                    <small>{{ event.time }}</small>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="deliveryexpress-info" class="cb-delivery-info">
        <div class="cb-shell">
          <div class="cb-delivery-info__panel cb-delivery-reveal" data-reveal>
            <div class="cb-delivery-section-heading">
              <h2 v-if="infoSettings.title">{{ infoSettings.title }}</h2>
              <p v-if="infoSettings.subtitle">{{ infoSettings.subtitle }}</p>
            </div>

            <div class="cb-delivery-info__grid">
              <article
                v-for="(item, index) in infoItems"
                :key="item.id || item.title || index"
                class="cb-delivery-info-card"
              >
                <div class="cb-delivery-info-card__icon" v-html="resolveIcon(item.icon)"></div>
                <div>
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.text }}</p>
                </div>
              </article>
            </div>

            <p v-if="infoSettings.footnote" class="cb-delivery-info__footnote">{{ infoSettings.footnote }}</p>
          </div>
        </div>
      </section>

    </main>

    <HomeFooter v-if="!isBootLoading" :logo-url="logoUrl" :icons="icons" :content="footerSettings" :links="footerLinks" />
  </div>
</template>

<script>
import { sanitizeContentTree } from '~/utils/contentSecurity'

const DELIVERY_SOURCE_PAGE = {
  meta_title: '',
  meta_description: '',
  theme: { logo_url: '', primary_color: '#20539a', secondary_color: '#2f3f5c', accent_color: '#fecc36' },
  sections: [
    { key: 'header', settings: { help_label: '', login_label: '', search_placeholder: '', language_primary: '', language_secondary: '', accessibility_label: '' }, items: [] },
    { key: 'delivery_hero', settings: { title_primary: '', title_secondary: '', eyebrow: '', subtitle: '', primary_button_label: '', primary_button_url: '', secondary_button_label: '', secondary_button_url: '', visual_icon: '', floating_icon: '', visual_image: '' }, items: [] },
    { key: 'delivery_intro', settings: { title: '', highlight_text: '', paragraph_one: '', paragraph_two: '', closing_text: '', chip_one: '', chip_two: '', chip_three: '', visual_icon: '', visual_badge: '', visual_image: '' }, items: [] },
    { key: 'delivery_advantages', settings: { title: '', subtitle: '' }, items: [] },
    { key: 'delivery_process', settings: { title: '', subtitle: '', feature_title: '', feature_text: '', bullet_one: '', bullet_two: '', bullet_three: '', tracker_title: '', tracker_status: '', tracker_stage: '', timeline_one_title: '', timeline_one_time: '', timeline_two_title: '', timeline_two_time: '', timeline_three_title: '', timeline_three_time: '' }, items: [] },
    { key: 'delivery_info', settings: { title: '', subtitle: '', footnote: '' }, items: [] },
    { key: 'delivery_cta', settings: { title: '', subtitle: '', trust_text: '', app_title: '', app_note: '', app_store_label: '', app_store_url: '', app_store_badge: '', play_store_label: '', play_store_url: '', play_store_badge: '', register_title: '', register_text: '', register_qr_image: '', contact_title: '', contact_whatsapp_label: '', contact_whatsapp_url: '', contact_web_label: '', contact_web_url: '', contact_phone_label: '', contact_phone_url: '' }, items: [] },
    { key: 'footer', settings: { help_title: '', company_title: '', contact_title: '', social_title: '', social_text: '', address: '', phone: '', email: '', copyright: '', legal_text: '' }, items: [] }
  ]
}

export default {
  name: 'DeliveryExpressPage',
  data() {
    return {
      isBootLoading: true,
      revealObserver: null
    }
  },
  async asyncData({ $api }) {
    const payload = await fetchPage($api)

    return {
      pageContent: normalizePage(payload || DELIVERY_SOURCE_PAGE, DELIVERY_SOURCE_PAGE)
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
      return this.pageContent.theme.logo_url || ''
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
      return this.getSectionSettings('delivery_hero')
    },
    heroHasImage() {
      return this.hasAsset(this.heroSettings.visual_image)
    },
    heroHasIcon() {
      return !this.heroHasImage && this.hasAsset(this.heroSettings.visual_icon)
    },
    introSettings() {
      return this.getSectionSettings('delivery_intro')
    },
    introHasImage() {
      return this.hasAsset(this.introSettings.visual_image)
    },
    introHasIcon() {
      return !this.introHasImage && this.hasAsset(this.introSettings.visual_icon)
    },
    advantagesSettings() {
      return this.getSectionSettings('delivery_advantages')
    },
    processSettings() {
      return this.getSectionSettings('delivery_process')
    },
    infoSettings() {
      return this.getSectionSettings('delivery_info')
    },
    ctaSettings() {
      return this.getSectionSettings('delivery_cta')
    },
    advantageItems() {
      return this.getSectionItems('delivery_advantages')
    },
    processItems() {
      return this.getSectionItems('delivery_process')
    },
    infoItems() {
      return this.getSectionItems('delivery_info')
    },
    introParagraphs() {
      return [
        this.introSettings.paragraph_one,
        this.introSettings.paragraph_two
      ].filter((item) => String(item || '').trim() !== '')
    },
    introChips() {
      return [this.introSettings.chip_one, this.introSettings.chip_two, this.introSettings.chip_three]
        .filter((item) => String(item || '').trim() !== '')
    },
    introHighlight() {
      const value = String(this.introSettings.highlight_text || '').trim()

      if (!value) {
        return { before: '', after: '' }
      }

      const separatorIndex = value.indexOf(':')

      if (separatorIndex === -1) {
        return { before: value, after: '' }
      }

      return {
        before: value.slice(0, separatorIndex + 1).trim(),
        after: value.slice(separatorIndex + 1).trim()
      }
    },
    processBullets() {
      return [this.processSettings.bullet_one, this.processSettings.bullet_two, this.processSettings.bullet_three]
        .filter((item) => String(item || '').trim() !== '')
    },
    processTimeline() {
      return [
        { title: this.processSettings.timeline_one_title, time: this.processSettings.timeline_one_time },
        { title: this.processSettings.timeline_two_title, time: this.processSettings.timeline_two_time },
        { title: this.processSettings.timeline_three_title, time: this.processSettings.timeline_three_time }
      ].filter((item) => String(item.title || item.time || '').trim() !== '')
    },
    themeStyles() {
      const theme = this.pageContent.theme || {}

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
        const payload = await fetchPage(this.$api)

        if (payload) {
          this.pageContent = normalizePage(payload, DELIVERY_SOURCE_PAGE)
        }
      } finally {
        const elapsed = Date.now() - startedAt
        const remaining = Math.max(0, 700 - elapsed)

        window.setTimeout(() => {
          this.isBootLoading = false
          this.$nextTick(() => this.setupRevealObserver())
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
    },
    resolveIcon(icon) {
      return this.icons[icon] || ''
    },
    hasAsset(value) {
      const text = String(value || '').trim()

      return text !== '' && text.toLowerCase() !== 'null' && text.toLowerCase() !== 'undefined'
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
    resolveContactLabel(value) {
      const text = String(value || '').trim()

      if (!text) {
        return { eyebrow: '', main: '' }
      }

      if (/whatsapp$/i.test(text)) {
        return {
          eyebrow: text.replace(/\s+whatsapp$/i, '').trim(),
          main: 'WhatsApp'
        }
      }

      if (/p[aá]gina web$/i.test(text)) {
        return {
          eyebrow: text.replace(/\s+p[aá]gina web$/i, '').trim(),
          main: 'Página Web'
        }
      }

      if (/\d/.test(text)) {
        const parts = text.split(/\s+/)

        return {
          eyebrow: parts.slice(0, -1).join(' '),
          main: parts.slice(-1).join(' ')
        }
      }

      return { eyebrow: '', main: text }
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
        threshold: 0.12,
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
      title: this.pageContent.meta_title || '',
      titleTemplate: '%s',
      meta: [
        { hid: 'description', name: 'description', content: this.pageContent.meta_description || '' }
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

async function fetchPage($api) {
  const endpoints = ['/frontapi/api/site/pages/deliveryexpress', '/api/site/pages/deliveryexpress']

  for (const endpoint of endpoints) {
    const payload = await safeGet($api, endpoint)

    if (payload) {
      return payload
    }
  }

  return null
}

function normalizePage(payload = {}, base = DELIVERY_SOURCE_PAGE) {
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
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="20" y1="20" x2="16.65" y2="16.65"></line></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
    'phone-call': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.3a2 2 0 0 1 2.11-.45c.85.3 1.74.52 2.64.64A2 2 0 0 1 22 16.92z"></path></svg>',
    smartphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2.5" width="10" height="19" rx="2.5"></rect><circle cx="12" cy="17.8" r="0.7" fill="currentColor" stroke="none"></circle></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="5.5" width="9.5" height="10.5" rx="1.2"></rect><path d="M14 7.6h3.4l3.1 3.1V16c0 .66-.54 1.2-1.2 1.2H14"></path><path d="M17.4 7.6 20.5 10.7"></path><circle cx="9.2" cy="16.3" r="2.35"></circle><circle cx="17.9" cy="16.3" r="2.35"></circle></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"></path></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path></svg>',
    'trend-up': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 6-6 4 4 7-8"></path><path d="M14 7h6v6"></path></svg>',
    package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="M3.3 7l8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>',
    'check-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="m8.5 12 2.5 2.5 4.5-5"></path></svg>',
    'message-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5a8.5 8.5 0 0 1-8.5 8.5 8.3 8.3 0 0 1-3.6-.8L4 20l.9-3.3A8.5 8.5 0 1 1 20 11.5Z"></path></svg>'
  }
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/deliveryexpress.css"></style>
