<template>
  <div class="cb-page cb-tramites-page" :class="{ 'cb-page--ready': !isBootLoading }" :style="pageStyles">
    <div v-if="isBootLoading" class="cb-tramites-loading" aria-live="polite" aria-busy="true">
      <div class="cb-shell cb-tramites-loading__inner">
        <span class="cb-skeleton cb-skeleton--line cb-skeleton--wave"></span>
        <span class="cb-skeleton cb-skeleton--title cb-skeleton--wave"></span>
        <span class="cb-skeleton cb-skeleton--copy cb-skeleton--wave"></span>
      </div>
    </div>

    <HomeHeader v-if="!isBootLoading && hasCmsContent" :logo-url="logoUrl" :icons="icons" :content="headerSettings" :links="headerLinks" />

    <main v-if="!isBootLoading && hasCmsContent" class="cb-page__content cb-tramites-content">
      <section class="cb-tramites-catalog" aria-labelledby="tramites-title">
        <div class="cb-shell">
          <div class="cb-tramites-index-heading">
            <div>
              <p class="cb-tramites-index-heading__eyebrow">GUÍA POSTAL</p>
              <h1>Información Postal</h1>
              <p>Encuentra información práctica, requisitos y recomendaciones para enviar o recibir tus paquetes de forma segura y sencilla.</p>
            </div>
            <span class="cb-tramites-index-heading__count">{{ filteredItems.length }} {{ filteredItems.length === 1 ? 'recurso' : 'recursos' }}</span>
          </div>

          <div class="cb-tramites-toolbar">
            <label class="cb-tramites-search">
              <span v-html="icons.search" aria-hidden="true"></span>
              <input v-model.trim="searchTerm" type="search" :placeholder="tramitesSettings.search_placeholder || 'Buscar información postal...'" aria-label="Buscar información postal">
            </label>
          </div>

          <div v-if="filteredItems.length" class="cb-tramites-list" role="list">
            <article v-for="(item, index) in filteredItems" :key="item.id || index" class="cb-tramite-row" role="listitem">
              <div class="cb-tramite-row__preview" :class="{ 'is-image': imageAttachments(item).length, 'is-loading': imageAttachments(item).some((attachment, attachmentIndex) => !loadedImages[imageKey(item, attachmentIndex)] && !failedImages[imageKey(item, attachmentIndex)]) }">
                <div v-if="imageAttachments(item).length" class="cb-tramite-row__gallery">
                  <a v-for="(attachment, attachmentIndex) in imageAttachments(item)" :key="attachment.src || attachmentIndex" :href="attachment.src" target="_blank" rel="noopener" class="cb-tramite-row__thumb">
                    <img :src="attachment.src" :alt="item.title" @load="markImageLoaded(imageKey(item, attachmentIndex))" @error="markImageError(imageKey(item, attachmentIndex))">
                  </a>
                </div>
                <div v-else class="cb-tramite-row__file-icon" :class="'is-' + fileKind(item)" v-html="fileIcon(item)" aria-hidden="true"></div>
              </div>

              <div class="cb-tramite-row__content">
                <div class="cb-tramite-row__meta">
                  <span>{{ item.category || 'Información postal' }}</span>
                  <span v-if="item.file_name">{{ item.file_extension || 'archivo' }}</span>
                </div>
                <h2>{{ item.title || 'Información Postal' }}</h2>
                <p v-if="item.description">{{ item.description }}</p>
              </div>

              <div class="cb-tramite-row__actions">
                <a v-for="(attachment, attachmentIndex) in itemAttachments(item)" :key="attachment.src || attachmentIndex" class="cb-tramite-download" :href="attachment.src" :download="attachment.file_name || true" target="_blank" rel="noopener" :aria-label="'Descargar ' + (attachment.file_name || item.title)">
                  <span v-html="icons.download" aria-hidden="true"></span>
                  <span>{{ attachment.file_name || 'Archivo ' + (attachmentIndex + 1) }}</span>
                </a>
                <template v-if="item.url && item.url !== '#'">
                  <nuxt-link v-if="isInternalRoute(item.url)" :to="item.url" class="cb-tramite-button">Ver información <span v-html="icons.arrow"></span></nuxt-link>
                  <a v-else :href="item.url" class="cb-tramite-button" target="_blank" rel="noopener noreferrer">Ver información <span v-html="icons.arrow"></span></a>
                </template>
              </div>
            </article>
          </div>

          <div v-else class="cb-tramites-empty">
            <span v-html="icons.search" aria-hidden="true"></span>
            <h2>{{ tramitesSettings.empty_text || 'No encontramos informaciÃ³n con esos criterios.' }}</h2>
            <button type="button" @click="searchTerm = ''">Limpiar bÃºsqueda</button>
          </div>
        </div>
      </section>
    </main>

    <div v-else-if="!isBootLoading" class="cb-tramites-error" role="alert">
      <h1>No se pudo cargar la pÃ¡gina</h1>
      <p>El contenido de InformaciÃ³n Postal no estÃ¡ disponible en este momento.</p>
      <button type="button" @click="reloadCmsContent">Reintentar</button>
    </div>

    <HomeFooter v-if="!isBootLoading && hasCmsContent" :logo-url="logoUrl" :icons="icons" :content="footerSettings" :links="footerLinks" />
  </div>
