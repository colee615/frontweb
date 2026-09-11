<template>
  <div class="cb-page cb-news-page" :style="themeStyles" :class="{ 'cb-page--ready': !isBootLoading }">
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

    <div v-if="isBootLoading" class="cb-home-skeleton cb-news-skeleton" aria-hidden="true">
      <section class="cb-home-skeleton__hero">
        <div class="cb-shell cb-home-skeleton__hero-grid cb-news-skeleton__hero-grid">
          <div class="cb-skeleton-card cb-skeleton-card--hero cb-news-skeleton__hero-card">
            <div class="cb-skeleton cb-skeleton--eyebrow cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--title cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--title cb-skeleton--short cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--medium cb-skeleton--wave" />
          </div>
          <div class="cb-skeleton-card cb-skeleton-card--banner">
            <div class="cb-skeleton cb-skeleton--banner cb-skeleton--wave" />
          </div>
        </div>
      </section>

      <section class="cb-section cb-section--tight">
        <div class="cb-shell cb-home-skeleton__services">
          <div v-for="index in 6" :key="`news-skeleton-${index}`" class="cb-skeleton-card cb-skeleton-card--service">
            <div class="cb-skeleton cb-skeleton--banner cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--meta cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--service-title cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--wave" />
          </div>
        </div>
      </section>
    </div>

    <main v-else class="cb-news">
      <section id="news-featured" class="cb-news-landing cb-news-reveal is-visible" data-news-reveal>
        <div class="cb-shell cb-news-landing__grid">
          <article :id="`news-featured-item-${featuredItem.id || 0}`" class="cb-news-hero-card">
            <template v-if="featuredMediaType === 'video' && featuredMediaUrl">
              <video
                class="cb-news-hero-card__asset"
                :src="featuredMediaUrl"
                :poster="featuredPoster || null"
                autoplay
                muted
                loop
                playsinline
                preload="metadata"
              ></video>
            </template>
            <img
              v-else-if="featuredMediaUrl"
              class="cb-news-hero-card__asset"
              :src="featuredMediaUrl"
              alt=""
            >
            <div class="cb-news-hero-card__veil"></div>
            <div class="cb-news-hero-card__content">
              <span v-if="featuredItem.badge" class="cb-news-featured__badge">{{ featuredItem.badge }}</span>
              <h1>{{ featuredItem.title }}</h1>
              <p v-if="featuredExcerptParagraphs.length">{{ featuredExcerptParagraphs[0] }}</p>
              <nuxt-link :to="articleLink(featuredItem)" class="cb-news-featured__button">
                <span>{{ featuredButtonLabel }}</span>
                <span class="cb-news-inline-icon" v-html="icons.chevronRight"></span>
              </nuxt-link>
            </div>
            <div v-if="featuredItems.length > 1" class="cb-news-hero-card__dots" aria-label="Noticias destacadas">
              <button
                v-for="(item, index) in featuredItems"
                :key="item.id || `${item.title}-${index}`"
                type="button"
                :class="['cb-news-hero-card__dot', { 'is-active': index === activeFeaturedIndex }]"
                :aria-label="`Ver destacado ${index + 1}`"
                @click="selectFeatured(index)"
              ></button>
            </div>
          </article>

          <aside v-if="importantNotices.length" class="cb-news-alerts" aria-label="Avisos importantes">
            <div class="cb-news-alerts__head">
              <div class="cb-news-alerts__title">
                <span class="cb-news-alerts__icon" v-html="icons.megaphone"></span>
                <h2>{{ importantNoticeSettings.title || 'Avisos importantes' }}</h2>
              </div>
              <a v-if="importantNoticeSettings.view_all_url" :href="importantNoticeSettings.view_all_url">
                {{ importantNoticeSettings.view_all_label || 'Ver todos' }}
                <span class="cb-news-inline-icon" v-html="icons.chevronRight"></span>
              </a>
            </div>

            <a
              v-for="(notice, index) in importantNotices"
              :key="notice.id || `${notice.title}-${index}`"
              :href="notice.url || '#'"
              :class="['cb-news-alert', noticeToneClass(notice)]"
            >
              <span class="cb-news-alert__status" v-html="noticeIcon(notice)"></span>
              <span class="cb-news-alert__body">
                <strong>{{ notice.title }}</strong>
                <span>{{ notice.text }}</span>
                <small v-if="notice.date">{{ notice.date }}</small>
              </span>
            </a>
          </aside>
        </div>
      </section>

      <section id="news-filters" class="cb-news-filters cb-news-reveal" data-news-reveal>
        <div class="cb-shell cb-news-filters__inner">
          <div class="cb-news-filters__chips" role="tablist" aria-label="Categorias de noticias">
            <button
              v-for="(category, index) in categories"
              :key="category.id || `${category.label}-${index}`"
              type="button"
              :class="['cb-news-chip', { 'cb-news-chip--active': selectedCategory === category.label }]"
              @click="selectCategory(category.label)"
            >
              {{ category.label }}
            </button>
          </div>

          <label class="cb-news-search">
            <span class="cb-news-inline-icon" v-html="icons.search"></span>
            <input v-model.trim="searchTerm" type="search" :placeholder="categorySettings.search_placeholder || 'Buscar noticias...'">
          </label>
        </div>
      </section>

      <section id="news-grid" class="cb-news-grid-section cb-news-reveal" data-news-reveal>
        <div class="cb-shell">
          <div v-if="gridSettings.title" class="cb-news-grid-section__heading cb-news-reveal" data-news-reveal>
            <h2 v-if="gridSettings.title">{{ gridSettings.title }}</h2>
          </div>

          <transition name="cb-news-page-switch" mode="out-in">
            <div :key="`${selectedCategory}-${searchTerm}-${currentPage}`">
              <div class="cb-news-grid">
                <article
                  v-for="(article, index) in visibleNews"
                  :key="article.id || article.title"
                  :id="`news-item-${article.id || index}`"
                  class="cb-news-card"
                  :style="{ '--cb-news-delay': `${index * 70}ms` }"
                >
                  <div class="cb-news-card__media">
                    <template v-if="resolveMediaType(article) === 'video' && resolveMediaUrl(article)">
                      <video
                        class="cb-news-card__asset"
                        :src="resolveMediaUrl(article)"
                        :poster="article.poster_image || null"
                        autoplay
                        muted
                        loop
                        playsinline
                        preload="metadata"
                      ></video>
                    </template>
                    <img
                      v-else-if="resolveMediaUrl(article)"
                      class="cb-news-card__asset"
                      :src="resolveMediaUrl(article)"
                      alt=""
                    >
                    <div class="cb-news-card__media-veil"></div>
                  </div>
                  <div class="cb-news-card__content">
                    <div class="cb-news-card__meta">
                      <span class="cb-news-card__meta-item"><span class="cb-news-inline-icon" v-html="icons.calendar"></span>{{ article.date }}</span>
                      <span class="cb-news-card__meta-item"><span class="cb-news-inline-icon" v-html="icons.tag"></span>{{ article.category }}</span>
                    </div>
                    <h3>{{ article.title }}</h3>
                    <p>{{ article.excerpt }}</p>
                    <nuxt-link :to="articleLink(article)" class="cb-news-card__link">
                      {{ gridSettings.cta_label || 'Leer mas' }}
                      <span class="cb-news-inline-icon" v-html="icons.chevronRight"></span>
                    </nuxt-link>
                  </div>
                </article>
              </div>

              <p v-if="!visibleNews.length" class="cb-news-grid__empty">No hay noticias que coincidan con tu busqueda.</p>
            </div>
          </transition>

          <div v-if="paginationItems.length" class="cb-news-pagination__pages cb-news-pagination__pages--grid">
            <button
              v-for="(page, index) in paginationItems"
              :key="page.id || `${page.label}-${index}`"
              type="button"
              :class="['cb-news-page-pill', { 'cb-news-page-pill--active': page.is_active, 'cb-news-page-pill--ghost': page.is_ellipsis }]"
              :disabled="page.is_ellipsis"
              @click="goToPage(page)"
            >
              {{ page.label }}
            </button>
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

