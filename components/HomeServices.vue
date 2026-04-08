<template>
  <section class="cb-section cb-section--tight">
    <div class="cb-shell">
      <div class="cb-section-heading">
        <h2>{{ content.title || '' }}</h2>
        <p>{{ content.subtitle || '' }}</p>
      </div>

      <div class="cb-services-grid">
        <article v-for="(service, index) in services" :id="`home-service-item-${service.id || index}`" :key="service.title" class="cb-service-card">
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
  }
}
</script>
