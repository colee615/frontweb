const ROUTE_BY_SLUG = {
  home: '/',
  'quienes-somos': '/quienes-somos',
  noticias: '/noticias'
}

const ANCHOR_BY_SECTION = {
  home: {
    hero: 'home-hero',
    services: 'home-services',
    tools: 'home-tools',
    app_banner: 'home-app',
    market: 'home-market',
    footer: 'site-footer'
  },
  'quienes-somos': {
    hero_gallery: 'about-hero',
    mission_vision: 'about-mission',
    history: 'about-history',
    principles: 'about-principles',
    organigram: 'about-organigram',
    objectives: 'about-objectives',
    footer: 'site-footer'
  },
  noticias: {
    featured_story: 'news-featured',
    category_filters: 'news-filters',
    news_grid: 'news-grid',
    newsletter: 'news-newsletter',
    footer: 'site-footer'
  }
}

export function buildSearchEntriesFromPayloads(payloads = []) {
  return payloads.flatMap((payload) => buildEntriesFromPage(payload)).filter(Boolean)
}

export function searchSiteEntries(query, entries = [], currentPath = '', limit = 8) {
  const normalizedQuery = normalizeSearchText(query)

  if (!normalizedQuery) {
    return []
  }

  return entries
    .map((entry) => ({
      ...entry,
      score: scoreEntry(entry, normalizedQuery, currentPath)
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.label.localeCompare(right.label))
    .slice(0, limit)
}

export function highlightSearchMatch(text, query) {
  const safeText = escapeHtml(text || '')
  const normalizedQuery = String(query || '').trim()

  if (!normalizedQuery) {
    return safeText
  }

  const escapedQuery = escapedRegex(normalizedQuery)
  return safeText.replace(new RegExp(`(${escapedQuery})`, 'ig'), '<mark>$1</mark>')
}

function buildEntriesFromPage(payload = {}) {
  const slug = String(payload.slug || '').trim()
  const route = ROUTE_BY_SLUG[slug] || '#'
  const sectionAnchors = ANCHOR_BY_SECTION[slug] || {}
  const pageTitle = payload.name || humanizeSlug(slug)
  const sections = Array.isArray(payload.sections) ? payload.sections : []
  const entries = []

  entries.push({
    id: `${slug}-page`,
    label: pageTitle,
    description: payload.meta_description || `Ir a ${pageTitle}.`,
    section: pageTitle,
    type: 'Pagina',
    route,
    anchor: sections.length ? (sectionAnchors[sections[0].key] || '') : '',
    haystack: [pageTitle, payload.meta_title, payload.meta_description, slug].filter(Boolean)
  })

  sections.forEach((section) => {
    const anchor = sectionAnchors[section.key] || ''
    const settings = section.settings || {}
    const items = Array.isArray(section.items) ? section.items : []
    const sectionLabel = resolveSectionLabel(section, settings)
    const sectionDescription = resolveSectionDescription(settings, items, pageTitle)

    if (sectionLabel && anchor) {
      entries.push({
        id: `${slug}-${section.key}`,
        label: sectionLabel,
        description: sectionDescription,
        section: pageTitle,
        type: 'Seccion',
        route,
        anchor,
        haystack: [
          sectionLabel,
          section.name,
          section.key,
          sectionDescription,
          ...collectTextFragments(settings)
        ].filter(Boolean)
      })
    }

    items.forEach((item, index) => {
      const data = item.data || {}
      const label = resolveItemLabel(data, item, sectionLabel, index)
      const description = resolveItemDescription(data, sectionDescription)

      if (!label || !anchor) {
        return
      }

      entries.push({
        id: `${slug}-${section.key}-${item.id || index}`,
        label,
        description,
        section: sectionLabel || pageTitle,
        type: resolveItemType(slug, section.key),
        route,
        anchor: resolveItemAnchor(slug, section.key, item, index, anchor),
        image: resolveItemImage(data),
        haystack: [
          label,
          description,
          item.name,
          item.type,
          ...collectTextFragments(data)
        ].filter(Boolean)
      })
    })
  })

  return entries
}

function resolveSectionLabel(section, settings) {
  return (
    settings.title ||
    settings.contact_title ||
    settings.help_title ||
    settings.company_title ||
    settings.map_title ||
    settings.calculator_title ||
    settings.badge ||
    section.name ||
    humanizeSlug(section.key)
  )
}

function resolveSectionDescription(settings, items, pageTitle) {
  return (
    settings.subtitle ||
    settings.text ||
    settings.description ||
    settings.social_text ||
    settings.tracking_text ||
    settings.card_text ||
    settings.mission_text ||
    settings.vision_text ||
    (items[0] && resolveItemDescription(items[0].data || {}, '')) ||
    `Explora esta seccion de ${pageTitle}.`
  )
}

function resolveItemLabel(data, item, sectionLabel, index) {
  return (
    data.title ||
    data.label ||
    data.name ||
    data.category ||
    item.name ||
    `${sectionLabel || 'Elemento'} ${index + 1}`
  )
}

function resolveItemDescription(data, fallback = '') {
  return (
    data.excerpt ||
    data.text ||
    data.description ||
    data.subtitle ||
    data.category ||
    data.date ||
    fallback
  )
}

function resolveItemType(slug, sectionKey) {
  if (slug === 'noticias' && (sectionKey === 'news_grid' || sectionKey === 'featured_story')) {
    return 'Noticia'
  }

  return 'Contenido'
}

function resolveItemAnchor(slug, sectionKey, item, index, fallbackAnchor) {
  const itemId = item && (item.id || index)

  if (slug === 'noticias' && sectionKey === 'featured_story') {
    return `news-featured-item-${itemId}`
  }

  if (slug === 'noticias' && sectionKey === 'news_grid') {
    return `news-item-${itemId}`
  }

  if (slug === 'home' && sectionKey === 'market') {
    return `home-market-item-${itemId}`
  }

  if (slug === 'home' && sectionKey === 'services') {
    return `home-service-item-${itemId}`
  }

  if (slug === 'quienes-somos' && sectionKey === 'principles') {
    return `about-principle-item-${itemId}`
  }

  if (slug === 'quienes-somos' && sectionKey === 'objectives') {
    return `about-objective-item-${itemId}`
  }

  return fallbackAnchor
}

function resolveItemImage(data = {}) {
  return data.image || data.poster_image || data.media_url || data.src || ''
}

function collectTextFragments(source = {}) {
  return Object.values(source)
    .flatMap((value) => {
      if (Array.isArray(value)) {
        return value.map((item) => String(item || ''))
      }

      if (value && typeof value === 'object') {
        return collectTextFragments(value)
      }

      return typeof value === 'string' || typeof value === 'number' ? [String(value)] : []
    })
    .filter(Boolean)
}

function scoreEntry(entry, query, currentPath) {
  const haystack = Array.isArray(entry.haystack) ? entry.haystack.map(normalizeSearchText) : []
  const label = normalizeSearchText(entry.label)
  const description = normalizeSearchText(entry.description)
  const section = normalizeSearchText(entry.section)
  let score = 0

  if (label.startsWith(query)) {
    score += 180
  } else if (label.includes(query)) {
    score += 120
  }

  haystack.forEach((part) => {
    if (!part) {
      return
    }

    if (part.startsWith(query)) {
      score += 90
    } else if (part.includes(query)) {
      score += 32
    }
  })

  if (description.includes(query)) {
    score += 26
  }

  if (section.includes(query)) {
    score += 20
  }

  if (entry.type === 'Noticia') {
    score += 14
  }

  if (currentPath && entry.route === currentPath) {
    score += 10
  }

  return score
}

function normalizeSearchText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function humanizeSlug(value) {
  return String(value || '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function escapedRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
