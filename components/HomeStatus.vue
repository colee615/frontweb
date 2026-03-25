<template>
  <section class="cb-section cb-status">
    <div class="cb-shell cb-status-inner">
      <div class="cb-section-heading">
        <h2>{{ content.title || 'Estado de tu Envio' }}</h2>
        <p class="cb-status-subtitle">{{ content.subtitle || 'Ingresa tu numero de seguimiento para conocer el estado de tu paquete' }}</p>
      </div>

      <div class="cb-status-form">
        <input type="text" :placeholder="content.placeholder || 'Ej: PE123456789'">
        <button type="button" class="cb-primary-btn">
          <span class="cb-inline-icon" v-html="icons.search"></span>
          <span>{{ content.button_label || 'Rastrear' }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeStatus',
  props: {
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
