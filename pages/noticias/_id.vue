<template>
  <div class="cb-page cb-news-page cb-news-article-page" :style="themeStyles">
    <HomeHeader :logo-url="logoUrl" :icons="icons" :content="headerSettings" :links="headerLinks" />

    <main class="cb-news-article">
      <article class="cb-shell cb-news-article__layout">
        <header class="cb-news-article__header">
          <div class="cb-news-article__kicker">
            <nuxt-link to="/noticias">Noticias</nuxt-link>
            <span>/</span>
            <strong>{{ article.category || 'Institucional' }}</strong>
          </div>

          <div class="cb-news-article__headline">
            <div>
              <p class="cb-news-article__date">{{ article.date || 'Comunicado institucional' }}</p>
              <h1>{{ article.title }}</h1>
            </div>

            <aside class="cb-news-article__share" aria-label="Compartir noticia">
              <strong>Compartir</strong>
              <div class="cb-news-article__share-links">
                <a :href="shareLinks.facebook" target="_blank" rel="noopener" aria-label="Compartir en Facebook" v-html="icons.facebook"></a>
                <a :href="shareLinks.whatsapp" target="_blank" rel="noopener" aria-label="Compartir en WhatsApp" v-html="icons.whatsapp"></a>
                <a :href="shareLinks.x" target="_blank" rel="noopener" aria-label="Compartir en X" v-html="icons.x"></a>
                <button type="button" aria-label="Copiar enlace" @click="copyCurrentUrl" v-html="icons.link"></button>
              </div>
            </aside>
          </div>
        </header>

        <figure class="cb-news-article__figure">
          <img :src="resolveMediaUrl(article)" :alt="article.title">
        </figure>

        <div class="cb-news-article__body">
          <p class="cb-news-article__lead"><strong>{{ article.location || 'La Paz, Bolivia' }}, {{ article.date || 'fecha institucional' }}</strong></p>
          <p v-for="(paragraph, index) in articleParagraphs" :key="`article-paragraph-${index}`">{{ paragraph }}</p>
        </div>

        <footer class="cb-news-article__footer">
          <nuxt-link to="/noticias" class="cb-news-article__back">
            <span class="cb-news-inline-icon" v-html="icons.chevronLeft"></span>
            Volver a noticias
          </nuxt-link>
        </footer>
      </article>
    </main>

    <HomeFooter :logo-url="logoUrl" :icons="icons" :content="footerSettings" :links="footerLinks" />
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
    { key: 'featured_story', settings: {}, items: [] },
    { key: 'news_grid', settings: {}, items: [] }
  ]
}

const DEMO_NEWS_ITEMS = [
  {
    id: 'demo-institucional-1',
    date: '22 abr. 2025',
    location: 'La Paz',
    category: 'Institucional',
    title: 'Correos de Bolivia fortalece su red logistica nacional',
    excerpt: 'Se incorporan nuevas rutas para mejorar los tiempos de entrega en todo el pais.',
    media_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'demo-institucional-2',
    date: '20 abr. 2025',
    location: 'Cochabamba',
    category: 'Institucional',
    title: 'Nuevo servicio de envios para emprendedores',
    excerpt: 'Una solucion confiable y accesible para impulsar el desarrollo de emprendimientos bolivianos.',
    media_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'demo-institucional-3',
    date: '18 abr. 2025',
    location: 'La Paz',
    category: 'Institucional',
    title: 'Ampliamos nuestra cobertura en La Paz y El Alto',
    excerpt: 'Nuevas agencias y puntos de atencion para estar mas cerca de la poblacion.',
    media_url: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'demo-institucional-4',
    date: '16 abr. 2025',
    location: 'La Paz',
    category: 'Institucional',
    title: 'Modernizamos procesos para mejorar la atencion postal',
    excerpt: 'Nuevas herramientas fortalecen la gestion operativa y la experiencia de usuarios.',
    media_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'demo-institucional-5',
    date: '14 abr. 2025',
    location: 'Santa Cruz',
    category: 'Institucional',
    title: 'Capacitacion nacional para equipos de atencion',
    excerpt: 'Personal de oficinas participa en jornadas de mejora continua y servicio ciudadano.',
    media_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'demo-institucional-6',
    date: '11 abr. 2025',
    location: 'Oruro',
    category: 'Institucional',
    title: 'Alianzas operativas impulsan la distribucion nacional',
    excerpt: 'La coordinacion interinstitucional refuerza el alcance de los servicios postales.',
    media_url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'demo-filatelia-1',
    date: '15 abr. 2025',
    location: 'La Paz',
    category: 'Filatelia',
    title: 'Nueva coleccion filatelica celebra la identidad boliviana',
    excerpt: 'Sellos conmemorativos resaltan patrimonio, cultura y paisajes del pais.',
    media_url: 'https://images.unsplash.com/photo-1566055909643-a51b4271d91b?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'demo-comunicados-1',
    date: '12 abr. 2025',
    location: 'La Paz',
    category: 'Comunicados',
    title: 'Horarios especiales de atencion al publico',
    excerpt: 'Conoce la programacion de ventanillas y oficinas para fechas especiales.',
    media_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'demo-prensa-1',
    date: '10 abr. 2025',
    location: 'Cochabamba',
    category: 'Prensa',
    title: 'Historias que conectan comunidades',
    excerpt: 'Conoce algunas historias de personas que confian en Correos de Bolivia.',
    media_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80'
  }
]