const NEWS_PAGE = {
  meta_title: 'Noticias | Correos de Bolivia',
  meta_description: 'Noticias, comunicados y novedades institucionales de Correos de Bolivia.',
  theme: { logo_url: '', primary_color: '#20539a', secondary_color: '#2f3f5c', accent_color: '#fecc36' },
  sections: [
    { key: 'featured_story', settings: { button_label: 'Leer noticia completa' }, items: [] },
    { key: 'important_notices', settings: { title: 'Avisos importantes', view_all_label: 'Ver todos', view_all_url: '/noticias' }, items: [] },
    { key: 'category_filters', settings: { search_placeholder: 'Buscar noticias...' }, items: [] },
    { key: 'news_grid', settings: { title: '', subtitle: '', cta_label: 'Leer mas' }, items: [] },
    { key: 'newsletter', settings: { badge: '', title: '', text: '', placeholder: '', button_label: '', legal_text: '' }, items: [] },
    { key: 'pagination', settings: { load_more_label: 'Cargar mas noticias' }, items: [] }
  ]
}

export default {
  name: 'NoticiasPage',
  data() {
    return {
      isBootLoading: true,
      searchTerm: '',
      selectedCategory: 'Todas',
      currentPage: 1,
      pageSize: 3,
      activeFeaturedIndex: 0,
      isFeaturedExpanded: false,
      revealObserver: null
    }
  },
  async asyncData({ $api }) {
    const [homePayload, newsPayload] = await Promise.all([
      fetchHome($api),
      fetchNews($api)
    ])

    return {
      homeContent: normalizePage(homePayload || SHARED_LAYOUT_PAGE, SHARED_LAYOUT_PAGE),
      newsContent: normalizePage(newsPayload || NEWS_PAGE, NEWS_PAGE)
    }
  },
  async mounted() {
    await this.refreshPageContent()
    this.selectedCategory = this.defaultCategory
    this.syncSearchFromRoute()
    this.syncHashTarget()
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
      return this.homeContent.theme.logo_url || this.newsContent.theme.logo_url || ''
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
    featuredSettings() {
      return this.getSectionSettings(this.newsContent, 'featured_story')
    },
    importantNoticeSettings() {
      return this.getSectionSettings(this.newsContent, 'important_notices')
    },
    categorySettings() {
      return this.getSectionSettings(this.newsContent, 'category_filters')
    },
    gridSettings() {
      return this.getSectionSettings(this.newsContent, 'news_grid')
    },
    newsletterSettings() {
      return this.getSectionSettings(this.newsContent, 'newsletter')
    },
    paginationSettings() {
      return this.getSectionSettings(this.newsContent, 'pagination')
    },
    featuredItem() {
      return this.featuredItems[this.activeFeaturedIndex] || this.featuredItems[0] || {}
    },
    featuredItems() {
      return this.getSectionItems(this.newsContent, 'featured_story').filter((item) => item.title)
    },
    featuredButtonLabel() {
      return this.featuredSettings.button_label || 'Leer noticia completa'
    },
    hasFeaturedExcerpt() {
      return Boolean(String(this.featuredItem.excerpt || '').trim())
    },
    featuredExcerptParagraphs() {
      return this.splitExcerptIntoParagraphs(this.featuredItem.excerpt)
    },
    visibleFeaturedExcerptParagraphs() {
      if (this.isFeaturedExpanded) {
        return this.featuredExcerptParagraphs
      }

      return this.featuredExcerptParagraphs.slice(0, 1)
    },
    categories() {
      const items = this.getSectionItems(this.newsContent, 'category_filters').filter((item) => item.label)
      return items.length ? items : [{ label: 'Todas', is_active: true }]
    },
    defaultCategory() {
      const activeItem = this.categories.find((item) => item.is_active)
      return activeItem ? activeItem.label : ((this.categories[0] && this.categories[0].label) || 'Todas')
    },
    newsItems() {
      const configuredItems = this.getSectionItems(this.newsContent, 'news_grid').filter((item) => item.title)
      return configuredItems
    },
    importantNotices() {
      return this.getSectionItems(this.newsContent, 'important_notices').filter((item) => item.title)
    },
    filteredNews() {
      const normalizedQuery = this.searchTerm.trim().toLowerCase()
      return this.newsItems.filter((item) => {
        const matchesCategory = this.selectedCategory === 'Todas' || item.category === this.selectedCategory
        const matchesQuery = !normalizedQuery || [item.title, item.excerpt, item.category, item.date]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery))

        return matchesCategory && matchesQuery
      })
    },
    visibleNews() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredNews.slice(start, start + this.pageSize)
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredNews.length / this.pageSize))
    },
    hasMore() {
      return this.currentPage < this.totalPages
    },
    paginationItems() {
      if (this.totalPages <= 1) {
        return []
      }

      const pages = []
      const addPage = (pageNumber) => {
        pages.push({
          label: String(pageNumber),
          page_number: pageNumber,
          is_active: pageNumber === this.currentPage,
          is_ellipsis: false
        })
      }

      if (this.totalPages <= 5) {
        return Array.from({ length: this.totalPages }, (_, index) => {
          const pageNumber = index + 1

          return {
            label: String(pageNumber),
            page_number: pageNumber,
            is_active: pageNumber === this.currentPage,
            is_ellipsis: false
          }
        })
      }

      addPage(1)

      if (this.currentPage > 3) {
        pages.push({ label: '...', is_ellipsis: true })
      }

      const start = Math.max(2, this.currentPage - 1)
      const end = Math.min(this.totalPages - 1, this.currentPage + 1)

      for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
        addPage(pageNumber)
      }

      if (this.currentPage < this.totalPages - 2) {
        pages.push({ label: '...', is_ellipsis: true })
      }

      addPage(this.totalPages)

      return pages
    },
    featuredMediaType() {
      return normalizeMediaType(this.featuredItem)
    },
    featuredMediaUrl() {
      return this.featuredItem.media_url || this.featuredItem.image || ''
    },
    featuredPoster() {
      return this.featuredItem.poster_image || ''
    },
    themeStyles() {
      const theme = this.homeContent.theme || {}
      const newsTheme = this.newsContent.theme || {}

      return {
        '--cb-blue': newsTheme.primary_color || theme.primary_color || '#20539a',
        '--cb-yellow': newsTheme.accent_color || theme.accent_color || '#fecc36',
        '--cb-ink': newsTheme.secondary_color || theme.secondary_color || '#2f3f5c'
      }
    }
  },
  watch: {
    searchTerm() {
      this.currentPage = 1
    },
    '$route.query.q'() {
      this.syncSearchFromRoute()
    },
    '$route.hash'() {
      this.syncHashTarget()
    }
  },
  methods: {
    async refreshPageContent() {
      const startedAt = Date.now()

      try {
        const [homePayload, newsPayload] = await Promise.all([
          fetchHome(this.$api),
          fetchNews(this.$api)
        ])

        this.homeContent = normalizePage(homePayload || SHARED_LAYOUT_PAGE, SHARED_LAYOUT_PAGE)
        this.newsContent = normalizePage(newsPayload || NEWS_PAGE, NEWS_PAGE)
        this.selectedCategory = this.defaultCategory
        this.currentPage = resolveInitialPage(this.getSectionItems(this.newsContent, 'pagination'))
        this.activeFeaturedIndex = 0
        this.isFeaturedExpanded = false
      } finally {
        const minimumRevealDelay = 900
        const elapsed = Date.now() - startedAt
        const remaining = Math.max(0, minimumRevealDelay - elapsed)

        window.setTimeout(() => {
          this.isBootLoading = false
          this.$nextTick(() => {
            this.syncHashTarget()
            this.setupRevealObserver()
          })
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
    selectCategory(label) {
      this.selectedCategory = label
      this.currentPage = 1
      this.scrollNewsGridIntoView()
    },
    selectFeatured(index) {
      this.activeFeaturedIndex = index
      this.isFeaturedExpanded = false
    },
    toggleFeaturedExpanded() {
      this.isFeaturedExpanded = !this.isFeaturedExpanded
    },
    noticeToneClass(notice) {
      const tone = String(notice.tone || '').toLowerCase()
      if (['danger', 'warning', 'success', 'info'].includes(tone)) {
        return `cb-news-alert--${tone}`
      }
      return 'cb-news-alert--info'
    },
    noticeIcon(notice) {
      const tone = String(notice.tone || '').toLowerCase()
      if (tone === 'danger' || tone === 'warning') {
        return this.icons.alert
      }
      if (tone === 'success') {
        return this.icons.checkCircle
      }
      return this.icons.infoCircle
    },
    splitExcerptIntoParagraphs(excerpt) {
      const normalizedExcerpt = String(excerpt || '').trim()

      if (!normalizedExcerpt) {
        return []
      }

      const manualParagraphs = normalizedExcerpt
        .split(/\r?\n\s*\r?\n|\r?\n/g)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)

      if (manualParagraphs.length > 1) {
        return manualParagraphs
      }

      const sentenceParagraphs = normalizedExcerpt
        .match(/[^.!?]+(?:[.!?]+|$)/g)
        ?.map((paragraph) => paragraph.trim())
        .filter(Boolean) || []

      return sentenceParagraphs.length > 1 ? sentenceParagraphs : manualParagraphs
    },
    showMore() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1
      }
    },
    goToPage(page) {
      if (page.is_ellipsis) {
        return
      }

      const pageNumber = page.page_number || parsePageNumber(page.label)

      if (!pageNumber) {
        return
      }

      this.currentPage = Math.min(pageNumber, this.totalPages)
      this.scrollNewsGridIntoView()
    },
    articleLink(item = {}) {
      const id = item.slug || item.id || slugify(item.title || 'noticia')
      return `/noticias/${encodeURIComponent(id)}`
    },
    resolveMediaUrl(item) {
      return item.media_url || item.image || ''
    },
    resolveMediaType(item) {
      return normalizeMediaType(item)
    },
    syncSearchFromRoute() {
      this.searchTerm = typeof this.$route.query.q === 'string' ? this.$route.query.q : ''
    },
    scrollNewsGridIntoView() {
      this.$nextTick(() => {
        const target = document.getElementById('news-grid')
        const header = document.querySelector('.cb-navbar')

        if (!target) {
          return
        }

        const offset = (header ? header.offsetHeight : 64) + 18
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset
        window.scrollTo({ top, behavior: 'smooth' })
      })
    },
    syncHashTarget() {
      const hash = String(this.$route.hash || '').replace(/^#/, '')

      if (!hash) {
        return
      }

      if (hash.startsWith('news-item-')) {
        const itemId = hash.replace('news-item-', '')
        const itemIndex = this.newsItems.findIndex((item) => String(item.id) === itemId)

        if (itemIndex >= 0) {
          this.selectedCategory = 'Todas'
          this.searchTerm = ''
          this.currentPage = Math.max(1, Math.floor(itemIndex / this.pageSize) + 1)
        }
      }

      this.$nextTick(() => {
        this.scrollToHashTarget(hash)
      })
    },
    scrollToHashTarget(hash, attempt = 0) {
      const target = document.getElementById(hash)

      if (!target) {
        if (attempt < 12) {
          window.setTimeout(() => this.scrollToHashTarget(hash, attempt + 1), 140)
        }
        return
      }

      const header = document.querySelector('.cb-navbar')
      const offset = (header ? header.offsetHeight : 64) + 16
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top, behavior: 'smooth' })
    },
    setupRevealObserver() {
      this.destroyRevealObserver()

      if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        document.querySelectorAll('[data-news-reveal]').forEach((node) => node.classList.add('is-visible'))
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
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px'
      })

      document.querySelectorAll('[data-news-reveal]').forEach((node) => {
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
      title: this.newsContent.meta_title || 'Noticias',
      meta: [
        { hid: 'description', name: 'description', content: this.newsContent.meta_description || '' }
      ],
      htmlAttrs: { lang: 'es' }
    }
  }
}

