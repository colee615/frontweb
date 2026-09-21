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
      </div>

      <div class="cb-market-grid">
        <article
          v-for="(product, index) in products"
          :key="product.title"
          :id="`home-market-item-${product.id || index}`"
          class="cb-product-card"
          :class="{ 'is-flipped': flippedCard === index }"
        >
          <div class="cb-product-card__top">
            <span class="cb-product-badge">
              <span class="cb-product-badge__icon" v-html="icons.stamp"></span>
              {{ product.collection || product.category || product.series || collectionLabels[index % collectionLabels.length] }}
            </span>
            <button type="button" class="cb-product-favorite" :aria-label="`Agregar ${product.title} a favoritos`">
              <span aria-hidden="true">&#9825;</span>
            </button>
          </div>

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
                  </div>
                </div>
                <div class="cb-product-flip__face cb-product-flip__face--back">
                  <div class="cb-product-back">
                    <span class="cb-product-back__icon" v-html="icons.stamp"></span>
                    <span class="cb-product-back__eyebrow">Ficha de colección</span>
                    <div class="cb-product-back__detail">
                      <span>Distintivo postal</span>
                      <strong>{{ product.year || product.series || 'Edición oficial' }}</strong>
                    </div>
                    <p class="cb-product-back__note">Una pieza postal para conservar y compartir la historia de Bolivia.</p>
                    <span class="cb-product-back__meta">Toca para volver</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="cb-product-content">
            <h4>{{ product.title }}</h4>
            <p>{{ product.description }}</p>
          </div>

          <div class="cb-product-meta">
            <span>{{ product.price }}</span>
            <button type="button" class="cb-cart-btn" aria-label="Anadir al carrito" v-html="icons.cart"></button>
          </div>
        </article>
      </div>

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
          <strong>Collection</strong>
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
  data() {
    return {
      flippedCard: null,
      collectionLabels: [
        'Colección oficial',
        'Edición especial',
        'Serie clásica',
        'Edición institucional'
      ]
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
