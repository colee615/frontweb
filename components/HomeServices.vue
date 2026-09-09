<template>
  <section class="cb-section cb-section--tight">
    <div class="cb-shell">
      <div class="cb-section-heading">
        <h2>{{ content.title || '' }}</h2>
        <p>{{ content.subtitle || '' }}</p>
      </div>

      <div class="cb-services-grid">
        <article v-for="(service, index) in services" :id="`home-service-item-${service.id || index}`" :key="service.title" class="cb-service-card">
          <component
            v-if="resolveServiceRoute(service)"
            :is="isInternalRoute(resolveServiceRoute(service)) ? 'nuxt-link' : 'a'"
            class="cb-service-card__route"
            v-bind="linkAttrs(resolveServiceRoute(service))"
            :aria-label="`Ir a ${service.title}`"
          />
          <div class="cb-service-card__top">
            <div class="cb-service-icon">
              <img
                v-if="service.iconImage"
                :src="service.iconImage"
                :alt="service.title"
                loading="lazy"
              >
              <span v-else v-html="icons[service.icon]"></span>
            </div>
          </div>
          <div class="cb-service-body">
            <span class="cb-service-kicker">{{ content.kicker || '' }}</span>
            <h3>{{ service.title }}</h3>
            <p>{{ service.text }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeServices',
  props: {
    services: {
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
    resolveServiceRoute(service) {
      const configuredUrl = this.normalizeServiceUrl(service.url)

      if (configuredUrl) {
        return configuredUrl
      }

      const title = this.normalizeServiceTitle(service.title)

      if (title.includes('ems')) {
        return '/ems'
      }

      if (title.includes('delivery')) {
        return '/deliveryexpress'
      }

      if (title.includes('correspondencia') || title.includes('eca')) {
        return '/correspondencia-agrupada'
      }

      if (title.includes('encomienda')) {
        return '/encomienda'
      }

      if (title.includes('casilla')) {
        return '/casillas'
      }

      if (title.includes('prioritario') || title.includes('prioritaria')) {
        return '/eca'
      }

      return ''
    },
    normalizeServiceTitle(value) {
      return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    },
    normalizeServiceUrl(value) {
      const url = String(value || '').trim()
      return url && url !== '#' ? url : ''
    },
    isInternalRoute(url) {
      return /^\/(?!\/)/.test(url)
    },
    linkAttrs(url) {
      if (this.isInternalRoute(url)) {
        return { to: url }
      }

      return {
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    }
  }
}
</script>

<style scoped>
.cb-service-card {
  position: relative;
}

.cb-service-card__route {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: inherit;
}

.cb-service-card__top,
.cb-service-body {
  position: relative;
  z-index: 1;
}
</style>
