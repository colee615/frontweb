<template>
  <section class="cb-app-banner">
    <div class="cb-app-banner-stage">
      <transition name="cb-app-banner-fade" mode="out-in">
        <div
          :key="activeSlideKey"
          class="cb-app-banner-slide"
          :style="activeSlideStyle"
          role="img"
          :aria-label="activeSlide.title || 'Banner promocional'"
        ></div>
      </transition>

      <div v-if="hasMultipleSlides" class="cb-app-banner-controls">
        <button type="button" class="cb-app-banner-btn" aria-label="Banner anterior" @click="goPrev">‹</button>
        <div class="cb-app-banner-dots">
          <button
            v-for="(slide, index) in normalizedSlides"
            :key="slide.key"
            type="button"
            class="cb-app-banner-dot"
            :class="{ 'is-active': index === activeIndex }"
            :aria-label="`Ir al banner ${index + 1}`"
            @click="goTo(index)"
          ></button>
        </div>
        <button type="button" class="cb-app-banner-btn" aria-label="Siguiente banner" @click="goNext">›</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeAppBanner',
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
      activeIndex: 0,
      rotationTimer: null
    }
  },
  computed: {
    normalizedSlides() {
      return (Array.isArray(this.slides) ? this.slides : [])
        .filter((slide) => slide && slide.image)
        .map((slide, index) => ({
          key: slide.id || slide.title || slide.image || `app-banner-${index}`,
          title: slide.title || `Banner ${index + 1}`,
          image: slide.image,
          durationSeconds: Math.max(1, Number.parseInt(slide.duration_seconds, 10) || 5)
        }))
    },
    hasMultipleSlides() {
      return this.normalizedSlides.length > 1
    },
    activeSlide() {
      return this.normalizedSlides[this.activeIndex] || this.normalizedSlides[0] || {}
    },
    activeSlideKey() {
      return `${this.activeSlide.key}-${this.activeIndex}`
    },
    activeSlideStyle() {
      if (!this.activeSlide.image) {
        return {}
      }

      return {
        backgroundImage: `url('${this.activeSlide.image}')`
      }
    }
  },
  mounted() {
    this.startRotation()
  },
  watch: {
    slides: {
      deep: true,
      handler() {
        this.activeIndex = 0
        this.startRotation()
      }
    }
  },
  beforeDestroy() {
    this.clearRotation()
  },
  methods: {
    clearRotation() {
      clearTimeout(this.rotationTimer)
      this.rotationTimer = null
    },
    startRotation() {
      this.clearRotation()

      if (!this.hasMultipleSlides) {
        return
      }

      const duration = (this.activeSlide.durationSeconds || 5) * 1000

      this.rotationTimer = setTimeout(() => {
        this.goNext(true)
      }, duration)
    },
    goTo(index) {
      this.activeIndex = index
      this.startRotation()
    },
    goNext(fromTimer = false) {
      if (!this.hasMultipleSlides) {
        return
      }

      this.activeIndex = (this.activeIndex + 1) % this.normalizedSlides.length

      if (!fromTimer) {
        this.startRotation()
      } else {
        this.startRotation()
      }
    },
    goPrev() {
      if (!this.hasMultipleSlides) {
        return
      }

      this.activeIndex = (this.activeIndex - 1 + this.normalizedSlides.length) % this.normalizedSlides.length
      this.startRotation()
    }
  }
}
</script>
