<template>
  <div class="cb-page cb-casillas-page" :style="themeStyles" :class="{ 'cb-page--ready': !isBootLoading }">
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

    <main v-if="!isBootLoading" class="cb-page__content cb-casillas">
      <section id="casillas-hero" class="cb-casillas-hero" :style="heroStyles">
        <div class="cb-shell cb-casillas-hero__inner">
          <article class="cb-casillas-hero__copy">
            <div v-if="heroSettings.badge" class="cb-casillas-hero__badge">
              <span class="cb-casillas-hero__badge-dot"></span>
              {{ heroSettings.badge }}
            </div>

            <h1>
              <span v-if="heroTitleRows[0]">
                <strong v-if="heroTitleRows[0].white">{{ heroTitleRows[0].white }}</strong>
                <em v-if="heroTitleRows[0].yellow">{{ heroTitleRows[0].yellow }}</em>
              </span>
              <span v-if="heroTitleRows[1]">
                <em v-if="heroTitleRows[1].yellow">{{ heroTitleRows[1].yellow }}</em>
                <strong v-if="heroTitleRows[1].white">{{ heroTitleRows[1].white }}</strong>
              </span>
            </h1>

            <p v-if="heroSettings.highlight_text" class="cb-casillas-hero__highlight">{{ heroSettings.highlight_text }}</p>
            <p v-if="heroSettings.subtitle" class="cb-casillas-hero__subtitle">{{ heroSettings.subtitle }}</p>

            <div class="cb-casillas-hero__actions">
              <component
                v-if="heroSettings.primary_button_label && heroSettings.primary_button_url"
                :is="isInternalRoute(heroSettings.primary_button_url) ? 'nuxt-link' : 'a'"
                class="cb-casillas-btn cb-casillas-btn--primary"
                v-bind="linkAttrs(heroSettings.primary_button_url)"
              >
                {{ heroSettings.primary_button_label }}
                <span aria-hidden="true">&rsaquo;</span>
              </component>

              <component
                v-if="heroSettings.secondary_button_label && heroSettings.secondary_button_url"
                :is="isInternalRoute(heroSettings.secondary_button_url) ? 'nuxt-link' : 'a'"
                class="cb-casillas-btn cb-casillas-btn--ghost"
                v-bind="linkAttrs(heroSettings.secondary_button_url)"
              >
                {{ heroSettings.secondary_button_label }}
              </component>
            </div>
          </article>
        </div>
        <div class="cb-casillas-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 110" preserveAspectRatio="none" role="presentation">
            <path
              d="M0,54
                 C110,42 235,42 360,48
                 C495,55 615,62 720,58
                 C840,53 955,42 1090,44
                 C1225,46 1335,51 1440,41
                 L1440,110
                 L0,110
                 Z"
            />
          </svg>
        </div>
      </section>

      <section id="casillas-intro" class="cb-casillas-intro">
        <div class="cb-shell cb-casillas-intro__inner">
          <div class="cb-casillas-heading cb-casillas-heading--center">
            <div class="cb-casillas-heading__eyebrow" v-if="introSettings.eyebrow">
              <span></span>
              <small>{{ introSettings.eyebrow }}</small>
              <span></span>
            </div>
            <h2 v-if="introSettings.title">{{ introSettings.title }}</h2>
            <p v-if="introSettings.paragraph_one" class="cb-casillas-intro__lead">{{ introSettings.paragraph_one }}</p>
            <p v-if="introSettings.paragraph_two" class="cb-casillas-intro__copy">{{ introSettings.paragraph_two }}</p>
          </div>

          <div v-if="introStats.length" class="cb-casillas-intro__stats">
            <article v-for="(item, index) in introStats" :key="item.id || item.label || index" class="cb-casillas-intro__stat">
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </article>
          </div>
        </div>
      </section>

      <section id="casillas-benefits" class="cb-casillas-benefits">
        <div class="cb-shell">
          <div class="cb-casillas-heading cb-casillas-heading--center">
            <div class="cb-casillas-heading__accent"></div>
            <h2 v-if="benefitsSettings.title">{{ benefitsSettings.title }}</h2>
            <p v-if="benefitsSettings.subtitle">{{ benefitsSettings.subtitle }}</p>
          </div>

          <div class="cb-casillas-benefits__grid">
            <article v-for="(item, index) in benefitItems" :key="item.id || item.title || index" class="cb-casillas-benefits__card">
              <div class="cb-casillas-benefits__icon" v-html="resolveIcon(item.icon || 'spark')"></div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="casillas-sizes" class="cb-casillas-sizes">
        <div class="cb-shell cb-casillas-sizes__grid">
          <article class="cb-casillas-sizes__copy">
            <div class="cb-casillas-heading">
              <div class="cb-casillas-heading__accent"></div>
              <h2 v-if="sizesSettings.title">{{ sizesSettings.title }}</h2>
              <p v-if="sizesSettings.subtitle">{{ sizesSettings.subtitle }}</p>
            </div>

            <div class="cb-casillas-sizes__list">
              <button
                v-for="(item, index) in sizeItems"
                :key="item.id || item.title || index"
                type="button"
                class="cb-casillas-size-card"
                :class="{ 'is-active': index === selectedSizeIndex }"
                @click="selectSize(index)"
              >
                <span class="cb-casillas-size-card__icon" v-html="resolveIcon(item.icon || 'mailbox')"></span>
                <span class="cb-casillas-size-card__body">
                  <span class="cb-casillas-size-card__head">
                    <strong>{{ item.title }}</strong>
                    <small v-if="item.badge">{{ item.badge }}</small>
                  </span>
                  <span class="cb-casillas-size-card__text">{{ item.text }}</span>
                </span>
                <span class="cb-casillas-size-card__meta">{{ item.dimensions }}</span>
              </button>
            </div>

            <div class="cb-casillas-sizes__plans">
              <span v-if="sizesSettings.plan_label" class="cb-casillas-sizes__plans-label">{{ sizesSettings.plan_label }}</span>

              <button
                v-if="sizesSettings.quarterly_label"
                type="button"
                class="cb-casillas-pill"
                :class="{ 'is-active': selectedPlan === 'quarterly' }"
                @click="selectPlan('quarterly')"
              >
                {{ sizesSettings.quarterly_label }}
              </button>

              <button
                v-if="sizesSettings.semiannual_label"
                type="button"
                class="cb-casillas-pill"
                :class="{ 'is-active': selectedPlan === 'semiannual' }"
                @click="selectPlan('semiannual')"
              >
                {{ sizesSettings.semiannual_label }}
              </button>

              <button
                v-if="sizesSettings.annual_label"
                type="button"
                class="cb-casillas-pill"
                :class="{ 'is-active': selectedPlan === 'annual' }"
                @click="selectPlan('annual')"
              >
                <span v-if="sizesSettings.annual_badge" class="cb-casillas-pill__badge">{{ sizesSettings.annual_badge }}</span>
                {{ sizesSettings.annual_label }}
              </button>
            </div>
          </article>

          <article class="cb-casillas-panel">
            <p v-if="sizesSettings.panel_title" class="cb-casillas-panel__eyebrow">{{ sizesSettings.panel_title }}</p>

            <div class="cb-casillas-panel__grid">
              <button
                v-for="(item, index) in sizeItems"
                :key="`panel-${item.id || item.title || index}`"
                type="button"
                class="cb-casillas-panel__locker"
                :class="{ 'is-active': index === selectedSizeIndex }"
                @click="selectSize(index)"
              >
                <span v-if="index === selectedSizeIndex" class="cb-casillas-panel__selected">Seleccionada</span>
                <span class="cb-casillas-panel__locker-box">
                  <span class="cb-casillas-panel__locker-lines"></span>
                  <span class="cb-casillas-panel__locker-icon" v-html="resolveIcon(item.icon || 'mailbox')"></span>
                </span>
                <strong>{{ item.title }}</strong>
                <small>{{ item.category }}</small>
              </button>
            </div>

            <div v-if="activeSizeItem" class="cb-casillas-panel__detail">
              <p class="cb-casillas-panel__detail-label">{{ activeSizeItem.title }}</p>
              <strong>{{ activeSizeItem.dimensions }}</strong>
              <p>{{ activeSizeItem.text }}</p>
            </div>
          </article>
        </div>
      </section>

      <section id="casillas-requirements" class="cb-casillas-requirements">
        <div class="cb-shell">
          <div class="cb-casillas-heading cb-casillas-heading--center cb-casillas-heading--light">
            <h2 v-if="requirementsSettings.title">{{ requirementsSettings.title }}</h2>
            <p v-if="requirementsSettings.subtitle">{{ requirementsSettings.subtitle }}</p>
          </div>

          <div class="cb-casillas-requirements__grid">
            <article v-for="(item, index) in requirementItems" :key="item.id || item.title || index" class="cb-casillas-requirements__card">
              <div class="cb-casillas-requirements__head">
                <div class="cb-casillas-requirements__icon" v-html="resolveIcon(item.icon || 'person')"></div>
                <h3>{{ item.title }}</h3>
              </div>

              <ul class="cb-casillas-requirements__list">
                <li v-for="line in buildRequirementLines(item)" :key="line">{{ line }}</li>
              </ul>
            </article>
          </div>

          <div v-if="requirementsSettings.banner_title || requirementsSettings.banner_text" class="cb-casillas-requirements__banner">
            <div class="cb-casillas-requirements__banner-icon" v-html="icons.key"></div>
            <div class="cb-casillas-requirements__banner-copy">
              <h3 v-if="requirementsSettings.banner_title">{{ requirementsSettings.banner_title }}</h3>
              <p v-if="requirementsSettings.banner_text">{{ requirementsSettings.banner_text }}</p>
            </div>
            <component
              v-if="requirementsSettings.banner_button_label && requirementsSettings.banner_button_url"
              :is="isInternalRoute(requirementsSettings.banner_button_url) ? 'nuxt-link' : 'a'"
              class="cb-casillas-btn cb-casillas-btn--banner"
              v-bind="linkAttrs(requirementsSettings.banner_button_url)"
            >
              {{ requirementsSettings.banner_button_label }}
              <span aria-hidden="true">&rarr;</span>
            </component>
          </div>
        </div>
      </section>
    </main>

    <HomeFooter v-if="!isBootLoading" :logo-url="logoUrl" :icons="icons" :content="footerSettings" :links="footerLinks" />
  </div>
