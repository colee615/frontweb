<template>
  <section class="cb-tools">
    <div class="cb-shell cb-tools-grid">
      <article class="cb-panel cb-panel--map">
        <div class="cb-panel-title">
          <div class="cb-panel-icon-plain" v-html="icons.pin"></div>
          <div>
            <h3>{{ content.map_title || 'Mapa de Oficinas' }}</h3>
            <p>{{ content.map_text || 'Encuentra la oficina de Correos más cercana a tu ubicación' }}</p>
          </div>
        </div>

        <div class="cb-map-visual">
          <HomeBoliviaMap :offices="offices" />
        </div>

        <button type="button" class="cb-secondary-btn">{{ content.map_button_label || 'Ver Todas las Oficinas' }}</button>
      </article>

      <article class="cb-panel cb-panel--calculator">
        <div class="cb-panel-title">
          <div class="cb-panel-icon-plain" v-html="icons.calculator"></div>
          <div>
            <h3>{{ content.calculator_title || 'Calculadora de Tarifas' }}</h3>
            <p>{{ content.calculator_text || 'Calcula el costo de tu envio de manera rapida' }}</p>
          </div>
        </div>

        <div class="cb-calculator-visual">
          <form class="cb-calculator-form">
            <div class="cb-calculator-form__fields">
              <label for="origin">{{ content.origin_label || 'Ciudad de Origen' }}</label>
              <select id="origin">
                <option>{{ content.origin_placeholder || 'Selecciona una ciudad' }}</option>
              </select>

              <label for="destination">{{ content.destination_label || 'Ciudad de Destino' }}</label>
              <select id="destination">
                <option>{{ content.destination_placeholder || 'Selecciona una ciudad' }}</option>
              </select>

              <label for="weight">{{ content.weight_label || 'Peso (kg)' }}</label>
              <input id="weight" type="text" :placeholder="content.weight_placeholder || 'Ej: 2.5'">
            </div>
          </form>
        </div>

        <button type="button" class="cb-primary-btn cb-primary-btn--full">{{ content.calculate_button_label || 'Calcular Tarifa' }}</button>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeTools',
  props: {
    icons: {
      type: Object,
      required: true
    },
    content: {
      type: Object,
      default: () => ({})
    },
    offices: {
      type: Array,
      default: () => []
    }
  }
}
</script>