async function fetchNews($api) {
  const endpoints = [
    '/api/site/pages/noticias',
    '/frontapi/api/site/pages/noticias',
    '/api/site/pages/news',
    '/frontapi/api/site/pages/news'
  ]

  for (const endpoint of endpoints) {
    const payload = await safeGet($api, endpoint)
    if (payload) {
      return payload
    }
  }
  return null
}

async function fetchHome($api) {
  const endpoints = ['/api/site/pages/home', '/frontapi/api/site/pages/home']

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

function normalizePage(payload = {}, base = NEWS_PAGE) {
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
    backgroundImage: `linear-gradient(135deg, rgba(254, 204, 54, 0.24), rgba(32, 83, 154, 0.28)), url('${image}')`
  }
}

function normalizeMediaType(item = {}) {
  if (item.media_type === 'video') {
    return 'video'
  }

  const mediaUrl = item.media_url || item.image || ''

  return /\.(mp4|webm)(\?.*)?$/i.test(mediaUrl) ? 'video' : 'image'
}

function buildIcons() {
  return {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="20" y1="20" x2="16.65" y2="16.65"></line></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v6"></path><path d="M12 17h.01"></path></svg>',
    infoCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5"></path><path d="M12 8h.01"></path></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="m8.5 12.5 2.4 2.4 4.8-5.2"></path></svg>',
    megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 14-5v12L3 13v-2Z"></path><path d="M7 14.4V19a1 1 0 0 0 1 1h1.3a1 1 0 0 0 1-.75l.7-2.75"></path><path d="M21 9v6"></path></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4"></path><path d="M8 3v4"></path><path d="M3 11h18"></path></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m20 13-7 7-10-10V3h7l10 10Z"></path><path d="M7 7h.01"></path></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>',
    chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="m21 15-5-5L5 21"></path></svg>',
    news: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h11a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3V5Z"></path><path d="M18 8h2v11"></path><path d="M8 10h6"></path><path d="M8 14h6"></path></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
    accessibility: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.8"></circle><path d="M7 8h10"></path><path d="M12 8v5"></path><path d="m9 21 3-6 3 6"></path><path d="m8 12 4 2 4-2"></path></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"></path><path d="M12 17h.01"></path></svg>',
    login: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    'phone-call': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.3a2 2 0 0 1 2.11-.45c.85.3 1.74.52 2.64.64A2 2 0 0 1 22 16.92z"></path></svg>'
  }
}

function parsePageNumber(label) {
  const pageNumber = Number.parseInt(label, 10)
  return Number.isFinite(pageNumber) ? pageNumber : null
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'noticia'
}

function resolveInitialPage(items = []) {
  const activeItem = items.find((item) => item.is_active)
  const pageNumber = activeItem ? parsePageNumber(activeItem.label) : null
  return pageNumber || 1
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/news.css"></style>