</template>

<script>
import { sanitizeContentTree } from '~/utils/contentSecurity'

const CASILLAS_SOURCE_PAGE = {
  meta_title: '',
  meta_description: '',
  theme: { logo_url: '', primary_color: '#0d47b5', secondary_color: '#2a4268', accent_color: '#ffcc18' },
  sections: [
    { key: 'header', settings: {}, items: [] },
    { key: 'casillas_hero', settings: { badge: '', title_line_one_white: '', title_line_one_yellow: '', title_line_two_white: '', highlight_text: '', subtitle: '', primary_button_label: '', primary_button_url: '', secondary_button_label: '', secondary_button_url: '', background_image: '' }, items: [] },
    { key: 'casillas_intro', settings: { eyebrow: '', title: '', paragraph_one: '', paragraph_two: '' }, items: [] },
    { key: 'casillas_benefits', settings: { title: '', subtitle: '' }, items: [] },
    { key: 'casillas_sizes', settings: { title: '', subtitle: '', plan_label: '', quarterly_label: '', semiannual_label: '', annual_label: '', annual_badge: '', panel_title: '' }, items: [] },
    { key: 'casillas_requirements', settings: { title: '', subtitle: '', banner_title: '', banner_text: '', banner_button_label: '', banner_button_url: '' }, items: [] },
    { key: 'footer', settings: {}, items: [] }
  ]
}

