<template>
  <section class="cb-hero">
    <div class="cb-hero-media" v-if="normalizedSlides.length">
      <transition-group name="cb-hero-fade" tag="div">
        <div
          v-for="(slide, index) in normalizedSlides"
          v-show="activeSlide === index"
          :key="`${slide.src}-${index}`"
          class="cb-hero-media__item"
        >
          <video
            v-if="slide.media_type === 'video'"
            :ref="`hero-video-${index}`"
            class="cb-hero-media__asset"
            :src="slide.src"
            :poster="slide.poster || null"
            autoplay
            muted
            playsinline
            preload="metadata"
          ></video>
          <div
            v-else
            class="cb-hero-media__asset cb-hero-media__asset--image"
            :style="{ backgroundImage: `url('${slide.src}')` }"
          ></div>
        </div>
      </transition-group>
    </div>

    <div class="cb-hero-overlay"></div>
    <div class="cb-shell cb-hero-content">
      <div class="cb-hero-copy">
        <h1 v-if="titleLines[0] || titleLines[1]">
          <span v-if="titleLines[0]" class="cb-hero-copy__line">{{ titleLines[0] }}</span>
          <span v-if="titleLines[1]" class="cb-hero-copy__line">{{ titleLines[1] }}</span>
        </h1>
        <p v-if="content.subtitle">{{ content.subtitle }}</p>
      </div>

      <div class="cb-track-card">
        <h2 v-if="content.tracking_title">{{ content.tracking_title }}</h2>
        <p v-if="content.tracking_text">{{ content.tracking_text }}</p>
        <label v-if="content.tracking_label" for="hero-track">{{ content.tracking_label }}</label>
        <input
          id="hero-track"
          v-model.trim="trackingCode"
          type="text"
          :placeholder="content.tracking_placeholder || ''"
          @keydown.enter.prevent="openTracking"
        >
        <div class="cb-captcha">
          <div class="cb-captcha__head">
            <span class="cb-captcha__label">Verificacion de seguridad</span>
            <button type="button" class="cb-captcha__refresh" :disabled="captchaLoading" @click="generateCaptcha">Nuevo codigo</button>
          </div>
          <div class="cb-captcha__visual" :style="captchaStyle">
            <span
              v-for="(char, index) in captchaChars"
              :key="`${char}-${index}`"
              class="cb-captcha__char"
              :style="captchaCharStyle(index)"
            >{{ char }}</span>
            <span v-if="!captchaChars.length && captchaLoading" class="cb-captcha__char">...</span>
          </div>
          <p class="cb-captcha__hint">Escribe el codigo mostrado para continuar con la consulta.</p>
          <div class="cb-captcha__input-row">
            <input
              id="hero-captcha"
              v-model.trim="captchaAnswer"
              type="text"
              autocomplete="off"
              autocapitalize="characters"
              placeholder="Escribe el captcha"
              @keydown.enter.prevent="openTracking"
            >
            <button type="button" class="cb-captcha__submit" @click="openTracking">
              {{ content.tracking_button || 'Buscar' }}
            </button>
          </div>
          <p v-if="captchaError" class="cb-captcha__error">{{ captchaError }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function createCaptchaCode(length = 5) {
  let code = ''

  for (let index = 0; index < length; index += 1) {
    code += CAPTCHA_CHARS.charAt(Math.floor(Math.random() * CAPTCHA_CHARS.length))
  }

  return code
}

export default {
  name: 'HomeHero',
  props: {
    icons: {
      type: Object,
      required: true
    },
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
      activeSlide: 0,
      slideTimer: null,
      trackingCode: '',
      captchaAnswer: '',
      captchaExpected: '',
      captchaChallenge: '',
      captchaError: '',
      captchaLoading: false
    }
  },
  computed: {
    titleLines() {
      const title = this.content.title || ''

      if (!title.trim()) {
        return ['', '']
      }

      const lines = title.split('|')

      if (lines.length >= 2) {
        return [lines[0], lines.slice(1).join(' ')]
      }

      const words = title.split(' ')

      if (words.length === 5) {
        return [
          words.slice(0, 2).join(' '),
          words.slice(2).join(' ')
        ]
      }

      if (words.length === 4) {
        return [
          words.slice(0, 2).join(' '),
          words.slice(2).join(' ')
        ]
      }

      const midpoint = Math.ceil(words.length / 2)

      return [
        words.slice(0, midpoint).join(' '),
        words.slice(midpoint).join(' ') || ''
      ]
    },
    normalizedSlides() {
      return this.slides
        .filter((slide) => slide && slide.src)
        .map((slide) => ({
          ...slide,
          duration_seconds: this.normalizeDuration(slide.duration_seconds)
        }))
    },
    trackingBaseUrl() {
      return (this.$config && this.$config.trackingBaseUrl) || 'https://trackingbo.correos.gob.bo:8100'
    },
    trackingAccessUrl() {
      return `${this.trackingBaseUrl}/api/public/tracking/access`
    },
    trackingCaptchaUrl() {
      return `${this.trackingBaseUrl}/api/public/tracking/captcha`
    },
    captchaChars() {
      return this.captchaExpected.split('')
    },
    captchaStyle() {
      return {
        '--cb-captcha-tilt': `${this.captchaExpected.length * 2}deg`
      }
    }
  },
  watch: {
    normalizedSlides: {
      immediate: true,
      handler() {
        this.activeSlide = 0
        this.syncActiveVideo()
        this.setupRotation()
      }
    }
  },
  beforeDestroy() {
    this.clearRotation()
  },
  mounted() {
    this.generateCaptcha()
  },
  methods: {
    setupRotation() {
      this.clearRotation()

      if (this.normalizedSlides.length <= 1) {
        return
      }

      const currentSlide = this.normalizedSlides[this.activeSlide]
      const duration = this.normalizeDuration(currentSlide && currentSlide.duration_seconds)

      this.slideTimer = setTimeout(() => {
        this.goToNextSlide()
      }, duration * 1000)
    },
    clearRotation() {
      if (this.slideTimer) {
        clearTimeout(this.slideTimer)
        this.slideTimer = null
      }
    },
    goToNextSlide() {
      this.activeSlide = (this.activeSlide + 1) % this.normalizedSlides.length
      this.syncActiveVideo()
      this.setupRotation()
    },
    syncActiveVideo() {
      if (!process.client) {
        return
      }

      this.$nextTick(() => {
        this.normalizedSlides.forEach((slide, index) => {
          if (slide.media_type !== 'video') {
            return
          }

          const videoRef = this.$refs[`hero-video-${index}`]
          const video = Array.isArray(videoRef) ? videoRef[0] : videoRef

          if (!video) {
            return
          }

          if (index === this.activeSlide) {
            try {
              video.currentTime = 0
              const playPromise = video.play()

              if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {})
              }
            } catch (error) {
            }

            return
          }

          video.pause()
          video.currentTime = 0
        })
      })
    },
    normalizeDuration(value) {
      const parsed = parseInt(value, 10)

      if (Number.isNaN(parsed)) {
        return 5
      }

      return Math.min(Math.max(parsed, 1), 300)
    },
    async openTracking() {
      const code = this.trackingCode && this.trackingCode.trim()

      if (!code || !process.client) {
        return
      }

      if (!this.captchaAnswer.trim()) {
        this.captchaError = 'Completa correctamente el captcha para continuar.'
        return
      }

      this.captchaError = ''

      try {
        const response = await fetch(this.trackingAccessUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            codigo: code,
            captcha_answer: this.captchaAnswer,
            captcha_challenge: this.captchaChallenge
          })
        })

        const payload = await response.json()

        if (!response.ok) {
          if (payload && payload.captcha) {
            this.applyRemoteCaptcha(payload.captcha)
          } else {
            await this.generateCaptcha()
          }

          throw new Error(payload && payload.message ? payload.message : 'No se pudo validar el captcha.')
        }

        if (!payload.redirect_url) {
          throw new Error('No se pudo generar el acceso al tracking.')
        }

        window.open(payload.redirect_url, '_blank', 'noopener')
        this.captchaAnswer = ''
        await this.generateCaptcha()
      } catch (error) {
        this.captchaError = error && error.message ? error.message : 'No se pudo abrir el tracking.'
      }
    },
    async generateCaptcha() {
      this.captchaLoading = true

      try {
        const response = await fetch(this.trackingCaptchaUrl, {
          headers: {
            Accept: 'application/json'
          }
        })
        const payload = await response.json()

        if (!response.ok || !payload || !payload.challenge) {
          throw new Error('No se pudo cargar el captcha.')
        }

        this.applyRemoteCaptcha(payload)
      } catch (error) {
        this.captchaExpected = createCaptchaCode(5)
        this.captchaChallenge = ''
        this.captchaError = 'No se pudo conectar con el servicio de tracking.'
      } finally {
        this.captchaLoading = false
      }
    },
    applyRemoteCaptcha(payload) {
      this.captchaExpected = String(payload.pregunta || '').toUpperCase()
      this.captchaChallenge = String(payload.challenge || '')
      this.captchaError = ''
    },
    captchaCharStyle(index) {
      const rotations = [-12, 8, -6, 10, -9, 6]
      const offsets = [-1, 3, -2, 2, -3, 1]

      return {
        transform: `translateY(${offsets[index % offsets.length]}px) rotate(${rotations[index % rotations.length]}deg)`
      }
    }
  }
}
</script>
