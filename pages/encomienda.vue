<template>
  <div class="cb-page cb-encomienda-page" :style="themeStyles" :class="{ 'cb-page--ready': !isBootLoading }">
    <transition name="cb-page-loader">
      <div v-if="isBootLoading" class="cb-page-loading-line" aria-live="polite" aria-busy="true">
        <span />
      </div>
    </transition>

    <HomeHeader v-if="!isBootLoading" :logo-url="logoUrl" :icons="icons" :content="headerSettings" :links="headerLinks" />

    <main v-if="!isBootLoading" class="cb-page__content cb-encomienda">
      <section id="encomienda-hero" class="cb-encomienda-hero">
        <div class="cb-shell cb-encomienda-hero__inner">
          <div class="cb-encomienda-hero__badge cb-encomienda-reveal" data-reveal v-if="heroSettings.badge">
            <span class="cb-encomienda-hero__badge-dot"></span>
            {{ heroSettings.badge }}
          </div>

          <div class="cb-encomienda-hero__icon-shell cb-encomienda-reveal" data-reveal style="--cb-delay: 90ms;">
            <div
              v-if="heroSettings.visual_image"
              class="cb-encomienda-hero__icon-image"
              :style="{ backgroundImage: `url(${heroSettings.visual_image})` }"
            ></div>
            <div v-else class="cb-encomienda-hero__icon-mark" v-html="resolveIcon(heroSettings.visual_icon || 'package')"></div>
          </div>

          <article class="cb-encomienda-hero__copy cb-encomienda-reveal" data-reveal style="--cb-delay: 130ms;">
            <h1>
              <span v-for="(row, index) in heroTitleRows" :key="`hero-row-${index}`">
                <strong v-if="row.white">{{ row.white }}</strong>
                <em v-if="row.yellow">{{ row.yellow }}</em>
              </span>
            </h1>

            <p v-if="heroSettings.subtitle" class="cb-encomienda-hero__subtitle">
              {{ heroSettings.subtitle }}
            </p>

            <div class="cb-encomienda-hero__actions">
              <component
                v-if="heroSettings.primary_button_label && heroSettings.primary_button_url"
                :is="isInternalRoute(heroSettings.primary_button_url) ? 'nuxt-link' : 'a'"
                class="cb-encomienda-btn cb-encomienda-btn--primary"
                v-bind="linkAttrs(heroSettings.primary_button_url)"
              >
                {{ heroSettings.primary_button_label }}
                <span aria-hidden="true">&rarr;</span>
              </component>

              <component
                v-if="heroSettings.secondary_button_label && heroSettings.secondary_button_url"
                :is="isInternalRoute(heroSettings.secondary_button_url) ? 'nuxt-link' : 'a'"
                class="cb-encomienda-btn cb-encomienda-btn--ghost"
                v-bind="linkAttrs(heroSettings.secondary_button_url)"
              >
                {{ heroSettings.secondary_button_label }}
              </component>
            </div>
          </article>
        </div>
      </section>

      <section id="encomienda-intro" class="cb-encomienda-intro">
        <div class="cb-shell cb-encomienda-intro__grid">
          <article class="cb-encomienda-intro__visual cb-encomienda-reveal" data-reveal>
            <div class="cb-encomienda-intro__photo-shell">
              <img v-if="introSettings.image" :src="introSettings.image" alt="" class="cb-encomienda-intro__photo">
              <div v-else class="cb-encomienda-intro__placeholder" v-html="resolveIcon(introSettings.visual_icon || 'package')"></div>

              <div
                v-if="introSettings.badge_value || introSettings.badge_suffix || introSettings.badge_label"
                class="cb-encomienda-intro__floating-badge"
              >
                <small v-if="introSettings.badge_label">{{ introSettings.badge_label }}</small>
                <strong>
                  <span v-if="introSettings.badge_value">{{ introSettings.badge_value }}</span>
                  <em v-if="introSettings.badge_suffix">{{ introSettings.badge_suffix }}</em>
                </strong>
              </div>
            </div>
          </article>

          <article class="cb-encomienda-intro__copy cb-encomienda-reveal" data-reveal style="--cb-delay: 90ms;">
            <div class="cb-encomienda-heading__accent"></div>
            <h2 v-if="introSettings.title">{{ introSettings.title }}</h2>
            <p v-if="introSettings.paragraph_one">{{ introSettings.paragraph_one }}</p>
            <p v-if="introSettings.paragraph_two">{{ introSettings.paragraph_two }}</p>

            <blockquote v-if="introSettings.quote" class="cb-encomienda-intro__quote">
              {{ introSettings.quote }}
            </blockquote>

            <div class="cb-encomienda-intro__stats" v-if="introStats.length">
              <div v-for="(item, index) in introStats" :key="item.id || item.label || index" class="cb-encomienda-intro__stat">
                <strong>{{ item.value }}</strong>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="encomienda-features" class="cb-encomienda-features">
        <div class="cb-shell">
          <div class="cb-encomienda-heading cb-encomienda-heading--light cb-encomienda-reveal" data-reveal>
            <h2 v-if="featuresSettings.title">{{ featuresSettings.title }}</h2>
            <p v-if="featuresSettings.subtitle">{{ featuresSettings.subtitle }}</p>
          </div>

          <div class="cb-encomienda-features__grid">
            <article
              v-for="(item, index) in featureItems"
              :key="item.id || item.title || index"
              class="cb-encomienda-feature-card cb-encomienda-reveal"
              data-reveal
              :style="{ '--cb-delay': `${index * 70}ms` }"
            >
              <div class="cb-encomienda-feature-card__icon" v-html="resolveIcon(item.icon || 'package')"></div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="encomienda-faq" class="cb-encomienda-faq">
        <div class="cb-shell cb-encomienda-faq__shell">
          <div class="cb-encomienda-heading cb-encomienda-reveal" data-reveal>
            <div class="cb-encomienda-heading__accent"></div>
            <h2 v-if="faqSettings.title">{{ faqSettings.title }}</h2>
            <p v-if="faqSettings.subtitle">{{ faqSettings.subtitle }}</p>
          </div>

          <div class="cb-encomienda-faq__list">
            <article
              v-for="(item, index) in faqItems"
              :key="item.id || item.title || index"
              class="cb-encomienda-faq__item cb-encomienda-reveal"
              data-reveal
              :style="{ '--cb-delay': `${index * 60}ms` }"
              :class="{ 'is-open': activeFaqIndex === index }"
            >
              <button type="button" class="cb-encomienda-faq__trigger" @click="toggleFaq(index)">
                <span class="cb-encomienda-faq__icon" v-html="resolveIcon(item.icon || 'package')"></span>
                <strong>{{ item.title }}</strong>
                <span class="cb-encomienda-faq__chevron" aria-hidden="true">&or;</span>
              </button>
              <div v-if="activeFaqIndex === index" class="cb-encomienda-faq__body">
                <p>{{ item.text }}</p>
              </div>
            </article>
          </div>

          <div v-if="faqSettings.tip_text" class="cb-encomienda-faq__tip cb-encomienda-reveal" data-reveal style="--cb-delay: 190ms;">
            <div class="cb-encomienda-faq__tip-icon" v-html="icons['check-circle']"></div>
            <p>{{ faqSettings.tip_text }}</p>
          </div>
        </div>
      </section>

      <section id="encomienda-cta" class="cb-encomienda-cta">
        <div class="cb-shell cb-encomienda-cta__inner">
          <div class="cb-encomienda-heading cb-encomienda-reveal" data-reveal>
            <div class="cb-encomienda-heading__accent"></div>
            <h2 v-if="ctaSettings.title">{{ ctaSettings.title }}</h2>
            <p v-if="ctaSettings.subtitle">{{ ctaSettings.subtitle }}</p>
          </div>

          <div class="cb-encomienda-cta__actions cb-encomienda-reveal" data-reveal style="--cb-delay: 80ms;">
            <component
              v-if="ctaSettings.button_one_label && ctaSettings.button_one_url"
              :is="isInternalRoute(ctaSettings.button_one_url) ? 'nuxt-link' : 'a'"
              class="cb-encomienda-btn cb-encomienda-btn--ghost-alt"
              v-bind="linkAttrs(ctaSettings.button_one_url)"
            >
              {{ ctaSettings.button_one_label }}
            </component>

            <component
              v-if="ctaSettings.button_two_label && ctaSettings.button_two_url"
              :is="isInternalRoute(ctaSettings.button_two_url) ? 'nuxt-link' : 'a'"
              class="cb-encomienda-btn cb-encomienda-btn--primary"
              v-bind="linkAttrs(ctaSettings.button_two_url)"
            >
              {{ ctaSettings.button_two_label }}
            </component>

            <component
              v-if="ctaSettings.button_three_label && ctaSettings.button_three_url"
              :is="isInternalRoute(ctaSettings.button_three_url) ? 'nuxt-link' : 'a'"
              class="cb-encomienda-btn cb-encomienda-btn--ghost-soft"
              v-bind="linkAttrs(ctaSettings.button_three_url)"
            >
              {{ ctaSettings.button_three_label }}
            </component>
          </div>

          <div class="cb-encomienda-cta__chips" v-if="ctaItems.length">
            <article
              v-for="(item, index) in ctaItems"
              :key="item.id || item.text || index"
              class="cb-encomienda-chip cb-encomienda-reveal"
              data-reveal
              :style="{ '--cb-delay': `${110 + index * 50}ms` }"
            >
              <span class="cb-encomienda-chip__icon" v-html="resolveIcon(item.icon || 'pin')"></span>
              <strong>{{ item.text }}</strong>
            </article>
          </div>

          <em v-if="ctaSettings.footnote" class="cb-encomienda-cta__footnote cb-encomienda-reveal" data-reveal style="--cb-delay: 240ms;">
            {{ ctaSettings.footnote }}
          </em>

          <div v-if="ctaSettings.watermark_text" class="cb-encomienda-cta__watermark" aria-hidden="true">
            {{ ctaSettings.watermark_text }}
          </div>
        </div>
      </section>
    </main>

    <HomeFooter v-if="!isBootLoading" :logo-url="logoUrl" :icons="icons" :content="footerSettings" :links="footerLinks" />
  </div>
