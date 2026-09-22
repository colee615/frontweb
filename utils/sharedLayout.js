const SHARED_SECTION_KEYS = ['header', 'footer']
const HOME_ENDPOINTS = ['/frontapi/api/site/pages/home', '/api/site/pages/home']

async function safeGet($api, endpoint) {
  try {
    return await $api.$get(endpoint)
  } catch (error) {
    return null
  }
}

async function fetchFirstAvailable($api, endpoints) {
  for (const endpoint of endpoints) {
    const payload = await safeGet($api, endpoint)

    if (payload) {
      return payload
    }
  }

  return null
}

function findSection(payload, key) {
  if (!payload) {
    return null
  }

  if (payload.section_map && payload.section_map[key]) {
    return payload.section_map[key]
  }

  if (!Array.isArray(payload.sections)) {
    return null
  }

  return payload.sections.find((section) => section.key === key) || null
}

export function mergeSharedLayout(pagePayload, homePayload) {
  if (!pagePayload && !homePayload) {
    return null
  }

  const mergedPayload = { ...(pagePayload || {}) }
  const sectionMap = { ...((pagePayload && pagePayload.section_map) || {}) }
  const pageSections = Array.isArray(pagePayload && pagePayload.sections)
    ? [...pagePayload.sections]
    : []

  SHARED_SECTION_KEYS.forEach((key) => {
    const sharedSection = findSection(homePayload, key)

    if (!sharedSection) {
      return
    }

    sectionMap[key] = sharedSection
    const currentIndex = pageSections.findIndex((section) => section.key === key)

    if (currentIndex === -1) {
      pageSections.push(sharedSection)
    } else {
      pageSections.splice(currentIndex, 1, sharedSection)
    }
  })

  return {
    ...mergedPayload,
    section_map: sectionMap,
    sections: pageSections
  }
}

export async function fetchPageWithSharedLayout($api, pageEndpoints) {
  const [pagePayload, homePayload] = await Promise.all([
    fetchFirstAvailable($api, pageEndpoints),
    fetchFirstAvailable($api, HOME_ENDPOINTS)
  ])

  return mergeSharedLayout(pagePayload, homePayload)
}
