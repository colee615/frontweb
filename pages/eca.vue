<template>
  <div class="cb-page cb-eca-page" :style="themeStyles" :class="{ 'cb-page--ready': !isBootLoading }">
    <transition name="cb-page-loader">
      <div v-if="isBootLoading" class="cb-page-loading-line" aria-live="polite" aria-busy="true">
        <span />
      </div>
    </transition>

    <HomeHeader v-if="!isBootLoading" :logo-url="logoUrl" :icons="icons" :content="headerSettings" :links="headerLinks" />

    <main v-if="!isBootLoading" class="cb-page__content cb-eca">
      <section id="eca-hero" class="cb-eca-hero">
        <div class="cb-shell cb-eca-hero__grid">
          <article class="cb-eca-hero__copy cb-eca-reveal" data-reveal>
            <div v-if="heroSettings.badge" class="cb-eca-hero__badge">{{ heroSettings.badge }}</div>

            <h1>
              <span v-if="heroSettings.title_line_one_blue || heroSettings.title_line_one_yellow">
                <strong v-if="heroSettings.title_line_one_blue">{{ heroSettings.title_line_one_blue }}</strong>
                <em v-if="heroSettings.title_line_one_yellow">{{ heroSettings.title_line_one_yellow }}</em>
              </span>
              <span v-if="heroSettings.title_line_two_yellow"><em>{{ heroSettings.title_line_two_yellow }}</em></span>
              <span v-if="heroSettings.title_line_three_blue"><strong>{{ heroSettings.title_line_three_blue }}</strong></span>
            </h1>

            <p v-if="heroSettings.subtitle" class="cb-eca-hero__subtitle">{{ heroSettings.subtitle }}</p>

            <div class="cb-eca-hero__actions">
              <component
                v-if="heroSettings.primary_button_label && heroSettings.primary_button_url"
                :is="isInternalRoute(heroSettings.primary_button_url) ? 'nuxt-link' : 'a'"
                class="cb-eca-btn cb-eca-btn--primary"
                v-bind="linkAttrs(heroSettings.primary_button_url)"
              >
                {{ heroSettings.primary_button_label }}
                <span aria-hidden="true">&rarr;</span>
              </component>

              <component
                v-if="heroSettings.secondary_button_label && heroSettings.secondary_button_url"
                :is="isInternalRoute(heroSettings.secondary_button_url) ? 'nuxt-link' : 'a'"
                class="cb-eca-btn cb-eca-btn--ghost"
                v-bind="linkAttrs(heroSettings.secondary_button_url)"
              >
                {{ heroSettings.secondary_button_label }}
              </component>
            </div>
          </article>

          <article class="cb-eca-hero__visual cb-eca-reveal" data-reveal style="--cb-delay: 100ms;">
            <div class="cb-eca-hero__orb">
              <img v-if="heroSettings.visual_image" :src="heroSettings.visual_image" alt="" class="cb-eca-hero__image">
              <div v-else-if="heroSettings.visual_icon" class="cb-eca-hero__icon" v-html="resolveIcon(heroSettings.visual_icon)"></div>
            </div>
          </article>
        </div>
      </section>

      <section id="eca-intro" class="cb-eca-intro">
        <div class="cb-shell">
          <div class="cb-eca-heading cb-eca-reveal" data-reveal>
            <div class="cb-eca-heading__eyebrow">
              <span></span>
              <small v-if="introSettings.eyebrow">{{ introSettings.eyebrow }}</small>
              <span></span>
            </div>
            <h2 v-if="introSettings.title">{{ introSettings.title }}</h2>
            <p v-if="introSettings.paragraph_one" class="cb-eca-intro__lead">{{ introSettings.paragraph_one }}</p>
            <p v-if="introSettings.paragraph_two" class="cb-eca-intro__copy">{{ introSettings.paragraph_two }}</p>
          </div>

          <div class="cb-eca-intro__icons">
            <article
              v-for="(item, index) in introItems"
              :key="item.id || item.title || index"
              class="cb-eca-intro__icon-card cb-eca-reveal"
              data-reveal
              :style="{ '--cb-delay': `${index * 70}ms` }"
            >
              <div class="cb-eca-intro__icon-box" v-html="resolveIcon(item.icon)"></div>
              <strong>{{ item.title }}</strong>
            </article>
          </div>
        </div>
      </section>

      <section id="eca-rates" class="cb-eca-rates">
        <div class="cb-shell">
          <div class="cb-eca-heading cb-eca-heading--light cb-eca-reveal" data-reveal>
            <div class="cb-eca-heading__accent"></div>
            <h2 v-if="ratesSettings.title">{{ ratesSettings.title }}</h2>
            <p v-if="ratesSettings.subtitle">{{ ratesSettings.subtitle }}</p>
          </div>

          <div class="cb-eca-rates__stats">
            <article
              v-for="(item, index) in rateItems"
              :key="item.id || item.title || index"
              class="cb-eca-rates__stat cb-eca-reveal"
              data-reveal
              :style="{ '--cb-delay': `${index * 80}ms` }"
            >
              <strong>{{ item.value }}</strong>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>

          <div class="cb-eca-rates__note cb-eca-reveal" data-reveal style="--cb-delay: 160ms;">
            <div class="cb-eca-rates__note-icon" v-html="icons['check-circle']"></div>
            <div>
              <h3 v-if="ratesSettings.note_title">{{ ratesSettings.note_title }}</h3>
              <p v-if="ratesSettings.note_text">
                <span v-if="ratesNote.before">{{ ratesNote.before }}</span>
                <strong v-if="ratesNote.highlight"> {{ ratesNote.highlight }}</strong>
              </p>
            </div>
          </div>

          <div v-if="ratesSettings.primary_button_label && ratesSettings.primary_button_url" class="cb-eca-rates__cta cb-eca-reveal" data-reveal style="--cb-delay: 220ms;">
            <component
              :is="isInternalRoute(ratesSettings.primary_button_url) ? 'nuxt-link' : 'a'"
              class="cb-eca-btn cb-eca-btn--primary cb-eca-btn--wide"
              v-bind="linkAttrs(ratesSettings.primary_button_url)"
            >
              {{ ratesSettings.primary_button_label }}
              <span aria-hidden="true">&rarr;</span>
            </component>
          </div>
        </div>
      </section>

      <section id="eca-coverage" class="cb-eca-coverage">
        <div class="cb-shell">
          <div class="cb-eca-heading cb-eca-reveal" data-reveal>
            <div class="cb-eca-heading__accent"></div>
            <h2 v-if="coverageSettings.title">{{ coverageSettings.title }}</h2>
            <p v-if="coverageSettings.subtitle">{{ coverageSettings.subtitle }}</p>
          </div>

          <div class="cb-eca-coverage__grid">
            <article
              v-for="(item, index) in coverageItems"
              :key="item.id || item.title || index"
              class="cb-eca-coverage__card cb-eca-reveal"
              data-reveal
              :style="{ '--cb-delay': `${index * 90}ms` }"
            >
              <div class="cb-eca-coverage__card-head">
                <div class="cb-eca-coverage__icon" v-html="resolveIcon(item.icon)"></div>
                <div>
                  <small>{{ item.eyebrow }}</small>
                  <h3>{{ item.title }}</h3>
                </div>
              </div>

              <div class="cb-eca-coverage__rows">
                <div class="cb-eca-coverage__row" v-for="row in buildCoverageRows(item)" :key="row.label + row.value">
                  <span>{{ row.label }}</span>
                  <strong>{{ row.value }}</strong>
                </div>
              </div>
            </article>
          </div>

          <div v-if="coverageSettings.note_title || coverageSettings.note_text" class="cb-eca-coverage__note cb-eca-reveal" data-reveal style="--cb-delay: 180ms;">
            <div class="cb-eca-coverage__note-icon" v-html="icons.lock"></div>
            <div>
              <h3 v-if="coverageSettings.note_title">{{ coverageSettings.note_title }}</h3>
              <p>{{ coverageSettings.note_text }}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="eca-solutions" class="cb-eca-solutions">
        <div class="cb-shell">
          <div class="cb-eca-heading cb-eca-reveal" data-reveal>
            <div class="cb-eca-heading__accent"></div>
            <h2 v-if="solutionsSettings.title">{{ solutionsSettings.title }}</h2>
            <p v-if="solutionsSettings.subtitle">{{ solutionsSettings.subtitle }}</p>
          </div>

          <div class="cb-eca-solutions__grid">
            <article
              v-for="(item, index) in solutionItems"
              :key="item.id || item.title || index"
              class="cb-eca-solutions__card cb-eca-reveal"
              data-reveal
              :style="{ '--cb-delay': `${index * 70}ms` }"
            >
              <div class="cb-eca-solutions__icon" v-html="resolveIcon(item.icon)"></div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="eca-cta" class="cb-eca-cta">
        <div class="cb-shell cb-eca-cta__grid">
          <article class="cb-eca-cta__copy cb-eca-reveal" data-reveal>
            <div class="cb-eca-heading__accent"></div>
            <h2 v-if="ctaSettings.title">{{ ctaSettings.title }}</h2>
            <p v-if="ctaSettings.text">{{ ctaSettings.text }}</p>

            <div class="cb-eca-cta__contacts">
              <div class="cb-eca-contact">
                <div class="cb-eca-contact__icon" v-html="icons['phone-call']"></div>
                <div>
                  <small>{{ ctaSettings.phone_label }}</small>
                  <strong>{{ ctaSettings.phone_value }}</strong>
                </div>
              </div>
              <div class="cb-eca-contact">
                <div class="cb-eca-contact__icon" v-html="icons.mail"></div>
                <div>
                  <small>{{ ctaSettings.email_label }}</small>
                  <strong>{{ ctaSettings.email_value }}</strong>
                </div>
              </div>
              <div class="cb-eca-contact">
                <div class="cb-eca-contact__icon" v-html="icons.pin"></div>
                <div>
                  <small>{{ ctaSettings.address_label }}</small>
                  <strong>{{ ctaSettings.address_value }}</strong>
                </div>
              </div>
            </div>

            <em v-if="ctaSettings.footnote" class="cb-eca-cta__footnote">{{ ctaSettings.footnote }}</em>
          </article>

          <article class="cb-eca-cta__card cb-eca-reveal" data-reveal style="--cb-delay: 110ms;">
            <div class="cb-eca-cta__card-head">
              <span v-html="icons.qr"></span>
              <strong>{{ ctaSettings.qr_title }}</strong>
            </div>
            <div class="cb-eca-cta__qr">
              <img v-if="ctaSettings.qr_image" :src="ctaSettings.qr_image" alt="">
              <div v-else class="cb-eca-cta__qr-placeholder"></div>
            </div>
            <p v-if="ctaSettings.qr_text">{{ ctaSettings.qr_text }}</p>
            <component
              v-if="ctaSettings.button_label && ctaSettings.button_url"
              :is="isInternalRoute(ctaSettings.button_url) ? 'nuxt-link' : 'a'"
              class="cb-eca-btn cb-eca-btn--primary cb-eca-btn--full"
              v-bind="linkAttrs(ctaSettings.button_url)"
            >
              {{ ctaSettings.button_label }}
              <span aria-hidden="true">&rarr;</span>
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