</template>

<script>
import { sanitizeContentTree } from '~/utils/contentSecurity'

const ENCOMIENDA_SOURCE_PAGE = {
  meta_title: '',
  meta_description: '',
  theme: { logo_url: '', primary_color: '#0d47b5', secondary_color: '#2a4268', accent_color: '#ffc61a' },
  sections: [
    { key: 'header', settings: {}, items: [] },
    { key: 'encomienda_hero', settings: { badge: '', title_line_one_white: '', title_line_one_yellow: '', title_line_two_white: '', title_line_two_yellow: '', subtitle: '', primary_button_label: '', primary_button_url: '', secondary_button_label: '', secondary_button_url: '', visual_icon: '', visual_image: '' }, items: [] },
    { key: 'encomienda_intro', settings: { title: '', paragraph_one: '', paragraph_two: '', quote: '', image: '', visual_icon: '', badge_label: '', badge_value: '', badge_suffix: '' }, items: [] },
    { key: 'encomienda_features', settings: { title: '', subtitle: '' }, items: [] },
    { key: 'encomienda_faq', settings: { title: '', subtitle: '', tip_text: '' }, items: [] },
    { key: 'encomienda_cta', settings: { title: '', subtitle: '', button_one_label: '', button_one_url: '', button_two_label: '', button_two_url: '', button_three_label: '', button_three_url: '', footnote: '', watermark_text: '' }, items: [] },
    { key: 'footer', settings: {}, items: [] }
  ]
}