</template>

<script>
import { sanitizeContentTree } from '~/utils/contentSecurity'
import { fetchPageWithSharedLayout } from '~/utils/sharedLayout'

const BASE_PAGE = {
  id: null,
  theme: { logo_url: '', primary_color: '#20539a', secondary_color: '#2f3f5c', accent_color: '#fecc36' },
  sections: [
    { key: 'header', settings: {}, items: [] },
    { key: 'tramites', settings: { eyebrow: 'SERVICIOS POSTALES', title: 'InformaciÃ³n Postal', description: '', search_placeholder: 'Buscar informaciÃ³n postal...', empty_text: '' }, items: [] },
    { key: 'footer', settings: {}, items: [] }
  ]
}

export default {
  name: 'TramitesPage',
  props: {
    initialPage: { type: Object, default: null }
  },
  data() {
    const initialPage = this.initialPage ? normalizePage(this.initialPage) : BASE_PAGE
    return { isBootLoading: !this.initialPage, pageContent: initialPage, cmsError: false, searchTerm: '', loadedImages: {}, failedImages: {} }
  },
  async asyncData({ $api }) {
    const payload = await fetchPage($api)
    return { pageContent: normalizePage(payload || BASE_PAGE), cmsError: !payload }
  },
  async mounted() {
    if (this.initialPage && this.pageContent.id) {
      this.isBootLoading = false
      return
    }
    const startedAt = Date.now()
    const payload = await fetchPage(this.$api)
    if (payload) { this.pageContent = normalizePage(payload); this.cmsError = false }
    const remaining = Math.max(0, 350 - (Date.now() - startedAt))
    window.setTimeout(() => { this.isBootLoading = false }, remaining)
  },
  computed: {
    hasCmsContent() { return Boolean(this.pageContent && this.pageContent.id) },
    logoUrl() { return this.pageContent.theme.logo_url || '' },
    headerSettings() { return this.getSectionSettings('header') },
    footerSettings() { return this.getSectionSettings('footer') },
    headerLinks() { return this.getSectionItems('header') },
    footerLinks() { return this.getSectionItems('footer') },
    tramitesSettings() { return this.getSectionSettings('tramites') },
    tramiteItems() {
      return this.getSectionItems('tramites').map((item) => ({ ...item, title: item.title || item.name || '', file_name: item.file_name || '', file_mime: item.file_mime || '', file_extension: item.file_extension || '' }))
    },
    filteredItems() {
      const query = this.searchTerm.toLowerCase().trim()
      return this.tramiteItems.filter((item) => !query || `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(query))
    },
    pageStyles() {
      const theme = this.pageContent.theme || {}
      return { '--cb-blue': theme.primary_color || '#20539a', '--cb-yellow': theme.accent_color || '#fecc36', '--cb-ink': theme.secondary_color || '#2f3f5c' }
    },
    icons() { return buildIcons() }
  },
  methods: {
    getSectionSettings(key) { const section = this.pageContent.sections.find((item) => item.key === key); return section ? section.settings || {} : {} },
    getSectionItems(key) {
      const section = this.pageContent.sections.find((item) => item.key === key)
      return section && Array.isArray(section.items) ? section.items.map((item) => ({ ...(item.data || {}), id: item.id, type: item.type, itemName: item.name })) : []
    },
    isInternalRoute(url) { return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//') },
    itemAttachments(item) {
      const attachments = Array.isArray(item && item.attachments) ? item.attachments.filter((attachment) => attachment && attachment.src) : []
      if (attachments.length) return attachments
      const fallbackSrc = item && item.src ? item.src : (item && item.url && item.url !== '#' ? item.url : '')
      if (fallbackSrc) return [{ src: fallbackSrc, file_name: item.file_name || '', file_mime: item.file_mime || '', file_extension: item.file_extension || '' }]
      return []
    },
    imageAttachments(item) { return this.itemAttachments(item).filter((attachment) => this.isImage(attachment)) },
    imageKey(item, index) { return `${item.id || item.title}-${index}` },
    isImage(item) { return Boolean(item && ((item.file_mime || '').startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)(?:[?#].*)?$/i.test(item.src || item.file_name || item.url || ''))) },
    fileKind(item) { const first = this.itemAttachments(item)[0] || item; const value = `${first.file_extension || ''} ${first.file_mime || ''} ${first.file_name || ''} ${first.url || ''}`.toLowerCase(); if (value.includes('pdf')) return 'pdf'; if (/doc|word/.test(value)) return 'word'; if (/xls|sheet|csv/.test(value)) return 'excel'; if (/ppt|presentation/.test(value)) return 'slides'; return 'file' },
    fileIcon(item) { const kind = this.fileKind(item); const label = { pdf: 'PDF', word: 'DOC', excel: 'XLS', slides: 'PPT', file: 'FILE' }[kind]; return `<span class="cb-file-icon__mark">${label}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 2.8h8l4 4V21H6z"/><path d="M14 2.8v4h4"/><path d="M9 12h6M9 16h6"/></svg>` },
    markImageLoaded(id) { this.$set(this.loadedImages, id, true) },
    markImageError(id) { this.$set(this.failedImages, id, true); this.$set(this.loadedImages, id, true) },
    async reloadCmsContent() { this.isBootLoading = true; const payload = await fetchPage(this.$api); this.pageContent = normalizePage(payload || BASE_PAGE); this.cmsError = !payload; this.isBootLoading = false }
  },
  head() { return { title: this.pageContent.meta_title || 'InformaciÃ³n Postal', meta: [{ hid: 'description', name: 'description', content: this.pageContent.meta_description || '' }], htmlAttrs: { lang: 'es' } } }
}

async function fetchPage($api) {
  const endpoints = ['/frontapi/api/site/pages/informacion-postal', '/api/site/pages/informacion-postal', '/frontapi/api/site/pages/tramites', '/api/site/pages/tramites']
  return fetchPageWithSharedLayout($api, endpoints)
}

function normalizePage(payload = {}) {
  const sectionMap = payload.section_map || {}
  return { ...BASE_PAGE, ...payload, theme: { ...BASE_PAGE.theme, ...sanitizeContentTree(payload.theme || {}) }, sections: BASE_PAGE.sections.map((fallback) => {
    const section = sectionMap[fallback.key] || (Array.isArray(payload.sections) ? payload.sections.find((item) => item.key === fallback.key) : null)
    return section ? sanitizeContentTree({ ...fallback, ...section, settings: { ...fallback.settings, ...(section.settings || {}) }, items: Array.isArray(section.items) ? section.items : [] }) : fallback
  }) }
}

function buildIcons() {
  return {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h13"></path><path d="m13 6 6 6-6 6"></path></svg>',
    document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h8l4 4v14H7z"></path><path d="M15 3v5h4"></path><path d="M10 13h6M10 17h6"></path></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 21h14"></path></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"></path><path d="M12 17h.01"></path></svg>'
  }
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/tramites.css"></style>
