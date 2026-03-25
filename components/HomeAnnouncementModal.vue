<template>
  <transition name="cb-modal-fade">
    <div
      v-if="isOpen && isEnabled && hasPoster"
      class="cb-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="content.modal_title || 'Mensaje informativo'"
    >
      <div class="cb-modal__backdrop" @click="handleClose"></div>

      <div class="cb-modal__dialog">
        <div v-if="content.poster_image" class="cb-modal__poster-shell">
          <button
            type="button"
            class="cb-modal__close"
            :aria-label="content.close_label || 'Cerrar mensaje'"
            @click="handleClose"
          >
            x
          </button>

          <div class="cb-modal__poster-wrap">
            <div class="cb-modal__poster-frame">
              <div class="cb-modal__poster-flag"></div>
              <img
                class="cb-modal__poster"
                :src="content.poster_image"
                :alt="content.poster_alt || content.modal_title || 'Invitacion destacada'"
              >
              <div v-if="content.poster_title || content.poster_caption" class="cb-modal__poster-meta">
                <p v-if="content.poster_title" class="cb-modal__poster-title">{{ content.poster_title }}</p>
                <p v-if="content.poster_caption" class="cb-modal__poster-caption">{{ content.poster_caption }}</p>
              </div>
            </div>
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
    logoUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    isEnabled() {
      return this.toBoolean(this.content.enabled, false)
    },
    shouldShowOnce() {
      return this.toBoolean(this.content.show_once, true)
    },
    storageKey() {
      const baseKey = this.content.storage_key || 'cb-home-announcement-modal'
      return `${baseKey}:${this.visibilitySignature}`
    },
    visibilitySignature() {
      return [
        this.content.poster_image || '',
        this.content.poster_title || '',
        this.content.poster_caption || '',
        this.content.title || '',
        this.content.event_title || '',
        this.content.event_subtitle || '',
        this.content.event_date || '',
        this.content.event_time || '',
        this.content.primary_button_url || '',
        this.content.secondary_button_url || ''
      ]
        .join('|')
        .trim() || 'default'
    },
    hasPoster() {
      return Boolean(this.content.poster_image)
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
    }
  },
  methods: {
    syncVisibility() {
      if (!this.isEnabled) {
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