export default {
  name: 'EncomiendaPage',
  data() {
    return {
      isBootLoading: true,
      revealObserver: null,
      activeFaqIndex: null
    }
  },
  async asyncData({ $api }) {
    const payload = await fetchPage($api)
    return { pageContent: normalizePage(payload || ENCOMIENDA_SOURCE_PAGE, ENCOMIENDA_SOURCE_PAGE) }
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
    themeStyles() {
      const theme = this.pageContent.theme || {}
      return {
        '--cb-blue': theme.primary_color || '#0d47b5',
        '--cb-yellow': theme.accent_color || '#ffc61a',
        '--cb-ink': theme.secondary_color || '#2a4268'
      }
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
      return this.getSectionSettings('encomienda_hero')
    },
    introSettings() {
      return this.getSectionSettings('encomienda_intro')
    },
    featuresSettings() {
      return this.getSectionSettings('encomienda_features')
    },
    faqSettings() {
      return this.getSectionSettings('encomienda_faq')
    },
    ctaSettings() {
      return this.getSectionSettings('encomienda_cta')
    },
    introStats() {
      return this.getSectionItems('encomienda_intro')
    },
    featureItems() {
      return this.getSectionItems('encomienda_features')
    },
    faqItems() {
      return this.getSectionItems('encomienda_faq')
    },
    ctaItems() {
      return this.getSectionItems('encomienda_cta')
    },
    heroTitleRows() {
      const firstYellow = splitWords(this.heroSettings.title_line_one_yellow, 2)
      const secondYellow = splitWords(this.heroSettings.title_line_two_yellow, 1)

      return [
        { white: this.heroSettings.title_line_one_white, yellow: firstYellow.lead },
        { white: '', yellow: firstYellow.rest },
        { white: this.heroSettings.title_line_two_white, yellow: secondYellow.lead },
        { white: '', yellow: secondYellow.rest }
      ].filter((row) => row.white || row.yellow)
    }
  },
  methods: {
    async refreshPageContent() {
      const startedAt = Date.now()
      try {
        const payload = await fetchPage(this.$api)
        if (payload) {
          this.pageContent = normalizePage(payload, ENCOMIENDA_SOURCE_PAGE)
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
    toggleFaq(index) {
      this.activeFaqIndex = this.activeFaqIndex === index ? null : index
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
  const endpoints = ['/frontapi/api/site/pages/encomienda', '/api/site/pages/encomienda']
  for (const endpoint of endpoints) {
    const payload = await safeGet($api, endpoint)
    if (payload) {
      return payload
    }
  }
  return null
}

function normalizePage(payload = {}, base = ENCOMIENDA_SOURCE_PAGE) {
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
    package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 8 4.5v11L12 22 4 17.5v-11L12 2Z"></path><path d="M12 22V11"></path><path d="m20 6.5-8 4.5-8-4.5"></path><path d="m8 4.2 8 4.6"></path></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z"></path></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l1 11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 8Z"></path><path d="M9 8V6a3 3 0 0 1 6 0v2"></path></svg>',
    scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"></path><path d="M7 7h10"></path><path d="m5 7-3 5a3 3 0 0 0 6 0L5 7Z"></path><path d="m19 7-3 5a3 3 0 0 0 6 0l-3-5Z"></path><path d="M8 21h8"></path></svg>',
    ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="m4 20 16-16 2 2L6 22 4 20Z"></path><path d="M14 6l4 4"></path><path d="M11 9l2 2"></path><path d="M8 12l2 2"></path></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.3a2 2 0 0 1 2.11-.45c.85.3 1.74.52 2.64.64A2 2 0 0 1 22 16.92z"></path></svg>',
    message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8.5 8.5 0 0 1-8.5 8.5c-1.4 0-2.74-.34-3.92-.94L3 21l1.55-4.53A8.5 8.5 0 1 1 21 12Z"></path></svg>',
    plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"></path><path d="M22 2 15 22l-4-9-9-4 20-7Z"></path></svg>',
    'check-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="m8.5 12 2.5 2.5 4.5-5"></path></svg>'
  }
}

function splitWords(value, takeCount = 1) {
  const words = String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (!words.length) {
    return { lead: '', rest: '' }
  }

  if (words.length <= takeCount) {
    return { lead: words.join(' '), rest: '' }
  }

  return {
    lead: words.slice(0, takeCount).join(' '),
    rest: words.slice(takeCount).join(' ')
  }
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/encomienda.css"></style>
