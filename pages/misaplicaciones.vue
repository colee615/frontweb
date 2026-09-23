<template>
  <div
    class="cb-page cb-apps-page"
    :style="pageStyles"
    :class="{ 'cb-page--ready': !isBootLoading, 'is-page-leaving': isPageLeaving }"
  >
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

    <HomeHeader v-if="!isBootLoading && hasCmsContent" :logo-url="logoUrl" :icons="icons" :content="headerSettings" :links="headerLinks" />

    <main v-if="!isBootLoading && hasCmsContent" class="cb-page__content cb-apps-content">
      <section class="cb-apps-hero" :style="heroStyles">
        <div class="cb-shell cb-apps-hero__inner">
          <div class="cb-apps-hero__copy">
            <p v-if="applicationSettings.hero_eyebrow" class="cb-apps-eyebrow">{{ applicationSettings.hero_eyebrow }}</p>
            <h1 v-if="applicationSettings.hero_title || applicationSettings.hero_title_accent">
              {{ applicationSettings.hero_title }}<span v-if="applicationSettings.hero_title_accent"> {{ applicationSettings.hero_title_accent }}</span>
            </h1>
            <p v-if="applicationSettings.hero_text" class="cb-apps-hero__lead">{{ applicationSettings.hero_text }}</p>

          </div>

          <aside v-if="highlightItems.length" class="cb-apps-hero__panel" aria-label="Beneficios de nuestros servicios digitales">
            <div class="cb-apps-hero__panel-head">
              <span class="cb-apps-hero__panel-icon" v-html="icons.grid" aria-hidden="true"></span>
              <div>
                <small>PORTAL DE SERVICIOS</small>
                <strong>{{ applicationItems.length }} herramientas disponibles</strong>
              </div>
            </div>
            <div class="cb-apps-hero__highlights">
              <div v-for="highlight in highlightItems" :key="highlight.id || highlight.title" class="cb-apps-highlight">
                <span class="cb-apps-highlight__icon" v-html="icons[highlight.icon]"></span>
                <span>{{ highlight.title }}</span>
              </div>
            </div>
          </aside>
        </div>

        <svg class="cb-apps-hero__waves" viewBox="0 0 1600 150" preserveAspectRatio="none" aria-hidden="true">
          <path class="cb-apps-hero__wave cb-apps-hero__wave--back" d="M0 70C220 12 390 18 590 68c210 53 382 64 580 12 176-47 286-40 430 8v62H0Z" />
          <path class="cb-apps-hero__wave cb-apps-hero__wave--middle" d="M0 96c207-48 380-39 555 5 202 51 370 51 570 3 190-46 319-36 475 9v37H0Z" />
          <path class="cb-apps-hero__wave cb-apps-hero__wave--front" d="M0 118c190-32 359-28 527 7 214 45 404 43 603 1 174-37 318-31 470 6v18H0Z" />
          <path class="cb-apps-hero__wave-line" d="M0 118c190-32 359-28 527 7 214 45 404 43 603 1 174-37 318-31 470 6" />
        </svg>

        <div
          class="cb-apps-edge-mascot"
          role="img"
          aria-label="Personaje de Correos de Bolivia colgado del borde y sosteniendo un cartel de Mis Aplicaciones"
        >
          <div class="cb-apps-edge-mascot__swing">
            <img
              class="cb-apps-edge-mascot__art cb-apps-edge-mascot__art--base"
              src="/misaplicaciones.png"
              width="1536"
              height="1024"
              alt=""
            >
          </div>
        </div>
      </section>

      <section class="cb-apps-catalog" aria-labelledby="apps-catalog-title">
        <div class="cb-shell">
          <div class="cb-apps-section-heading">
            <div>
              <p v-if="applicationSettings.catalog_eyebrow" class="cb-apps-section-heading__eyebrow">{{ applicationSettings.catalog_eyebrow }}</p>
              <h2 v-if="applicationSettings.catalog_title" id="apps-catalog-title">{{ applicationSettings.catalog_title }}</h2>
            </div>
            <span class="cb-apps-result-count" role="status">{{ filteredApplications.length }} {{ filteredApplications.length === 1 ? 'servicio disponible' : 'servicios disponibles' }}</span>
          </div>

          <div class="cb-apps-toolbar">
            <label class="cb-apps-search">
              <span v-html="icons.search" aria-hidden="true"></span>
              <input v-model.trim="searchTerm" type="search" :placeholder="applicationSettings.search_placeholder" aria-label="Buscar aplicaciones o sistemas">
            </label>

            <div class="cb-apps-filters" role="tablist" aria-label="Filtrar aplicaciones">
              <button
                v-for="category in categories"
                :key="category"
                type="button"
                :class="['cb-apps-filter', { 'is-active': activeCategory === category }]"
                role="tab"
                :aria-selected="activeCategory === category ? 'true' : 'false'"
                @click="activeCategory = category"
              >
                {{ category }}
              </button>
            </div>
          </div>

          <div v-if="filteredApplications.length" class="cb-apps-grid">
            <article
              v-for="(application, index) in filteredApplications"
              :key="application.id"
              :class="['cb-app-card', { 'is-navigating': navigatingApplicationId === application.id }]"
              :style="{ '--app-color': application.color }"
              @click="handleApplicationCardClick($event, application)"
            >
              <div class="cb-app-card__head">
                <div class="cb-app-card__identity">
                  <span class="cb-app-card__icon" v-html="icons[application.icon]" aria-hidden="true"></span>
                  <div>
                    <span :class="['cb-app-card__type', `cb-app-card__type--${application.resourceType}`]">{{ application.type }}</span>
                    <h3>{{ application.name }}</h3>
                  </div>
                </div>
                <span class="cb-app-card__index">{{ application.category }}</span>
              </div>

              <div :class="['cb-app-preview', `cb-app-preview--${application.preview || 'default'}`, {
                'is-image-loading': application.image && !isApplicationImageReady(application),
                'is-image-ready': isApplicationImageReady(application)
              }]">
                <div class="cb-app-preview__window-bar">
                  <span></span><span></span><span></span>
                  <small>{{ application.previewLabel }}</small>
                </div>
                <div class="cb-app-preview__body">
                  <div class="cb-app-preview__side">
                    <i></i><i></i><i></i><i></i>
                  </div>
                  <div class="cb-app-preview__screen">
                    <strong>{{ application.previewTitle }}</strong>
                    <div class="cb-app-preview__blocks">
                      <span></span><span></span><span></span>
                    </div>
                    <div class="cb-app-preview__line"></div>
                  </div>
                </div>
                <img
                  v-if="application.image && !failedApplicationImages[application.id]"
                  class="cb-app-preview__image"
                  :data-application-id="application.id"
                  :src="application.image"
                  :alt="`Vista previa de ${application.name}`"
                  @load="handleApplicationImageLoad(application.id)"
                  @error="handleApplicationImageError(application.id)"
                >
                <div v-if="application.image && !isApplicationImageReady(application)" class="cb-app-preview__skeleton" aria-hidden="true">
                  <span class="cb-app-preview__skeleton-bar"></span>
                  <span class="cb-app-preview__skeleton-title"></span>
                  <span class="cb-app-preview__skeleton-line"></span>
                  <span class="cb-app-preview__skeleton-line cb-app-preview__skeleton-line--short"></span>
                </div>
              </div>

              <p class="cb-app-card__description">{{ application.description }}</p>

              <div class="cb-app-card__footer">
                <span class="cb-app-card__category">{{ String(index + 1).padStart(2, '0') }}</span>
                <template v-if="application.destinationUrl">
                  <nuxt-link v-if="!application.shouldDownload && isInternalRoute(application.destinationUrl)" class="cb-app-card__action" :to="application.destinationUrl" @click.native.prevent="navigateApplication($event, application)">
                    {{ application.action }}
                    <span v-html="icons.arrow" aria-hidden="true"></span>
                  </nuxt-link>
                  <a
                    v-else
                    class="cb-app-card__action"
                    :href="application.destinationUrl"
                    :download="application.shouldDownload ? (application.downloadName || 'aplicacion') : null"
                    @click.prevent="navigateApplication($event, application)"
                  >
                    {{ application.action }}
                    <span v-html="icons.arrow" aria-hidden="true"></span>
                  </a>
                </template>
                <span v-else-if="application.action" class="cb-app-card__action cb-app-card__action--disabled">{{ application.action }}</span>
              </div>
            </article>
          </div>

          <div v-else class="cb-apps-empty">
            <span class="cb-apps-empty__icon" v-html="icons.search"></span>
            <h3>No encontramos resultados</h3>
            <p>Prueba con otro término o limpia los filtros.</p>
            <button type="button" @click="clearFilters">Limpiar filtros</button>
          </div>

          <section class="cb-apps-contact-card">
            <div class="cb-apps-contact-card__icon" v-html="icons.shield" aria-hidden="true"></div>
            <div>
              <p v-if="applicationSettings.support_eyebrow" class="cb-apps-section-heading__eyebrow">{{ applicationSettings.support_eyebrow }}</p>
              <h2 v-if="applicationSettings.support_title">{{ applicationSettings.support_title }}</h2>
              <p v-if="applicationSettings.support_text">{{ applicationSettings.support_text }}</p>
            </div>
            <nuxt-link v-if="applicationSettings.support_button_url && isInternalRoute(applicationSettings.support_button_url)" :to="applicationSettings.support_button_url" class="cb-apps-contact-card__button">
              {{ applicationSettings.support_button_label }} <span v-html="icons.arrow"></span>
            </nuxt-link>
            <a v-else-if="applicationSettings.support_button_url" class="cb-apps-contact-card__button" :href="applicationSettings.support_button_url" target="_blank" rel="noopener noreferrer">
              {{ applicationSettings.support_button_label }} <span v-html="icons.arrow"></span>
            </a>
          </section>
        </div>
      </section>
    </main>

    <div v-else-if="!isBootLoading && cmsError" class="cb-apps-cms-error" role="alert">
      <h1>No se pudo cargar esta página</h1>
      <p>El contenido de Aplicaciones y Sistemas debe estar disponible desde el backend.</p>
      <button type="button" @click="reloadCmsContent">Reintentar</button>
    </div>

    <HomeFooter v-if="!isBootLoading && hasCmsContent" :logo-url="logoUrl" :icons="icons" :content="footerSettings" :links="footerLinks" />
  </div>
