<template>
  <section class="cb-section cb-market">
    <div class="cb-shell">
      <div class="cb-market-head">
        <div class="cb-panel-title cb-panel-title--market">
          <div class="cb-service-icon" v-html="icons.stamp"></div>
          <div>
            <h3>{{ content.title || 'Correos Market / Filatelia' }}</h3>
            <p>{{ content.subtitle || 'Descubre nuestra coleccion exclusiva de sellos y souvenirs' }}</p>
          </div>
        </div>
      </div>

      <div class="cb-market-grid">
        <article
          v-for="(product, index) in products"
          :key="product.title"
          class="cb-product-card"
          :class="{ 'is-flipped': flippedCard === index }"
        >
          <div
            class="cb-product-visual"
            role="button"
            tabindex="0"
            :aria-label="`Ver detalles de ${product.title}`"
            @click="toggleFlip(index)"
            @keydown.enter.prevent="toggleFlip(index)"
            @keydown.space.prevent="toggleFlip(index)"
          >
            <div class="cb-product-flip">
              <div class="cb-product-flip__inner">
                <div class="cb-product-flip__face cb-product-flip__face--front">
                  <div class="cb-product-stamp">
                    <div class="cb-product-stamp__frame">
                      <img :src="product.image" :alt="product.title" class="cb-product-image">
                    </div>
                    <div class="cb-product-stamp__caption">
                      <span class="cb-product-stamp__series">{{ product.series }}</span>
                      <span class="cb-product-stamp__year">{{ product.year }}</span>
                    </div>
                  </div>
                </div>
                <div class="cb-product-flip__face cb-product-flip__face--back">
                  <div class="cb-product-back">
                    <span class="cb-product-back__eyebrow">{{ product.year }}</span>
                    <h5>{{ product.title }}</h5>
                    <p>{{ product.description }}</p>
                    <span class="cb-product-back__meta">{{ product.series }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="cb-product-content">
            <div class="cb-product-meta">
              <span>{{ product.price }}</span>
              <button type="button" class="cb-cart-btn" aria-label="Anadir al carrito" v-html="icons.cart"></button>
            </div>
          </div>
        </article>
      </div>

      <a :href="content.view_all_url || '#'" class="cb-view-all cb-view-all--market-end">{{ content.view_all_label || 'Ver todos los productos ->' }}</a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeMarket',
  data() {
    return {
      flippedCard: null
    }
  },
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
    }
  },
  methods: {
    toggleFlip(index) {
      this.flippedCard = this.flippedCard === index ? null : index
    }
  }
}
</script>
