import { sanitizeContentTree } from '~/utils/contentSecurity'

const STATUS_PAGE_BASE = {
  theme: { logo_url: '', primary_color: '#20539a', secondary_color: '#2f3f5c', accent_color: '#fecc36' },
  sections: [
    { key: 'header', settings: { help_label: '', login_label: '', search_placeholder: '', language_primary: '', language_secondary: '', accessibility_label: '' }, items: [] },
    { key: 'footer', settings: { help_title: '', company_title: '', contact_title: '', social_title: '', social_text: '', address: '', phone: '', email: '', copyright: '', legal_text: '', seal_logo: '' }, items: [] }
  ]
}

export function createEmptySiteShell() {
  return {
    ...STATUS_PAGE_BASE,
    theme: { ...STATUS_PAGE_BASE.theme },
    sections: STATUS_PAGE_BASE.sections.map((section) => ({
      ...section,
      settings: { ...section.settings },
      items: []
    }))
  }
}

export async function fetchSiteShell($api) {
  const page = await fetchHomePage($api)

  if (!page) {
    return null
  }

  const sectionMap = page.section_map || {}
  const theme = sanitizeContentTree(page.theme || {})

  return {
    ...STATUS_PAGE_BASE,
    ...page,
    theme: {
      ...STATUS_PAGE_BASE.theme,
      ...theme,
      // A favicon is not the site logo. Some stale CMS responses return it here.
      logo_url: isFavicon(theme.logo_url) ? '' : (theme.logo_url || '')
    },
    sections: STATUS_PAGE_BASE.sections.map((fallback) => {
      const section = sectionMap[fallback.key] || (Array.isArray(page.sections) ? page.sections.find((item) => item.key === fallback.key) : null)
      if (!section) return fallback

      return sanitizeContentTree({
        ...fallback,
        ...section,
        settings: { ...fallback.settings, ...(section.settings || {}) },
        items: Array.isArray(section.items) ? section.items : []
      })
    })
  }
}

async function fetchHomePage($api) {
  const endpoints = ['/frontapi/api/site/pages/home', '/api/site/pages/home']

  for (const endpoint of endpoints) {
    try {
      const payload = await $api.$get(endpoint)
      if (payload) return payload
    } catch (error) {
      // Try the alternate route used by the other pages when this one is unavailable.
    }
  }

  return null
}

function isFavicon(value) {
  return typeof value === 'string' && /(?:^|\/)favicon(?:-[^/]+)?\.(?:svg|png|ico)(?:[?#].*)?$/i.test(value.trim())
}
