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
              <div class="cb-tramite-row__preview" :class="{ 'is-image': imageAttachments(item).length, 'is-single': imageAttachments(item).length === 1, 'is-loading': imageAttachments(item).some((attachment, attachmentIndex) => !loadedImages[imageKey(item, attachmentIndex)] && !failedImages[imageKey(item, attachmentIndex)]) }">
                <div v-if="imageAttachments(item).length" class="cb-tramite-row__gallery">
                  <button v-for="(attachment, attachmentIndex) in imageAttachments(item)" :key="attachment.src || attachmentIndex" type="button" class="cb-tramite-row__thumb" :aria-label="'Ver ' + (attachment.file_name || item.title)" @click="openViewer(item, attachment)">
                    <img :src="attachment.src" :alt="item.title" @load="markImageLoaded(imageKey(item, attachmentIndex))" @error="markImageError(imageKey(item, attachmentIndex))">
                  </button>
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
                <button v-if="previewableAttachments(item).length" type="button" class="cb-tramite-button cb-tramite-button--secondary" @click="openViewer(item)" :aria-label="'Ver ' + item.title">
                  <span v-html="icons.eye" aria-hidden="true"></span>
                  <span>Ver</span>
                </button>
                <button v-if="itemAttachments(item).length" type="button" class="cb-tramite-download" :disabled="downloadingItemKey === itemKey(item, index)" @click="downloadAll(item, index)" :aria-label="'Descargar todos los archivos de ' + item.title">
                  <span v-html="icons.download" aria-hidden="true"></span>
                  <span>{{ downloadingItemKey === itemKey(item, index) ? 'Preparando…' : 'Descargar todo' }}</span>
                </button>
                <p v-if="downloadErrorKey === itemKey(item, index)" class="cb-tramite-row__download-error" role="status">No se pudieron preparar los archivos. Intenta descargarlos más tarde.</p>
                <template v-if="item.url && item.url !== '#' && !itemAttachments(item).length">
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

    <div v-if="viewerOpen" class="cb-document-viewer" role="dialog" aria-modal="true" :aria-label="'Vista previa: ' + viewerTitle" @click.self="closeViewer" @keydown.esc.stop.prevent="closeViewer" @keydown.left.stop.prevent="showPreviousPreview" @keydown.right.stop.prevent="showNextPreview">
      <div class="cb-document-viewer__panel">
        <header class="cb-document-viewer__header">
          <div class="cb-document-viewer__heading">
            <p>Vista previa</p>
            <h2>{{ viewerTitle }}</h2>
            <span v-if="activePreview">{{ activePreview.file_name || (isPdf(activePreview) ? 'Documento PDF' : 'Imagen') }}<template v-if="viewerAttachments.length > 1"> · {{ viewerIndex + 1 }} de {{ viewerAttachments.length }}</template></span>
          </div>
          <button ref="viewerClose" class="cb-document-viewer__close" type="button" aria-label="Cerrar vista previa" @click="closeViewer">×</button>
        </header>

        <div class="cb-document-viewer__content">
          <button v-if="viewerAttachments.length > 1" type="button" class="cb-document-viewer__nav cb-document-viewer__nav--previous" aria-label="Archivo anterior" @click="showPreviousPreview">‹</button>
          <img v-if="activePreview && isImage(activePreview)" :src="activePreview.src" :alt="activePreview.file_name || viewerTitle" title="Doble clic para acercar o alejar" class="cb-document-viewer__image" :class="{ 'is-zoomed': imageZoom > 1, 'is-dragging': imageDrag }" :style="imageTransform" @wheel.prevent="zoomWithWheel" @dblclick="toggleImageZoom" @pointerdown="startImageInteraction" @pointermove="moveImageInteraction" @pointerup="endImageInteraction" @pointercancel="endImageInteraction" @lostpointercapture="endImageInteraction">
          <iframe v-else-if="activePreview && isPdf(activePreview)" :key="activePreview.src" :src="activePreview.src" :title="activePreview.file_name || viewerTitle" class="cb-document-viewer__pdf"></iframe>
          <div v-else class="cb-document-viewer__unsupported">
            <p>Este tipo de archivo no se puede mostrar en la página.</p>
            <a v-if="activePreview" :href="activePreview.src" target="_blank" rel="noopener noreferrer">Abrir archivo</a>
          </div>
          <button v-if="viewerAttachments.length > 1" type="button" class="cb-document-viewer__nav cb-document-viewer__nav--next" aria-label="Archivo siguiente" @click="showNextPreview">›</button>
        </div>

        <footer class="cb-document-viewer__footer">
          <div v-if="activePreview && isImage(activePreview)" class="cb-image-tools" aria-label="Controles de imagen">
            <button type="button" aria-label="Alejar imagen" title="Alejar (−)" :disabled="imageZoom <= 1" @click="zoomOut">−</button>
            <span class="cb-image-tools__zoom" aria-live="polite">{{ Math.round(imageZoom * 100) }}%</span>
            <button type="button" aria-label="Acercar imagen" title="Acercar (+)" :disabled="imageZoom >= 5" @click="zoomIn">+</button>
            <button type="button" aria-label="Girar imagen 90 grados" title="Girar imagen (R)" @click="rotateImage">↻</button>
            <button type="button" class="cb-image-tools__fit" title="Ajustar imagen (0)" @click="resetImageView">Ajustar</button>
          </div>
          <button v-if="viewerItem && itemAttachments(viewerItem).length" type="button" class="cb-tramite-download" :disabled="downloadingItemKey === itemKey(viewerItem, 0)" @click="downloadAll(viewerItem, 0)">
            <span v-html="icons.download" aria-hidden="true"></span>
            <span>{{ downloadingItemKey === itemKey(viewerItem, 0) ? 'Preparando…' : 'Descargar todo' }}</span>
          </button>
          <span v-if="downloadErrorKey === itemKey(viewerItem, 0)" class="cb-tramite-row__download-error" role="status">No se pudieron preparar los archivos. Intenta descargarlos más tarde.</span>
        </footer>
      </div>
    </div>

    <div v-if="!isBootLoading && !hasCmsContent" class="cb-tramites-error" role="alert">
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
import JSZip from 'jszip'

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
    return { isBootLoading: !this.initialPage, pageContent: initialPage, cmsError: false, searchTerm: '', loadedImages: {}, failedImages: {}, viewerOpen: false, viewerItem: null, viewerAttachments: [], viewerIndex: 0, imageZoom: 1, imageRotation: 0, imageOffsetX: 0, imageOffsetY: 0, imageDrag: null, imagePointers: {}, pinchState: null, downloadingItemKey: '', downloadErrorKey: '' }
  },
  async asyncData({ $api }) {
    const payload = await fetchPage($api)
    return { pageContent: normalizePage(payload || BASE_PAGE), cmsError: !payload }
  },
  async mounted() {
    window.addEventListener('keydown', this.handleViewerKeydown)
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
  beforeDestroy() { window.removeEventListener('keydown', this.handleViewerKeydown) },
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
    icons() { return buildIcons() },
    viewerTitle() { return this.viewerItem ? (this.viewerItem.title || this.viewerItem.name || 'Información Postal') : 'Información Postal' },
    activePreview() { return this.viewerAttachments[this.viewerIndex] || null },
    imageTransform() {
      const style = { transform: `translate3d(${this.imageOffsetX}px, ${this.imageOffsetY}px, 0) scale(${this.imageZoom}) rotate(${this.imageRotation}deg)` }
      if (this.imageRotation % 180 !== 0) { style.maxWidth = 'min(70vh, 100%)'; style.maxHeight = 'min(90vw, 100%)' }
      return style
    }
  },
  methods: {
    getSectionSettings(key) { const section = this.pageContent.sections.find((item) => item.key === key); return section ? section.settings || {} : {} },
    getSectionItems(key) {
      const section = this.pageContent.sections.find((item) => item.key === key)
      return section && Array.isArray(section.items) ? section.items.map((item) => ({ ...(item.data || {}), id: item.id, type: item.type, itemName: item.name })) : []
    },
    isInternalRoute(url) { return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//') },
    itemAttachments(item) {
      const attachments = Array.isArray(item && item.attachments) ? item.attachments.filter((attachment) => attachment && (attachment.src || attachment.url || attachment.path)).map((attachment) => ({ ...attachment, src: attachment.src || attachment.url || attachment.path })) : []
      if (attachments.length) return attachments
      const fallbackSrc = item && item.src ? item.src : (item && item.url && item.url !== '#' ? item.url : '')
      if (fallbackSrc) return [{ src: fallbackSrc, file_name: item.file_name || '', file_mime: item.file_mime || '', file_extension: item.file_extension || '' }]
      return []
    },
    imageAttachments(item) { return this.itemAttachments(item).filter((attachment) => this.isImage(attachment)) },
    previewableAttachments(item) { return this.itemAttachments(item).filter((attachment) => this.isImage(attachment) || this.isPdf(attachment)) },
    imageKey(item, index) { return `${item.id || item.title}-${index}` },
    isImage(item) { return Boolean(item && ((item.file_mime || '').toLowerCase().startsWith('image/') || [item.src, item.file_name, item.url].some((value) => /\.(png|jpe?g|webp|gif|svg)(?:[?#].*)?$/i.test(value || '')))) },
    isPdf(item) { return Boolean(item && (((item.file_mime || '').toLowerCase().includes('pdf')) || String(item.file_extension || '').toLowerCase().replace(/^\./, '') === 'pdf' || [item.src, item.file_name, item.url].some((value) => /\.pdf(?:[?#].*)?$/i.test(value || '')))) },
    itemKey(item, index) { return String(item && (item.id || item.title) || index) },
    fileKind(item) { const first = this.itemAttachments(item)[0] || item; const value = `${first.file_extension || ''} ${first.file_mime || ''} ${first.file_name || ''} ${first.url || ''}`.toLowerCase(); if (value.includes('pdf')) return 'pdf'; if (/doc|word/.test(value)) return 'word'; if (/xls|sheet|csv/.test(value)) return 'excel'; if (/ppt|presentation/.test(value)) return 'slides'; return 'file' },
    fileIcon(item) { const kind = this.fileKind(item); const label = { pdf: 'PDF', word: 'DOC', excel: 'XLS', slides: 'PPT', file: 'FILE' }[kind]; return `<span class="cb-file-icon__mark">${label}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 2.8h8l4 4V21H6z"/><path d="M14 2.8v4h4"/><path d="M9 12h6M9 16h6"/></svg>` },
    openViewer(item, attachmentOrIndex = 0) {
      const attachments = this.previewableAttachments(item)
      if (!attachments.length) return
      this.viewerItem = item
      this.viewerAttachments = attachments
      const index = typeof attachmentOrIndex === 'number' ? attachmentOrIndex : attachments.findIndex((attachment) => attachment.src === attachmentOrIndex.src)
      this.viewerIndex = Math.min(Math.max(index, 0), attachments.length - 1)
      this.resetImageView()
      this.viewerOpen = true
      this.$nextTick(() => { if (this.$refs.viewerClose) this.$refs.viewerClose.focus() })
    },
    closeViewer() { this.viewerOpen = false; this.viewerItem = null; this.viewerAttachments = []; this.viewerIndex = 0; this.resetImageView() },
    showPreviousPreview() { if (this.viewerAttachments.length > 1) { this.viewerIndex = (this.viewerIndex - 1 + this.viewerAttachments.length) % this.viewerAttachments.length; this.resetImageView() } },
    showNextPreview() { if (this.viewerAttachments.length > 1) { this.viewerIndex = (this.viewerIndex + 1) % this.viewerAttachments.length; this.resetImageView() } },
    setImageZoom(value) { this.imageZoom = Math.min(5, Math.max(1, Math.round(value * 100) / 100)) },
    zoomIn() { this.setImageZoom(this.imageZoom + 0.25) },
    zoomOut() { this.setImageZoom(this.imageZoom - 0.25); if (this.imageZoom === 1) { this.imageOffsetX = 0; this.imageOffsetY = 0 } },
    zoomWithWheel(event) { this.setImageZoom(this.imageZoom + (event.deltaY < 0 ? 0.2 : -0.2)); if (this.imageZoom === 1) { this.imageOffsetX = 0; this.imageOffsetY = 0 } },
    toggleImageZoom() { if (this.imageZoom > 1) this.resetImageView(); else this.setImageZoom(2) },
    rotateImage() { this.imageRotation = (this.imageRotation + 90) % 360 },
    resetImageView() { this.imageZoom = 1; this.imageRotation = 0; this.imageOffsetX = 0; this.imageOffsetY = 0; this.imageDrag = null; this.imagePointers = {}; this.pinchState = null },
    startImageInteraction(event) {
      const image = event.currentTarget
      if (event.pointerType === 'touch') {
        this.$set(this.imagePointers, event.pointerId, { x: event.clientX, y: event.clientY })
        const pointers = Object.values(this.imagePointers)
        if (pointers.length >= 2) {
          this.imageDrag = null
          this.pinchState = { distance: pointerDistance(pointers[0], pointers[1]), zoom: this.imageZoom }
        } else if (this.imageZoom > 1) {
          this.imageDrag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, offsetX: this.imageOffsetX, offsetY: this.imageOffsetY }
        }
      } else if (event.button === 0 && this.imageZoom > 1) {
        this.imageDrag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, offsetX: this.imageOffsetX, offsetY: this.imageOffsetY }
      }
      if (this.imageZoom > 1 || event.pointerType === 'touch') {
        try { image.setPointerCapture(event.pointerId) } catch (error) {}
      }
    },
    moveImageInteraction(event) {
      if (event.pointerType === 'touch' && this.imagePointers[event.pointerId]) {
        this.$set(this.imagePointers, event.pointerId, { x: event.clientX, y: event.clientY })
        const pointers = Object.values(this.imagePointers)
        if (pointers.length >= 2 && this.pinchState) {
          this.setImageZoom(this.pinchState.zoom * pointerDistance(pointers[0], pointers[1]) / this.pinchState.distance)
          if (this.imageZoom === 1) { this.imageOffsetX = 0; this.imageOffsetY = 0 }
          return
        }
      }
      if (this.imageDrag && this.imageDrag.pointerId === event.pointerId) {
        this.imageOffsetX = this.imageDrag.offsetX + event.clientX - this.imageDrag.x
        this.imageOffsetY = this.imageDrag.offsetY + event.clientY - this.imageDrag.y
      }
    },
    endImageInteraction(event) {
      if (event.pointerType === 'touch' && this.imagePointers[event.pointerId]) {
        this.$delete(this.imagePointers, event.pointerId)
        const remaining = Object.entries(this.imagePointers)
        this.pinchState = null
        if (remaining.length === 1 && this.imageZoom > 1) {
          const [pointerId, point] = remaining[0]
          this.imageDrag = { pointerId: Number(pointerId), x: point.x, y: point.y, offsetX: this.imageOffsetX, offsetY: this.imageOffsetY }
        } else {
          this.imageDrag = null
        }
      } else if (this.imageDrag && this.imageDrag.pointerId === event.pointerId) {
        this.imageDrag = null
      }
    },
    handleViewerKeydown(event) {
      if (!this.viewerOpen) return
      if (event.key === 'Escape') this.closeViewer()
      else if (event.key === 'ArrowLeft') this.showPreviousPreview()
      else if (event.key === 'ArrowRight') this.showNextPreview()
      else if (this.activePreview && this.isImage(this.activePreview) && (event.key === '+' || event.key === '=')) this.zoomIn()
      else if (this.activePreview && this.isImage(this.activePreview) && event.key === '-') this.zoomOut()
      else if (this.activePreview && this.isImage(this.activePreview) && event.key === '0') this.resetImageView()
      else if (this.activePreview && this.isImage(this.activePreview) && event.key.toLowerCase() === 'r') this.rotateImage()
    },
    async downloadAll(item, index) {
      const attachments = this.itemAttachments(item)
      if (!attachments.length) return
      const key = this.itemKey(item, index)
      this.downloadErrorKey = ''
      this.downloadingItemKey = key
      try {
        if (attachments.length === 1) {
          triggerDownload(attachments[0].src, attachments[0].file_name || fileNameFromUrl(attachments[0].src) || `${safeFileName(item.title)}${extensionFor(attachments[0])}`)
          return
        }
        const archive = new JSZip()
        const usedNames = new Set()
        for (let attachmentIndex = 0; attachmentIndex < attachments.length; attachmentIndex += 1) {
          const attachment = attachments[attachmentIndex]
          const response = await fetch(attachment.src, { credentials: 'same-origin' })
          if (!response.ok) throw new Error(`No se pudo descargar ${attachment.src}`)
          const baseName = attachment.file_name || fileNameFromUrl(attachment.src) || `archivo-${attachmentIndex + 1}${extensionFor(attachment)}`
          archive.file(uniqueFileName(baseName, usedNames), await response.blob())
        }
        const blob = await archive.generateAsync({ type: 'blob' })
        triggerBlobDownload(blob, `${safeFileName(item.title || 'informacion-postal')}.zip`)
      } catch (error) {
        this.downloadErrorKey = key
      } finally {
        this.downloadingItemKey = ''
      }
    },
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
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h13"></path><path d="m13 6 6 6-6 6"></path></svg>',
    document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h8l4 4v14H7z"></path><path d="M15 3v5h4"></path><path d="M10 13h6M10 17h6"></path></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 21h14"></path></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"></path><path d="M12 17h.01"></path></svg>'
  }
}

function safeFileName(value = '') {
  const cleaned = String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '')
  return cleaned || 'informacion-postal'
}

function fileNameFromUrl(value = '') {
  try {
    const pathname = new URL(value, 'http://localhost').pathname
    const name = pathname.split('/').filter(Boolean).pop() || ''
    return decodeURIComponent(name)
  } catch (error) {
    return ''
  }
}

function extensionFor(attachment = {}) {
  const name = attachment.file_name || attachment.src || ''
  const match = name.match(/\.[a-z0-9]{1,8}(?:[?#].*)?$/i)
  if (match) return match[0].replace(/[?#].*$/, '')
  const mime = (attachment.file_mime || '').toLowerCase()
  if (mime === 'application/pdf') return '.pdf'
  if (mime.startsWith('image/')) return `.${mime.slice(6).replace('jpeg', 'jpg')}`
  return ''
}

function uniqueFileName(value, usedNames) {
  const cleaned = String(value || 'archivo').replace(/[\\/:*?"<>|]/g, '-').replace(/^\.+/, '') || 'archivo'
  let candidate = cleaned
  let suffix = 2
  while (usedNames.has(candidate.toLowerCase())) {
    const dot = cleaned.lastIndexOf('.')
    candidate = dot > 0 ? `${cleaned.slice(0, dot)}-${suffix}${cleaned.slice(dot)}` : `${cleaned}-${suffix}`
    suffix += 1
  }
  usedNames.add(candidate.toLowerCase())
  return candidate
}

function pointerDistance(first, second) {
  const x = first.x - second.x
  const y = first.y - second.y
  return Math.max(1, Math.sqrt(x * x + y * y))
}

function triggerDownload(url, fileName) {
  const link = document.createElement('a')
  link.href = url
  link.download = fileName || ''
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function triggerBlobDownload(blob, fileName) {
  const url = URL.createObjectURL(blob)
  triggerDownload(url, fileName)
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/tramites.css"></style>
