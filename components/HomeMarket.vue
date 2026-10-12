<template>
  <section class="cb-section cb-market">
    <div class="cb-shell">
      <div class="cb-market-head">
        <div class="cb-panel-title cb-panel-title--market">
          <div class="cb-service-icon" v-html="icons.stamp"></div>
          <div>
            <h3 v-if="content.title">{{ content.title }}</h3>
            <p v-if="content.subtitle">{{ content.subtitle }}</p>
          </div>
        </div>

        <div v-if="maxSlide > 0" class="cb-market-carousel-controls" aria-label="Controles del carrusel">
          <span class="cb-market-carousel-count" aria-live="off">
            {{ String(currentSlide + 1).padStart(2, '0') }} / {{ String(products.length).padStart(2, '0') }}
          </span>
          <button
            type="button"
            class="cb-market-carousel-arrow"
            aria-label="Productos anteriores"
            @click="moveCarousel(-1)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button
            type="button"
            class="cb-market-carousel-arrow"
            aria-label="Más productos"
            @click="moveCarousel(1)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      <div
        v-if="products.length"
        class="cb-market-carousel"
        role="region"
        aria-label="Vitrina de productos filatélicos"
        @mouseenter="setAutoplayHold('pointer', true)"
        @mouseleave="setAutoplayHold('pointer', false)"
        @focusin="setAutoplayHold('focus', true)"
        @focusout="handleCarouselFocusOut"
        @touchstart.passive="setAutoplayHold('touch', true)"
        @touchend="releaseTouchHold"
        @touchcancel="releaseTouchHold"
      >
        <div
          ref="carouselViewport"
          class="cb-market-carousel__viewport"
          :style="{ '--cb-market-card-width': cardWidth ? `${cardWidth}px` : null }"
          tabindex="0"
          @scroll.passive="updateCurrentSlide"
        >
          <div ref="carouselTrack" class="cb-market-loop-track">
            <div
              v-for="copyIndex in loopCopiesList"
              :key="`market-loop-${copyIndex}`"
              class="cb-market-grid"
              :class="{ 'cb-market-grid--duplicate': copyIndex !== centerCopy }"
              :aria-hidden="copyIndex !== centerCopy ? 'true' : null"
            >
              <component
                :is="isProductPurchasable(product) ? 'a' : 'article'"
                v-for="(product, index) in products"
                :key="`${copyIndex}-${product.id || product.catalogCode || product.title}`"
                :id="copyIndex === centerCopy ? `home-market-item-${product.id || index}` : null"
                :href="isProductPurchasable(product) ? product.addToCartUrl : undefined"
                :target="isProductPurchasable(product) ? '_blank' : undefined"
                :rel="isProductPurchasable(product) ? 'noopener noreferrer' : undefined"
                :tabindex="copyIndex === centerCopy ? null : -1"
                class="cb-product-card cb-product-card--carousel"
                :class="{ 'is-carousel-active': isProductActive(index), 'is-purchasable': isProductPurchasable(product) }"
                :role="isProductPurchasable(product) ? null : 'group'"
                aria-roledescription="producto"
                :aria-label="`${product.title}, ${index + 1} de ${products.length}`"
              >
              <div class="cb-product-card__top">
                <span class="cb-product-badge">
                  <span class="cb-product-badge__icon" v-html="icons.stamp"></span>
                  {{ product.collection || product.series || 'Colección postal' }}
                </span>
              </div>

              <div
                class="cb-product-visual"
                aria-hidden="true"
              >
                <span class="cb-product-flip">
                  <span class="cb-product-flip__inner">
                    <span class="cb-product-flip__face cb-product-flip__face--front">
                      <span class="cb-product-stamp">
                        <span class="cb-product-stamp__frame">
                          <img :src="product.image" :alt="product.title" class="cb-product-image" loading="lazy">
                        </span>
                      </span>
                    </span>
                    <span class="cb-product-flip__face cb-product-flip__face--back">
                      <span class="cb-product-back">
                        <span class="cb-product-back__icon" v-html="icons.stamp"></span>
                        <span class="cb-product-back__eyebrow">Ficha de colección</span>
                        <span class="cb-product-back__detail cb-product-back__detail--catalog">
                          <span>Código de catálogo</span>
                          <strong>{{ product.catalogCode || product.series || 'Edición oficial' }}</strong>
                        </span>
                        <span v-if="product.condition || product.dimensions" class="cb-product-back__detail">
                          <span>{{ product.condition ? 'Estado' : 'Dimensiones' }}</span>
                          <strong>{{ product.condition || product.dimensions }}</strong>
                        </span>
                        <span class="cb-product-back__meta">Toca para volver</span>
                      </span>
                    </span>
                  </span>
                </span>
              </div>

              <div class="cb-product-content">
                <h4>{{ product.title }}</h4>
                <p>{{ product.description }}</p>
              </div>

              <div class="cb-product-meta">
                <div class="cb-product-meta__price">
                  <span>{{ product.price }}</span>
                  <small v-if="product.year">Emisión {{ product.year }}</small>
                </div>
                <span class="cb-cart-btn" aria-hidden="true" v-html="icons.cart"></span>
              </div>
              </component>
            </div>
          </div>
        </div>

        <div v-if="maxSlide > 0" class="cb-market-carousel-dots" role="group" aria-label="Seleccionar posición del carrusel">
          <button
            v-for="slide in carouselSteps"
            :key="`market-slide-${slide}`"
            type="button"
            class="cb-market-carousel-dot"
            :class="{ 'is-active': currentSlide === slide }"
            :aria-label="`Mostrar productos desde el ${slide + 1}`"
            :aria-current="currentSlide === slide ? 'true' : null"
            @click="goToSlide(slide)"
          ></button>
        </div>
      </div>

      <p v-else class="cb-market-empty" role="status">
        {{ error ? 'No pudimos cargar la vitrina filatélica en este momento.' : 'No hay productos disponibles en la vitrina.' }}
      </p>

      <div class="cb-market-benefits" aria-label="Beneficios de Correos de Bolivia">
        <div>
          <span v-html="icons.truck"></span>
          <strong>Envíos seguros</strong>
          <small>a todo el país</small>
        </div>
        <div>
          <span v-html="icons.shield"></span>
          <strong>Productos originales</strong>
          <small>de Correos de Bolivia</small>
        </div>
        <div>
          <span v-html="icons.stamp"></span>
          <strong>Colección</strong>
          <small>nuestra historia</small>
        </div>
        <div>
          <span v-html="icons.heart"></span>
          <strong>Apoya la cultura</strong>
          <small>y el patrimonio</small>
        </div>
        <div class="cb-market-benefits__motto" aria-hidden="true">
          <b>Bolivia</b>
          <small>siempre más lejos</small>
          <i></i>
        </div>
      </div>

      <a
        v-if="content.view_all_label && content.view_all_url"
        :href="content.view_all_url"
        class="cb-view-all cb-view-all--market-end cb-view-all--hidden"
      >
        {{ content.view_all_label }}
      </a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeMarket',
  props: {
    products: {
      type: Array,
      required: true
    },
    icons: {
      type: Object,
      required: true
    },
    content: {
      type: Object,
      default: () => ({})
    },
    error: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      carouselFrame: null,
      previousAnimationTime: null,
      touchResumeTimer: null,
      pointerOverCarousel: false,
      focusWithinCarousel: false,
      touchingCarousel: false,
      cardWidth: 0,
      currentSlide: 0,
      slidesPerView: 4
    }
  },
  computed: {
    maxSlide() {
      return Math.max(0, this.products.length - 1)
    },
    carouselSteps() {
      return Array.from({ length: this.products.length }, (value, index) => index)
    },
    loopCopies() {
      if (this.products.length < 2) {
        return 1
      }

      return Math.max(3, 2 * Math.ceil(this.slidesPerView / this.products.length) + 1)
    },
    loopCopiesList() {
      return Array.from({ length: this.loopCopies }, (value, index) => index)
    },
    centerCopy() {
      return Math.floor(this.loopCopies / 2)
    }
  },
  watch: {
    products() {
      this.stopAutoplay()
      this.currentSlide = 0
      this.cardWidth = 0
      this.$nextTick(() => {
        this.refreshCarouselLayout(0)
      })
    }
  },
  mounted() {
    this.syncSlidesPerView()
    window.addEventListener('resize', this.syncSlidesPerView)
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.syncSlidesPerView)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    window.clearTimeout(this.touchResumeTimer)
    this.stopAutoplay()
  },
  methods: {
    isProductPurchasable(product) {
      return Boolean(product && product.addToCartUrl && product.inStock)
    },
    setAutoplayHold(reason, isHeld) {
      if (reason === 'pointer' && window.matchMedia && window.matchMedia('(hover: none)').matches) {
        return
      }

      if (reason === 'pointer') {
        this.pointerOverCarousel = isHeld
      } else if (reason === 'focus') {
        this.focusWithinCarousel = isHeld
      } else if (reason === 'touch') {
        this.touchingCarousel = isHeld
      }

      this.syncAutoplay()
    },
    releaseTouchHold() {
      window.clearTimeout(this.touchResumeTimer)
      this.touchResumeTimer = window.setTimeout(() => {
        this.touchingCarousel = false
        this.syncAutoplay()
      }, 800)
    },
    handleCarouselFocusOut(event) {
      if (event.relatedTarget && event.currentTarget.contains(event.relatedTarget)) {
        return
      }

      this.focusWithinCarousel = false
      this.syncAutoplay()
    },
    handleVisibilityChange() {
      this.syncAutoplay()
    },
    syncAutoplay() {
      const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const shouldPause = this.products.length < 2 ||
        this.pointerOverCarousel ||
        this.focusWithinCarousel ||
        this.touchingCarousel ||
        document.hidden ||
        prefersReducedMotion

      if (shouldPause) {
        this.stopAutoplay()
        return
      }

      if (this.carouselFrame === null) {
        this.previousAnimationTime = null
        this.carouselFrame = window.requestAnimationFrame(this.animateCarousel)
      }
    },
    stopAutoplay() {
      if (this.carouselFrame !== null) {
        window.cancelAnimationFrame(this.carouselFrame)
        this.carouselFrame = null
      }

      this.previousAnimationTime = null
    },
    animateCarousel(timestamp) {
      this.carouselFrame = null
      const viewport = this.$refs.carouselViewport
      const metrics = this.getLoopMetrics()
      if (!viewport || !metrics || !this.products.length) {
        return
      }

      const shouldPause = this.pointerOverCarousel || this.focusWithinCarousel || this.touchingCarousel || document.hidden
      if (shouldPause) {
        this.stopAutoplay()
        return
      }

      const elapsed = this.previousAnimationTime === null ? 0 : Math.min(timestamp - this.previousAnimationTime, 48)
      this.previousAnimationTime = timestamp
      const lowerLimit = metrics.distance * Math.max(0, this.centerCopy - 1)
      const upperLimit = metrics.distance * (this.centerCopy + 1)
      let nextPosition = viewport.scrollLeft + elapsed * 0.038

      if (nextPosition >= upperLimit) {
        nextPosition -= metrics.distance
      }
      if (nextPosition < lowerLimit) {
        nextPosition += metrics.distance
      }

      viewport.scrollLeft = nextPosition
      this.updateCurrentSlide()
      this.carouselFrame = window.requestAnimationFrame(this.animateCarousel)
    },
    syncSlidesPerView() {
      const nextValue = window.innerWidth <= 560 ? 1 : (window.innerWidth <= 1023 ? 2 : 4)
      this.slidesPerView = nextValue
      this.$nextTick(() => {
        this.refreshCarouselLayout(this.currentSlide)
      })
    },
    moveCarousel(direction) {
      const viewport = this.$refs.carouselViewport
      const metrics = this.getLoopMetrics()
      if (!viewport || !metrics) {
        return
      }

      const lowerLimit = metrics.distance * Math.max(0, this.centerCopy - 1)
      const upperLimit = metrics.distance * (this.centerCopy + 1)
      let position = viewport.scrollLeft

      if (direction < 0 && position - metrics.step < lowerLimit) {
        position += metrics.distance
      } else if (direction > 0 && position + metrics.step >= upperLimit) {
        position -= metrics.distance
      }

      viewport.scrollLeft = position
      viewport.scrollTo({ left: position + direction * metrics.step, behavior: 'smooth' })
    },
    goToSlide(index, smooth = true) {
      const viewport = this.$refs.carouselViewport
      const metrics = this.getLoopMetrics()
      if (!viewport || !metrics || !this.products.length) {
        return
      }

      const nextIndex = ((index % this.products.length) + this.products.length) % this.products.length
      this.currentSlide = nextIndex
      const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const position = metrics.distance * this.centerCopy + nextIndex * metrics.step
      viewport.scrollTo({ left: position, behavior: smooth && !reduceMotion ? 'smooth' : 'auto' })
    },
    refreshCarouselLayout(index = 0) {
      const viewport = this.$refs.carouselViewport
      if (!viewport) {
        return
      }

      const styles = window.getComputedStyle(viewport)
      const gap = parseFloat(styles.columnGap) || 14
      const contentWidth = viewport.clientWidth - (parseFloat(styles.paddingLeft) || 0) - (parseFloat(styles.paddingRight) || 0)
      const nextCardWidth = Math.max(180, (contentWidth - gap * (this.slidesPerView - 1)) / this.slidesPerView)
      if (Math.abs(nextCardWidth - this.cardWidth) > 0.5) {
        this.cardWidth = nextCardWidth
      }

      this.$nextTick(() => {
        this.setLoopPosition(index)
        this.syncAutoplay()
      })
    },
    getLoopMetrics() {
      const viewport = this.$refs.carouselViewport
      const track = this.$refs.carouselTrack
      const group = track && track.querySelector('.cb-market-grid')
      const firstCard = group && group.querySelector('.cb-product-card')
      if (!viewport || !track || !group || !firstCard) {
        return null
      }

      const trackGap = parseFloat(window.getComputedStyle(track).columnGap) || parseFloat(window.getComputedStyle(track).gap) || 0
      const groupGap = parseFloat(window.getComputedStyle(group).columnGap) || parseFloat(window.getComputedStyle(group).gap) || 0
      const distance = group.getBoundingClientRect().width + trackGap
      const step = firstCard.getBoundingClientRect().width + groupGap
      return distance > 0 && step > 0 ? { distance, step } : null
    },
    setLoopPosition(index = 0) {
      const viewport = this.$refs.carouselViewport
      const metrics = this.getLoopMetrics()
      if (!viewport || !metrics) {
        return
      }

      const nextIndex = this.products.length ? ((index % this.products.length) + this.products.length) % this.products.length : 0
      viewport.scrollLeft = metrics.distance * this.centerCopy + nextIndex * metrics.step
      this.currentSlide = nextIndex
    },
    isProductActive(index) {
      return this.products.length > 0 && (index - this.currentSlide + this.products.length) % this.products.length < this.slidesPerView
    },
    updateCurrentSlide() {
      const viewport = this.$refs.carouselViewport
      const metrics = this.getLoopMetrics()
      if (!viewport || !metrics) {
        return
      }

      const lowerLimit = metrics.distance * Math.max(0, this.centerCopy - 1)
      const upperLimit = metrics.distance * (this.centerCopy + 1)
      if (viewport.scrollLeft < lowerLimit) {
        viewport.scrollLeft += metrics.distance
      } else if (viewport.scrollLeft >= upperLimit) {
        viewport.scrollLeft -= metrics.distance
      }

      const centerStart = metrics.distance * this.centerCopy
      const offset = ((viewport.scrollLeft - centerStart) % metrics.distance + metrics.distance) % metrics.distance
      this.currentSlide = Math.floor(offset / metrics.step) % this.products.length
    }
  }
}
</script>