const ECA_SOURCE_PAGE = {
  meta_title: '',
  meta_description: '',
  theme: { logo_url: '', primary_color: '#20539a', secondary_color: '#2f3f5c', accent_color: '#fecc36' },
  sections: [
    { key: 'header', settings: {}, items: [] },
    { key: 'eca_hero', settings: { badge: '', title_line_one_blue: '', title_line_one_yellow: '', title_line_two_yellow: '', title_line_three_blue: '', subtitle: '', primary_button_label: '', primary_button_url: '', secondary_button_label: '', secondary_button_url: '', visual_icon: '', visual_image: '' }, items: [] },
    { key: 'eca_intro', settings: { eyebrow: '', title: '', paragraph_one: '', paragraph_two: '' }, items: [] },
    { key: 'eca_rates', settings: { title: '', subtitle: '', note_title: '', note_text: '', primary_button_label: '', primary_button_url: '' }, items: [] },
    { key: 'eca_coverage', settings: { title: '', subtitle: '', note_title: '', note_text: '' }, items: [] },
    { key: 'eca_solutions', settings: { title: '', subtitle: '' }, items: [] },
    { key: 'eca_cta', settings: { title: '', text: '', phone_label: '', phone_value: '', email_label: '', email_value: '', address_label: '', address_value: '', footnote: '', qr_title: '', qr_text: '', qr_image: '', button_label: '', button_url: '' }, items: [] },
    { key: 'footer', settings: {}, items: [] }
  ]
}