</template>

<script>
import { sanitizeContentTree } from '~/utils/contentSecurity'
import { fetchPageWithSharedLayout } from '~/utils/sharedLayout'

const SHARED_LAYOUT_PAGE = {
  theme: { logo_url: '', primary_color: '#20539a', secondary_color: '#2f3f5c', accent_color: '#fecc36' },
  sections: [
    { key: 'header', settings: { help_label: '', search_placeholder: '', language_primary: '', language_secondary: '' }, items: [] },
    { key: 'applications', settings: { hero_eyebrow: '', hero_title: '', hero_title_accent: '', hero_text: '', catalog_eyebrow: '', catalog_title: '', search_placeholder: '', support_eyebrow: '', support_title: '', support_text: '', support_button_label: '', support_button_url: '', background_image: '' }, items: [] },
    { key: 'applications_highlights', settings: {}, items: [] },
    { key: 'footer', settings: { help_title: '', company_title: '', contact_title: '', social_title: '', social_text: '', address: '', phone: '', email: '', copyright: '', legal_text: '' }, items: [] }
  ]
}

function normalizeResourceType(value) {
  return String(value || '').toLowerCase() === 'app' ? 'app' : 'web'
}

function normalizeDestinationUrl(value) {
  const normalized = typeof value === 'string' ? value.trim() : ''
  return normalized === '#' ? '' : normalized
}

