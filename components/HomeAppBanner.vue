<template>
  <section class="cb-app-banner" :style="bannerStyle">
    <div class="cb-shell cb-app-inner">
      <div class="cb-app-copy">
        <div class="cb-app-icon" v-html="icons.phone"></div>
        <div>
          <h2>{{ content.title || 'Nueva App de Correos de Bolivia' }}</h2>
          <p>{{ content.text || 'Descargala ahora y gestiona tus envios desde tu movil con total comodidad' }}</p>
        </div>
      </div>

      <div class="cb-store-buttons">
        <a :href="content.app_store_url || '#'" class="cb-store-btn">
          <span class="cb-inline-icon" v-html="icons.download"></span>
          <span>{{ appStoreLines[0] }}<br>{{ appStoreLines[1] }}</span>
        </a>
        <a :href="content.play_store_url || '#'" class="cb-store-btn">
          <span class="cb-inline-icon" v-html="icons.download"></span>
          <span>{{ playStoreLines[0] }}<br>{{ playStoreLines[1] }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeAppBanner',
  props: {
    icons: {
      type: Object,
      required: true
    },
    content: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    appStoreLines() {
      return this.parseLines(this.content.app_store_label || 'Disponible en|App Store')
    },
    playStoreLines() {
      return this.parseLines(this.content.play_store_label || 'Disponible en|Google Play')
    },
    bannerStyle() {
      if (!this.content.background_image) {
        return {}
      }

      return {
        backgroundImage: `linear-gradient(rgba(254, 204, 54, 0.68), rgba(254, 204, 54, 0.68)), url('${this.content.background_image}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }
    }
  },
  methods: {
    parseLines(value) {
      const parts = value.split('|')
      return parts.length >= 2 ? parts : ['Disponible en', 'App Store']
    }
  }
}
</script>
