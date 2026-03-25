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
            class="cb-hero-media__asset"
            :src="slide.src"
            :poster="slide.poster || null"
            autoplay
            muted
            loop
            playsinline
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
        <h1>{{ titleLines[0] }}<br>{{ titleLines[1] }}</h1>
        <p>{{ content.subtitle || 'Servicio postal confiable, rapido y seguro' }}</p>
      </div>

      <div class="cb-track-card">
        <h2>{{ content.tracking_title || 'Rastrea tu Envio' }}</h2>
        <p>{{ content.tracking_text || 'Ingresa tu codigo de seguimiento para conocer el estado de tu paquete' }}</p>
        <label for="hero-track">{{ content.tracking_label || 'Codigo de seguimiento' }}</label>
        <input
          id="hero-track"
          v-model.trim="trackingCode"
          type="text"
          :placeholder="content.tracking_placeholder || 'Ej: PE123456789'"
          @keydown.enter.prevent="openTracking"
        >
        <div class="cb-captcha">
          <div class="cb-captcha__head">
            <span class="cb-captcha__label">Verificacion de seguridad</span>
            <button type="button" class="cb-captcha__refresh" @click="generateCaptcha">Nuevo codigo</button>
          </div>
          <div class="cb-captcha__visual" :style="captchaStyle">
            <span
              v-for="(char, index) in captchaChars"
              :key="`${char}-${index}`"
              class="cb-captcha__char"
              :style="captchaCharStyle(index)"
            >{{ char }}</span>
          </div>
          <p class="cb-captcha__hint">Escribe el codigo mostrado para continuar con la consulta.</p>
          <div class="cb-captcha__input-row">
            <input
              id="hero-captcha"
              v-model.trim="captchaAnswer"
              type="text"
              autocomplete="off"
              autocapitalize="characters"
              placeholder="ESCRIBE EL CAPTCHA"
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
const DEFAULT_SLIDES = [
  {
    media_type: 'image',
    src: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=80',
    poster: ''
  }
]

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
      captchaError: ''
    }
  },
  computed: {
    titleLines() {
      const title = this.content.title || 'Conectando Bolivia|con el Mundo'
      const lines = title.split('|')

      if (lines.length >= 2) {
        return [lines[0], lines.slice(1).join(' ')]
      }

      if (title.includes(' con el Mundo')) {
        return ['Conectando Bolivia', 'con el Mundo']
      }

      const words = title.split(' ')
      const midpoint = Math.ceil(words.length / 2)

      return [
        words.slice(0, midpoint).join(' '),
        words.slice(midpoint).join(' ') || ''
      ]
    },
    normalizedSlides() {
      const validSlides = this.slides.filter((slide) => slide && slide.src)
      return validSlides.length ? validSlides : DEFAULT_SLIDES
    },
    trackingBaseUrl() {
      return 'https://trackingbo.correos.gob.bo:8100/trackingbo'
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

      this.slideTimer = setInterval(() => {
        this.activeSlide = (this.activeSlide + 1) % this.normalizedSlides.length
      }, 5000)
    },
    clearRotation() {
      if (this.slideTimer) {
        clearInterval(this.slideTimer)
        this.slideTimer = null
      }
    },
    openTracking() {
      const code = this.trackingCode && this.trackingCode.trim()

      if (!code || !process.client) {
        return
      }

      if (!this.isCaptchaValid()) {
        this.captchaError = 'Completa correctamente el captcha para continuar.'
        return
      }

      this.captchaError = ''

      const trackingUrl = `${this.trackingBaseUrl}?codigo=${encodeURIComponent(code)}`
      window.open(trackingUrl, '_blank', 'noopener')
      this.captchaAnswer = ''
      this.generateCaptcha()
    },
    generateCaptcha() {
      this.captchaExpected = this.randomCaptchaCode(5)
      this.captchaError = ''
    },
    isCaptchaValid() {
      return this.captchaAnswer.toUpperCase() === this.captchaExpected
    },
    randomCaptchaCode(length) {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
      let code = ''

      for (let index = 0; index < length; index += 1) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }

      return code
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