export default {
  name: 'CasillasPage',
  async asyncData({ $api }) {
    const payload = await fetchPage($api)
    return { pageContent: normalizePage(payload || CASILLAS_SOURCE_PAGE, CASILLAS_SOURCE_PAGE) }
  },
  data() {
    return {
      isBootLoading: true,
      selectedSizeIndex: 1,
      selectedPlan: 'annual'
    }
  },
  async mounted() {
    await this.refreshPageContent()
  },
  computed: {
    resolvedPageContent() {
      return this.pageContent || CASILLAS_SOURCE_PAGE
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
      const image = this.heroSettings.background_image
      return image ? { '--cb-hero-image': `url(${image})` } : {}
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
      return this.getSectionSettings('casillas_hero')
    },
    heroTitleRows() {
      const firstLine = splitLastWord(this.heroSettings.title_line_one_white)
      const secondLine = {
        yellow: String(this.heroSettings.title_line_one_yellow || '').trim(),
        white: String(this.heroSettings.title_line_two_white || '').trim()
      }

      return [
        firstLine.white || firstLine.yellow ? firstLine : null,
        secondLine.white || secondLine.yellow ? secondLine : null
      ].filter(Boolean)
    },
    introSettings() {
      return this.getSectionSettings('casillas_intro')
    },
    benefitsSettings() {
      return this.getSectionSettings('casillas_benefits')
    },
    sizesSettings() {
      return this.getSectionSettings('casillas_sizes')
    },
    requirementsSettings() {
      return this.getSectionSettings('casillas_requirements')
    },
    introStats() {
      return this.getSectionItems('casillas_intro')
    },
    benefitItems() {
      return this.getSectionItems('casillas_benefits')
    },
    sizeItems() {
      return this.getSectionItems('casillas_sizes')
    },
    requirementItems() {
      return this.getSectionItems('casillas_requirements')
    },
    activeSizeItem() {
      if (!this.sizeItems.length) {
        return null
      }
      return this.sizeItems[this.selectedSizeIndex] || this.sizeItems[0]
    }
  },
  watch: {
    sizeItems: {
      immediate: true,
      handler(items) {
        if (!Array.isArray(items) || !items.length) {
          this.selectedSizeIndex = 0
          return
        }
        if (this.selectedSizeIndex > items.length - 1) {
          this.selectedSizeIndex = 0
        }
      }
    }
  },
  methods: {
    async refreshPageContent() {
      const startedAt = Date.now()

      try {
        const payload = await fetchPage(this.$api)

        if (payload) {
          this.pageContent = normalizePage(payload, CASILLAS_SOURCE_PAGE)
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
    selectSize(index) {
      this.selectedSizeIndex = index
    },
    selectPlan(plan) {
      this.selectedPlan = plan
    },
    buildRequirementLines(item) {
      return [
        item.row_one,
        item.row_two,
        item.row_three,
        item.row_four,
        item.row_five
      ].filter(Boolean)
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
  const endpoints = ['/frontapi/api/site/pages/casillas', '/api/site/pages/casillas']
  for (const endpoint of endpoints) {
    const payload = await safeGet($api, endpoint)
    if (payload) {
      return payload
    }
  }
  return null
}

function normalizePage(payload = {}, base = CASILLAS_SOURCE_PAGE) {
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

function splitLastWord(value) {
  const text = String(value || '').trim()
  if (!text) {
    return { white: '', yellow: '' }
  }

  const words = text.split(/\s+/).filter(Boolean)
  if (words.length === 1) {
    return { white: words[0], yellow: '' }
  }

  return {
    white: words.slice(0, -1).join(' '),
    yellow: words[words.length - 1]
  }
}

function buildIcons() {
  return {
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-2 7 4 1-6 12 2-8-4-1 6-11Z"></path></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 1 1 8 0v3"></path></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4"></path><path d="M8 3v4"></path><path d="M3 10h18"></path><path d="m8 15 2 2 5-5"></path></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
    accessibility: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.8"></circle><path d="M7 8h10"></path><path d="M12 8v5"></path><path d="m9 21 3-6 3 6"></path><path d="m8 12 4 2 4-2"></path></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"></path><path d="M12 17h.01"></path></svg>',
    login: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="20" y1="20" x2="16.65" y2="16.65"></line></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
    package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 8 4.5v11L12 22 4 17.5v-11L12 2Z"></path><path d="M12 22V11"></path><path d="m20 6.5-8 4.5-8-4.5"></path><path d="m8 4.2 8 4.6"></path></svg>',
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M3 12h18"></path></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M5 21V7l7-4v18"></path><path d="M19 21V11l-7-4"></path><path d="M9 9h.01"></path><path d="M9 13h.01"></path><path d="M9 17h.01"></path><path d="M15 13h.01"></path><path d="M15 17h.01"></path></svg>',
    mailbox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19V9a5 5 0 0 1 10 0v10"></path><path d="M7 13h10"></path><path d="M12 19v-3"></path><path d="M9 22h6"></path></svg>',
    person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21a8 8 0 0 0-16 0"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    office: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M7 21V8l5-3 5 3v13"></path><path d="M9 12h.01"></path><path d="M15 12h.01"></path><path d="M12 21v-4"></path></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="4.5"></circle><path d="m12 12 8-8"></path><path d="M17 5h3v3"></path><path d="M15 7h3"></path></svg>'
  }
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/casillas.css"></style>