export default {
  name: 'MisAplicacionesPage',
  transition: {
    name: 'cb-apps-route',
    mode: 'out-in'
  },
  data() {
    return {
      isBootLoading: true,
      pageContent: SHARED_LAYOUT_PAGE,
      cmsError: false,
      searchTerm: '',
      activeCategory: 'Todos',
      failedApplicationImages: {},
      loadedApplicationImages: {},
      navigatingApplicationId: null,
      isPageLeaving: false,
      transitionOrigin: '50% 50%',
      pageTransitionTimer: null
    }
  },
  async asyncData({ $api }) {
    const payload = await fetchPage($api)

    return {
      pageContent: normalizePage(payload || SHARED_LAYOUT_PAGE, SHARED_LAYOUT_PAGE),
      cmsError: !payload
    }
  },
  async mounted() {
    this.resetPageTransition()
    window.addEventListener('pageshow', this.resetPageTransition)
    const startedAt = Date.now()

    try {
      const payload = await fetchPage(this.$api)

      if (payload) {
        this.pageContent = normalizePage(payload, SHARED_LAYOUT_PAGE)
        this.cmsError = false
      } else {
        this.cmsError = !this.hasCmsContent
      }
    } finally {
      const minimumRevealDelay = 450
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, minimumRevealDelay - elapsed)

      window.setTimeout(() => {
        this.isBootLoading = false
        this.syncLoadedApplicationImages()
      }, remaining)
    }
  },
  activated() {
    this.resetPageTransition()
  },
  beforeDestroy() {
    window.removeEventListener('pageshow', this.resetPageTransition)
    this.resetPageTransition()
  },
  watch: {
    $route() {
      this.resetPageTransition()
    }
  },
  computed: {
    hasCmsContent() {
      return Boolean(this.pageContent && this.pageContent.id)
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
    applicationSettings() {
      return this.getSectionSettings('applications')
    },
    categories() {
      const backendCategories = this.applicationItems
        .map((application) => application.category)
        .filter(Boolean)

      return ['Todos', ...new Set(backendCategories)]
    },
    applicationItems() {
      const items = this.getSectionItems('applications')

      return items.map((item) => {
        const resourceType = normalizeResourceType(item.resource_type)
        const playStoreUrl = normalizeDestinationUrl(item.play_store_url)
        const downloadUrl = normalizeDestinationUrl(item.download_url)
        const websiteUrl = normalizeDestinationUrl(item.url)
        const destinationUrl = resourceType === 'app'
          ? (playStoreUrl || downloadUrl || websiteUrl)
          : websiteUrl
        const shouldDownload = resourceType === 'app' && !playStoreUrl && Boolean(downloadUrl)
        const action = resourceType === 'app'
          ? (playStoreUrl ? 'Ver en Play Store' : (downloadUrl ? 'Descargar aplicación' : (item.action || 'No disponible')))
          : (item.action || 'Visitar sitio')

        return {
          ...item,
          name: item.name || item.title || '',
          type: resourceType === 'app' ? 'Aplicativo' : 'Sitio web',
          resourceType,
          category: item.category || '',
          icon: item.icon || '',
          preview: item.preview || '',
          previewLabel: item.previewLabel || item.preview_label || item.name || '',
          previewTitle: item.previewTitle || item.preview_title || item.name || '',
          color: item.color || '',
          action,
          websiteUrl,
          playStoreUrl,
          downloadUrl,
          downloadName: item.download_name || '',
          destinationUrl,
          shouldDownload,
          image: item.image || ''
        }
      })
    },
    highlightItems() {
      return this.getSectionItems('applications_highlights')
    },
    heroStyles() {
      const backgroundImage = this.applicationSettings.background_image

      return backgroundImage
        ? { backgroundImage: `url("${backgroundImage}")` }
        : {}
    },
    themeStyles() {
      const theme = this.pageContent.theme || {}

      return {
        '--cb-blue': theme.primary_color || '#20539a',
        '--cb-yellow': theme.accent_color || '#fecc36',
        '--cb-ink': theme.secondary_color || '#2f3f5c'
      }
    },
    pageTransitionStyle() {
      return { '--cb-transition-origin': this.transitionOrigin }
    },
    pageStyles() {
      return {
        ...this.themeStyles,
        ...this.pageTransitionStyle
      }
    },
    filteredApplications() {
      const query = this.searchTerm.toLowerCase().trim()

      return this.applicationItems.filter((application) => {
        const matchesCategory = this.activeCategory === 'Todos' || application.category === this.activeCategory
        const searchableText = `${application.name} ${application.type} ${application.category} ${application.description}`.toLowerCase()
        return matchesCategory && (!query || searchableText.includes(query))
      })
    },
    icons() {
      return buildIcons()
    }
  },
  methods: {
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
    clearFilters() {
      this.searchTerm = ''
      this.activeCategory = 'Todos'
    },
    handleApplicationImageError(applicationId) {
      this.$set(this.failedApplicationImages, applicationId, true)
    },
    handleApplicationImageLoad(applicationId) {
      this.$set(this.loadedApplicationImages, applicationId, true)
    },
    syncLoadedApplicationImages() {
      this.$nextTick(() => {
        if (!this.$el || typeof this.$el.querySelectorAll !== 'function') {
          return
        }

        this.$el.querySelectorAll('.cb-app-preview__image').forEach((image) => {
          if (image.complete && image.naturalWidth > 0) {
            this.handleApplicationImageLoad(image.dataset.applicationId)
          }
        })
      })
    },
    isApplicationImageReady(application) {
      return !application.image || Boolean(this.loadedApplicationImages[application.id] || this.failedApplicationImages[application.id])
    },
    resetPageTransition() {
      if (this.pageTransitionTimer && typeof window !== 'undefined') {
        window.clearTimeout(this.pageTransitionTimer)
      }

      this.pageTransitionTimer = null
      this.isPageLeaving = false
      this.navigatingApplicationId = null
    },
    beginApplicationNavigation(applicationId) {
      this.navigatingApplicationId = applicationId
    },
    handleApplicationCardClick(event, application) {
      if (event.target.closest('a, button, input, select, textarea') || !application.destinationUrl) {
        return
      }

      this.navigateApplication(event, application)
    },
    navigateApplication(event, application) {
      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault()
      }

      if (this.isPageLeaving) {
        return
      }

      if (application.shouldDownload) {
        const downloadLink = document.createElement('a')
        downloadLink.href = application.destinationUrl
        downloadLink.download = application.downloadName || 'aplicacion'
        downloadLink.hidden = true
        document.body.appendChild(downloadLink)
        downloadLink.click()
        downloadLink.remove()
        return
      }

      const clientX = event && Number.isFinite(event.clientX) ? `${event.clientX}px` : '50%'
      const clientY = event && Number.isFinite(event.clientY) ? `${event.clientY}px` : '50%'

      this.transitionOrigin = `${clientX} ${clientY}`
      this.beginApplicationNavigation(application.id)
      this.isPageLeaving = true

      this.pageTransitionTimer = window.setTimeout(() => {
        this.resetPageTransition()
      }, 1100)

      window.setTimeout(() => {
        if (!application.shouldDownload && this.isInternalRoute(application.destinationUrl)) {
          this.$router.push(application.destinationUrl)
          return
        }

        window.location.assign(application.destinationUrl)
      }, 520)
    },
    async reloadCmsContent() {
      this.isBootLoading = true
      this.cmsError = false
      this.failedApplicationImages = {}
      this.loadedApplicationImages = {}

      const payload = await fetchPage(this.$api)

      if (payload) {
        this.pageContent = normalizePage(payload, SHARED_LAYOUT_PAGE)
        this.cmsError = false
      } else {
        this.cmsError = true
      }

      this.isBootLoading = false
      this.syncLoadedApplicationImages()
    },
    isInternalRoute(url) {
      return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//')
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

async function fetchPage($api) {
  const endpoints = ['/frontapi/api/site/pages/misaplicaciones', '/api/site/pages/misaplicaciones']
  return fetchPageWithSharedLayout($api, endpoints)
}

function normalizePage(payload = {}, base = SHARED_LAYOUT_PAGE) {
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
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13"></path><path d="m13 6 6 6-6 6"></path></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
    package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 8 4.5v11L12 22 4 17.5v-11L12 2Z"></path><path d="M12 22V11"></path><path d="m20 6.5-8 4.5-8-4.5"></path></svg>',
    document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h8l4 4v14H7z"></path><path d="M15 3v5h4"></path><path d="M10 13h6M10 17h6"></path></svg>',
    stamp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v16H7z"></path><path d="M5 7h2M5 12h2M5 17h2M17 7h2M17 12h2M17 17h2"></path><path d="M9 8h6v8H9z"></path></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"></circle><circle cx="17" cy="9" r="2.3"></circle><path d="M3.5 19a5.5 5.5 0 0 1 11 0M15 15a4.5 4.5 0 0 1 5.5 4"></path></svg>',
    receipt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"></path><path d="M9 8h6M9 12h6M9 16h3"></path></svg>',
    plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"></path><path d="M22 2 15 22l-4-9-9-4 20-7Z"></path></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V5l8-3 8 3v16M2 21h20M8 8h1M12 8h1M16 8h1M8 12h1M12 12h1M16 12h1M9 21v-5h6v5"></path></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z"></path><path d="m8.5 12 2.2 2.2 4.8-5"></path></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-2 7 4 1-6 12 2-8-4-1 6-11Z"></path></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"></path><path d="M12 17h.01"></path></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
    'phone-call': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.3a2 2 0 0 1 2.11-.45c.85.3 1.74.52 2.64.64A2 2 0 0 1 22 16.92z"></path></svg>'
  }
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/misaplicaciones.css"></style>