export default {
  name: 'EcaPage',
  data() {
    return { isBootLoading: true, revealObserver: null }
  },
  async asyncData({ $api }) {
    const payload = await fetchPage($api)
    return { pageContent: normalizePage(payload || ECA_SOURCE_PAGE, ECA_SOURCE_PAGE) }
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
      return this.getSectionSettings('eca_hero')
    },
    introSettings() {
      return this.getSectionSettings('eca_intro')
    },
    ratesSettings() {
      return this.getSectionSettings('eca_rates')
    },
    coverageSettings() {
      return this.getSectionSettings('eca_coverage')
    },
    solutionsSettings() {
      return this.getSectionSettings('eca_solutions')
    },
    ctaSettings() {
      return this.getSectionSettings('eca_cta')
    },
    introItems() {
      return this.getSectionItems('eca_intro')
    },
    rateItems() {
      return this.getSectionItems('eca_rates')
    },
    coverageItems() {
      return this.getSectionItems('eca_coverage')
    },
    solutionItems() {
      return this.getSectionItems('eca_solutions')
    },
    ratesNote() {
      const value = String(this.ratesSettings.note_text || '').trim()
      const match = value.match(/^(.*?)(¡[^!]+!|[A-ZÁÉÍÓÚÑ].*)$/)
      if (!match) {
        return { before: value, highlight: '' }
      }
      return { before: match[1].trim(), highlight: match[2].trim() }
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
          this.pageContent = normalizePage(payload, ECA_SOURCE_PAGE)
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
      return section.items.map((item) => ({ ...(item.data || {}), id: item.id, type: item.type }))
    },
    buildCoverageRows(item) {
      return [
        { label: item.row_one_label, value: item.row_one_value },
        { label: item.row_two_label, value: item.row_two_value },
        { label: item.row_three_label, value: item.row_three_value }
      ].filter((row) => row.label || row.value)
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
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
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
      meta: [{ hid: 'description', name: 'description', content: this.pageContent.meta_description || '' }],
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
  const endpoints = ['/frontapi/api/site/pages/eca', '/api/site/pages/eca']
  for (const endpoint of endpoints) {
    const payload = await safeGet($api, endpoint)
    if (payload) {
      return payload
    }
  }
  return null
}

function normalizePage(payload = {}, base = ECA_SOURCE_PAGE) {
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
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M5 21V7l7-4v18"></path><path d="M19 21V11l-7-4"></path><path d="M9 9h.01"></path><path d="M9 13h.01"></path><path d="M9 17h.01"></path><path d="M15 13h.01"></path><path d="M15 17h.01"></path></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"></path><path d="M14 2v5h5"></path><path d="M9 13h6"></path><path d="M9 17h6"></path><path d="M9 9h1"></path></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"></path><path d="M10 20V4"></path><path d="M16 20v-8"></path><path d="M22 20V8"></path></svg>',
    megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 14-5v12L3 13v-2Z"></path><path d="M11 14v5"></path><path d="M6 13v4"></path><path d="M19 9c1.5.8 2.5 2.3 2.5 4s-1 3.2-2.5 4"></path></svg>',
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M3 12h18"></path></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="7.5" width="8.5" height="8" rx="1.2"></rect><path d="M12 9h4l3 3v3.5h-7"></path><circle cx="8" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle></svg>',
    plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"></path><path d="M22 2 15 22l-4-9-9-4 20-7Z"></path></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 1 1 8 0v3"></path></svg>',
    qr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h4v4H4z"></path><path d="M16 4h4v4h-4z"></path><path d="M4 16h4v4H4z"></path><path d="M10 4h1"></path><path d="M10 9h1"></path><path d="M15 10h1"></path><path d="M10 14h1"></path><path d="M13 13h1"></path><path d="M16 16h1"></path><path d="M19 13h1"></path><path d="M19 19h1"></path><path d="M13 19h4"></path></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
    'phone-call': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.3a2 2 0 0 1 2.11-.45c.85.3 1.74.52 2.64.64A2 2 0 0 1 22 16.92z"></path></svg>',
    'check-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="m8.5 12 2.5 2.5 4.5-5"></path></svg>'
  }
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/eca.css"></style>