export default {
  name: 'NewsDetailPage',
  async asyncData({ $api, params }) {
    const [homePayload, newsPayload] = await Promise.all([
      fetchHome($api),
      fetchNews($api)
    ])

    return {
      requestedId: params.id,
      currentUrl: '',
      homeContent: normalizePage(homePayload || SHARED_LAYOUT_PAGE, SHARED_LAYOUT_PAGE),
      newsContent: normalizePage(newsPayload || NEWS_PAGE, NEWS_PAGE)
    }
  },
  data() {
    return {
      copied: false
    }
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
    allNewsItems() {
      const configuredItems = [
        ...this.getSectionItems(this.newsContent, 'featured_story'),
        ...this.getSectionItems(this.newsContent, 'news_grid')
      ].filter((item) => item.title)

      return configuredItems.length ? configuredItems : DEMO_NEWS_ITEMS
    },
    article() {
      const requested = decodeURIComponent(String(this.requestedId || ''))
      return this.allNewsItems.find((item) => {
        const itemSlug = String(item.slug || '').trim()
        return String(item.id) === requested || itemSlug === requested || slugify(item.title) === requested
      }) || this.allNewsItems[0] || {}
    },
    articleParagraphs() {
      const body = String(this.article.body || '').trim()
      if (body) {
        return body.split(/\r?\n\s*\r?\n|\r?\n/g).map((item) => item.trim()).filter(Boolean)
      }

      return [
        this.article.excerpt || 'Correos de Bolivia informa a la ciudadania sobre los avances, servicios y acciones institucionales desarrolladas para fortalecer la cobertura postal en el pais.',
        'La entidad mantiene una agenda de mejora continua orientada a brindar mayor eficiencia, seguridad y cercania a las familias, emprendedores e instituciones que utilizan los servicios postales.',
        'Estas acciones forman parte de una estrategia integral para modernizar procesos, ampliar puntos de atencion y consolidar canales digitales que permitan un seguimiento mas claro y oportuno.',
        'Correos de Bolivia reafirma su compromiso con un servicio publico accesible, confiable y alineado a las necesidades actuales de comunicacion, logistica y distribucion.'
      ]
    },
    shareLinks() {
      const url = encodeURIComponent(this.currentUrl || '')
      const title = encodeURIComponent(this.article.title || 'Noticia de Correos de Bolivia')
      return {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        whatsapp: `https://api.whatsapp.com/send?text=${title}%20${url}`,
        x: `https://twitter.com/intent/tweet?text=${title}&url=${url}`
      }
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
  mounted() {
    this.currentUrl = window.location.href
    this.refreshSharedContent()
  },
  methods: {
    async refreshSharedContent() {
      const [homePayload, newsPayload] = await Promise.all([
        fetchHome(this.$api),
        fetchNews(this.$api)
      ])

      if (homePayload) {
        this.homeContent = normalizePage(homePayload, SHARED_LAYOUT_PAGE)
      }

      if (newsPayload) {
        this.newsContent = normalizePage(newsPayload, NEWS_PAGE)
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
    resolveMediaUrl(item) {
      return item.media_url || item.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80'
    },
    async copyCurrentUrl() {
      if (!navigator.clipboard || !this.currentUrl) {
        return
      }
      await navigator.clipboard.writeText(this.currentUrl)
      this.copied = true
      window.setTimeout(() => {
        this.copied = false
      }, 1400)
    }
  },
  head() {
    return {
      title: `${this.article.title || 'Noticia'} | Correos de Bolivia`,
      meta: [
        { hid: 'description', name: 'description', content: this.article.excerpt || this.newsContent.meta_description || '' }
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

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'noticia'
}

function buildIcons() {
  return {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="20" y1="20" x2="16.65" y2="16.65"></line></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8.4h2.2V5.1c-.4-.1-1.7-.2-3.2-.2-3.1 0-5.2 1.9-5.2 5.4v3H4.5V17h3.3v7h4V17h3.3l.5-3.7h-3.8v-2.6c0-1.1.3-2.3 2.2-2.3Z"></path></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.1 4.9A9.8 9.8 0 0 0 3.7 16.7L2.5 21.5l4.9-1.3a9.8 9.8 0 0 0 4.7 1.2h.1A9.8 9.8 0 0 0 19.1 4.9Zm-6.9 14.8a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3a8.1 8.1 0 1 1 6.8 3.6Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.1 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.2-.3-.4-.4Z"></path></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m14.4 10.6 7-8.1h-1.7l-6.1 7-4.8-7H3.2l7.3 10.6-7.3 8.4h1.7l6.4-7.4 5.1 7.4H22l-7.6-10.9Zm-2.3 2.6-.7-1L5.5 3.8H8l4.8 6.9.7 1 6.2 8.8h-2.5l-5.1-7.3Z"></path></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"></path><path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"></path></svg>',
    chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
    accessibility: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="4" r="1.8"></circle><path d="M7 8h10"></path><path d="M12 8v5"></path><path d="m9 21 3-6 3 6"></path></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"></path><path d="M12 17h.01"></path></svg>',
    login: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    'phone-call': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.3a2 2 0 0 1 2.11-.45c.85.3 1.74.52 2.64.64A2 2 0 0 1 22 16.92z"></path></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>'
  }
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/news.css"></style>
