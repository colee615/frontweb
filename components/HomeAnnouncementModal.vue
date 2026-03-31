<template>
  <transition name="cb-modal-fade">
    <div
      v-if="isOpen && isEnabled && hasSlides"
      class="cb-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="content.modal_title || 'Mensaje informativo'"
    >
      <div class="cb-modal__backdrop" @click="handleClose"></div>

      <div class="cb-modal__dialog">
        <div class="cb-modal__poster-shell" :class="{ 'has-multiple': hasMultipleSlides }">
          <button
            type="button"
            class="cb-modal__close"
            :aria-label="content.close_label || 'Cerrar mensaje'"
            @click="handleClose"
          >
            x
          </button>

          <div v-if="hasMultipleSlides" class="cb-modal__stack">
            <button
              v-for="(slide, index) in stackSlides"
              :key="`${slide.key}-stack-${index}`"
              type="button"
              class="cb-modal__stack-card"
              :class="[`cb-modal__stack-card--level-${index + 1}`]"
              :style="stackCardStyle(index)"
              :aria-label="`Mostrar popup ${slide.position + 1}`"
              @click="goTo(slide.position)"
            >
              <img
                class="cb-modal__stack-poster"
                :src="slide.poster_image"
                :alt="slide.poster_alt || 'Popup institucional'"
              >
            </button>
          </div>

          <div class="cb-modal__poster-wrap">
            <transition :name="transitionName" mode="out-in">
              <div :key="activeSlideKey" class="cb-modal__poster-frame cb-modal__poster-frame--deck">
                <div class="cb-modal__poster-flag"></div>
                <img
                  class="cb-modal__poster"
                  :src="activeSlide.poster_image"
                  :alt="activeSlide.poster_alt || content.modal_title || 'Invitacion destacada'"
                >
              </div>
            </transition>
          </div>

          <div v-if="hasMultipleSlides" class="cb-modal__deck-nav">
            <button type="button" class="cb-modal__deck-btn" aria-label="Anterior" @click="goPrev">
              ‹
            </button>
            <div class="cb-modal__deck-dots">
              <button
                v-for="(slide, index) in normalizedSlides"
                :key="slide.key"
                type="button"
                class="cb-modal__deck-dot"
                :class="{ 'is-active': index === activeIndex }"
                :aria-label="`Ir al popup ${index + 1}`"
                @click="goTo(index)"
              ></button>
            </div>
            <button type="button" class="cb-modal__deck-btn" aria-label="Siguiente" @click="goNext">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'HomeAnnouncementModal',
  props: {
    content: {
      type: Object,
      default: () => ({})
    },
    slides: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isOpen: false,
      activeIndex: 0,
      transitionName: 'cb-modal-card-next'
    }
  },
  computed: {
    isEnabled() {
      return this.toBoolean(this.content.enabled, false)
    },
    shouldShowOnce() {
      return this.toBoolean(this.content.show_once, true)
    },
    normalizedSlides() {
      const items = Array.isArray(this.slides) ? this.slides : []

      return items
        .filter((slide) => slide && slide.poster_image)
        .map((slide, index) => ({
          key: slide.id || slide.title || slide.poster_image || `slide-${index}`,
          poster_image: slide.poster_image,
          poster_alt: slide.poster_alt || 'Comunicado institucional',
          poster_title: slide.poster_title || slide.title || '',
          poster_caption: slide.poster_caption || ''
        }))
    },
    hasSlides() {
      return this.normalizedSlides.length > 0
    },
    hasMultipleSlides() {
      return this.normalizedSlides.length > 1
    },
    activeSlide() {
      return this.normalizedSlides[this.activeIndex] || this.normalizedSlides[0] || {}
    },
    stackSlides() {
      if (!this.hasMultipleSlides) {
        return []
      }

      const maxVisibleCards = Math.min(2, this.normalizedSlides.length - 1)

      return Array.from({ length: maxVisibleCards }, (_, index) => index + 1)
        .map((offset) => {
          const position = (this.activeIndex + offset) % this.normalizedSlides.length
          const slide = this.normalizedSlides[position]

          return slide
            ? {
                ...slide,
                position
              }
            : null
        })
        .filter((slide) => slide && slide.position !== this.activeIndex)
        .filter((slide) => slide.poster_image)
    },
    activeSlideKey() {
      return `${this.activeSlide.key}-${this.activeIndex}`
    },
    storageKey() {
      const baseKey = this.content.storage_key || 'cb-home-announcement-modal'
      return `${baseKey}:${this.visibilitySignature}`
    },
    visibilitySignature() {
      return this.normalizedSlides
        .map((slide) => [slide.poster_image, slide.poster_title, slide.poster_caption].join('|'))
        .join('::')
        .trim() || 'default'
    }
  },
  mounted() {
    this.syncVisibility()
  },
  watch: {
    content: {
      deep: true,
      handler() {
        this.syncVisibility()
      }
    },
    slides: {
      deep: true,
      handler() {
        this.syncVisibility()
      }
    }
  },
  methods: {
    syncVisibility() {
      this.activeIndex = 0

      if (!this.isEnabled || !this.hasSlides) {
        this.isOpen = false
        return
      }

      if (process.client && this.shouldShowOnce && window.localStorage.getItem(this.storageKey) === 'hidden') {
        this.isOpen = false
        return
      }

      this.isOpen = true
    },
    handleClose() {
      this.isOpen = false

      if (process.client && this.shouldShowOnce) {
        window.localStorage.setItem(this.storageKey, 'hidden')
      }
    },
    goTo(index) {
      if (!this.hasMultipleSlides) {
        return
      }

      this.transitionName = index > this.activeIndex ? 'cb-modal-card-next' : 'cb-modal-card-prev'
      this.activeIndex = index
    },
    goNext() {
      this.goTo((this.activeIndex + 1) % this.normalizedSlides.length)
    },
    goPrev() {
      this.goTo((this.activeIndex - 1 + this.normalizedSlides.length) % this.normalizedSlides.length)
    },
    stackCardStyle(index) {
      const revealOffsets = [
        { right: '-34px', bottom: '16px' },
        { right: '-62px', bottom: '40px' }
      ]

      return revealOffsets[index] || revealOffsets[revealOffsets.length - 1]
    },
    toBoolean(value, fallback) {
      if (typeof value === 'boolean') {
        return value
      }

      if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase()

        if (['1', 'true', 'si', 'yes'].includes(normalized)) {
          return true
        }

        if (['0', 'false', 'no'].includes(normalized)) {
          return false
        }
      }

      return fallback
    }
  }
}
</script>
