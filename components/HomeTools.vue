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
          <form class="cb-calculator-form" @submit.prevent="submitCalculator">
            <div class="cb-calculator-form__fields">
              <label for="calculator-category">{{ content.origin_label || 'Servicio' }}</label>
              <select
                id="calculator-category"
                v-model="form.category"
                :disabled="isSubmitting"
              >
                <option value="" disabled>
                  {{ content.origin_placeholder || 'Selecciona un servicio' }}
                </option>
                <option v-for="option in visibleServices" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>

              <label for="calculator-destination">{{ content.destination_label || 'Destino' }}</label>
              <select
                id="calculator-destination"
                v-model="form.destination"
                :disabled="isSubmitting || !filteredDestinations.length"
              >
                <option value="" disabled>
                  {{ destinationPlaceholder }}
                </option>
                <option v-for="option in filteredDestinations" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>

              <label for="calculator-weight">{{ content.weight_label || 'Peso (kg)' }}</label>
              <input
                id="calculator-weight"
                v-model.trim="form.weight"
                type="number"
                min="0.01"
                step="0.01"
                inputmode="decimal"
                :placeholder="content.weight_placeholder || 'Ej: 0.25'"
                :disabled="isSubmitting"
              >

              <div class="cb-calculator-dimensions">
                <div class="cb-calculator-dimension-field">
                  <label for="calculator-length">Largo (m)</label>
                  <input
                    id="calculator-length"
                    v-model.trim="form.length"
                    type="number"
                    min="0"
                    step="0.01"
                    inputmode="decimal"
                    placeholder="Opcional"
                    :disabled="isSubmitting"
                  >
                </div>

                <div class="cb-calculator-dimension-field">
                  <label for="calculator-width">Ancho (m)</label>
                  <input
                    id="calculator-width"
                    v-model.trim="form.width"
                    type="number"
                    min="0"
                    step="0.01"
                    inputmode="decimal"
                    placeholder="Opcional"
                    :disabled="isSubmitting"
                  >
                </div>

                <div class="cb-calculator-dimension-field">
                  <label for="calculator-height">Alto (m)</label>
                  <input
                    id="calculator-height"
                    v-model.trim="form.height"
                    type="number"
                    min="0"
                    step="0.01"
                    inputmode="decimal"
                    placeholder="Opcional"
                    :disabled="isSubmitting"
                  >
                </div>
              </div>

              <div class="cb-calculator-extras">
                <label class="cb-calculator-check">
                  <input v-model="form.certificado" type="checkbox" :disabled="isSubmitting">
                  <span>Paquete Certificado</span>
                </label>
                <label class="cb-calculator-check">
                  <input v-model="form.recibo" type="checkbox" :disabled="isSubmitting">
                  <span>Aviso de Recibo</span>
                </label>
              </div>

              <p v-if="calculatorError" class="cb-calculator-feedback cb-calculator-feedback--error">
                {{ calculatorError }}
              </p>

              <div class="cb-calculator-actions">
                <p class="cb-calculator-actions__hint">
                  La tarifa se mostrara en un resumen final.
                </p>

                <button type="submit" class="cb-primary-btn cb-primary-btn--full" :disabled="isSubmitting">
                  {{ isSubmitting ? 'Calculando...' : (content.calculate_button_label || 'Calcular Tarifa') }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </article>
    </div>

    <transition name="cb-modal-fade">
      <div
        v-if="showResultModal && calculatorResult"
        class="cb-calculator-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Resultado de tarifa"
      >
        <div class="cb-calculator-modal__backdrop" @click="closeResultModal"></div>

        <div class="cb-calculator-modal__dialog">
          <button type="button" class="cb-calculator-modal__close" aria-label="Cerrar resultado" @click="closeResultModal">
            x
          </button>

          <div class="cb-calculator-modal__header">
            <span class="cb-calculator-modal__eyebrow">Resultado de Cotizacion</span>
            <h3>Tarifa Postal Estimada</h3>
            <p>Consulta procesada correctamente para el servicio seleccionado.</p>
          </div>

          <div class="cb-calculator-modal__amount">
            <span>Monto</span>
            <strong>{{ formattedTariff }}</strong>
          </div>

          <dl class="cb-calculator-modal__details">
            <div>
              <dt>Servicio</dt>
              <dd>{{ selectedServiceLabel }}</dd>
            </div>
            <div>
              <dt>Destino</dt>
              <dd>{{ selectedDestinationLabel }}</dd>
            </div>
            <div>
              <dt>Peso</dt>
              <dd>{{ normalizedWeight }} kg</dd>
            </div>
          </dl>

          <div class="cb-calculator-modal__footer">
            <button type="button" class="cb-secondary-btn cb-calculator-modal__secondary" @click="closeResultModal">
              Cerrar
            </button>
            <button type="button" class="cb-primary-btn cb-calculator-modal__primary" @click="closeResultModal">
              Entendido
            </button>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
const SERVICE_OPTIONS = [
  { value: 'EMS NAT', label: 'EMS Nacional', visible: true },
  { value: 'EMS INT', label: 'EMS Internacional', visible: true },
  { value: 'MI ENCOMIENDA', label: 'Mi Encomienda Nacional', visible: true },
  { value: 'ENCOMIENDA', label: 'Encomienda Internacional', visible: true },
  { value: 'LC/AO NAT', label: 'LC/AO Nacional', visible: true },
  { value: 'LC/AO INT', label: 'LC/AO Internacional', visible: true },
  { value: 'ECA NAT', label: 'ECA Nacional', visible: true },
  { value: 'ECA INT', label: 'ECA Internacional', visible: true },
  { value: 'PLIEGOS NAT', label: 'Pliegos Oficiales Nacional', visible: true },
  { value: 'PLIEGOS INT', label: 'Pliegos Oficiales Internacional', visible: true },
  { value: 'SACAS M NAT', label: 'Sacas M Nacional', visible: true },
  { value: 'SACAS M INT', label: 'Sacas M Internacional', visible: true },
  { value: 'SUPER NAT', label: 'Super Express Nacional', visible: true },
  { value: 'SUPER DOC NAT', label: 'Super Express Internacional Documentos', visible: false },
  { value: 'SUPER PAQUE NAT', label: 'Super Express Internacional Paquetes', visible: false }
]

const DESTINATION_GROUPS = {
  locales: [
    { value: 'local_1', label: 'Area Urbana (Hasta 2.5 Km)' },
    { value: 'local_2', label: 'Area Urbana (Hasta 5 Km)' },
    { value: 'local_3', label: 'Area Urbana (Hasta 7.5 Km)' },
    { value: 'local_4', label: 'Area Urbana (Hasta 10 Km)' }
  ],
  nacionales: [
    { value: 'nacional_beni', label: 'Beni' },
    { value: 'nacional_chuquisaca', label: 'Chuquisaca' },
    { value: 'nacional_cochabamba', label: 'Cochabamba' },
    { value: 'nacional_la_paz', label: 'La Paz' },
    { value: 'nacional_oruro', label: 'Oruro' },
    { value: 'nacional_pando', label: 'Pando' },
    { value: 'nacional_potosi', label: 'Potosi' },
    { value: 'nacional_santa_cruz', label: 'Santa Cruz' },
    { value: 'nacional_tarija', label: 'Tarija' }
  ],
  capitales: [
    { value: 'cui_cap_chuquisaca', label: 'Chuquisaca' },
    { value: 'cui_cap_cochabamba', label: 'Cochabamba' },
    { value: 'cui_cap_la_paz', label: 'La Paz' },
    { value: 'cui_cap_oruro', label: 'Oruro' },
    { value: 'cui_cap_pando', label: 'Pando' },
    { value: 'cui_cap_potosi', label: 'Potosi' },
    { value: 'cui_cap_santa_cruz', label: 'Santa Cruz' },
    { value: 'cui_cap_tarija', label: 'Tarija' }
  ],
  especialesNacionales: [
    { value: 'cui_int', label: 'Cuidades Intermedias' },
    { value: 'cui1', label: 'Trinidad / Cobija' },
    { value: 'cui2', label: 'Riberalta / Guayaramerin' },
    { value: 'pro_dentro', label: 'Provincia Dentro Departamento' },
    { value: 'pro_otro', label: 'Provincia en Otro Departamento' }
  ],
  internacionales: [
    { value: 'dest_a_argentina', label: 'Argentina' },
    { value: 'dest_a_brasil', label: 'Brasil' },
    { value: 'dest_a_chile', label: 'Chile' },
    { value: 'dest_a_colombia', label: 'Colombia' },
    { value: 'dest_a_ecuador', label: 'Ecuador' },
    { value: 'dest_a_guyana', label: 'Guyana' },
    { value: 'dest_a_paraguay', label: 'Paraguay' },
    { value: 'dest_a_peru', label: 'Peru' },
    { value: 'dest_a_surinam', label: 'Surinam' },
    { value: 'dest_a_uruguay', label: 'Uruguay' },
    { value: 'dest_a_venezuela', label: 'Venezuela' },
    { value: 'dest_b_belice', label: 'Belice' },
    { value: 'dest_b_costa_rica', label: 'Costa Rica' },
    { value: 'dest_b_el_salvador', label: 'El Salvador' },
    { value: 'dest_b_guatemala', label: 'Guatemala' },
    { value: 'dest_b_honduras', label: 'Honduras' },
    { value: 'dest_b_nicaragua', label: 'Nicaragua' },
    { value: 'dest_b_panama', label: 'Panama' },
    { value: 'dest_b_antigua_y_barbuda', label: 'Antigua y Barbuda' },
    { value: 'dest_b_bahamas', label: 'Bahamas' },
    { value: 'dest_b_barbados', label: 'Barbados' },
    { value: 'dest_b_cuba', label: 'Cuba' },
    { value: 'dest_b_dominica', label: 'Dominica' },
    { value: 'dest_b_republica_dominicana', label: 'Republica Dominicana' },
    { value: 'dest_b_granada', label: 'Granada' },
    { value: 'dest_b_haiti', label: 'Haiti' },
    { value: 'dest_b_jamaica', label: 'Jamaica' },
    { value: 'dest_b_san_cristobal_y_nieves', label: 'San Cristobal y Nieves' },
    { value: 'dest_b_santa_lucia', label: 'Santa Lucia' },
    { value: 'dest_b_san_vicente_y_las_granadinas', label: 'San Vicente y las Granadinas' },
    { value: 'dest_b_trinidad_y_tobago', label: 'Trinidad y Tobago' },
    { value: 'dest_b_puerto_rico', label: 'Puerto Rico' },
    { value: 'dest_c_canada', label: 'Canada' },
    { value: 'dest_c_estados_unidos', label: 'Estados Unidos' },
    { value: 'dest_c_mexico', label: 'Mexico' },
    { value: 'dest_d_alemania', label: 'Alemania' },
    { value: 'dest_d_andorra', label: 'Andorra' },
    { value: 'dest_d_austria', label: 'Austria' },
    { value: 'dest_d_belgica', label: 'Belgica' },
    { value: 'dest_d_bielorrusia', label: 'Bielorrusia' },
    { value: 'dest_d_bosnia_y_herzegovina', label: 'Bosnia y Herzegovina' },
    { value: 'dest_d_bulgaria', label: 'Bulgaria' },
    { value: 'dest_d_chipre', label: 'Chipre' },
    { value: 'dest_d_croacia', label: 'Croacia' },
    { value: 'dest_d_dinamarca', label: 'Dinamarca' },
    { value: 'dest_d_eslovaquia', label: 'Eslovaquia' },
    { value: 'dest_d_eslovenia', label: 'Eslovenia' },
    { value: 'dest_d_espana', label: 'Espana' },
    { value: 'dest_d_estonia', label: 'Estonia' },
    { value: 'dest_d_finlandia', label: 'Finlandia' },
    { value: 'dest_d_francia', label: 'Francia' },
    { value: 'dest_d_grecia', label: 'Grecia' },
    { value: 'dest_d_hungria', label: 'Hungria' },
    { value: 'dest_d_irlanda', label: 'Irlanda' },
    { value: 'dest_d_islandia', label: 'Islandia' },
    { value: 'dest_d_italia', label: 'Italia' },
    { value: 'dest_d_kosovo', label: 'Kosovo' },
    { value: 'dest_d_letonia', label: 'Letonia' },
    { value: 'dest_d_liechtenstein', label: 'Liechtenstein' },
    { value: 'dest_d_lituania', label: 'Lituania' },
    { value: 'dest_d_luxemburgo', label: 'Luxemburgo' },
    { value: 'dest_d_macedonia_del_norte', label: 'Macedonia del Norte' },
    { value: 'dest_d_malta', label: 'Malta' },
    { value: 'dest_d_monaco', label: 'Monaco' },
    { value: 'dest_d_montenegro', label: 'Montenegro' },
    { value: 'dest_d_noruega', label: 'Noruega' },
    { value: 'dest_d_paises_bajos', label: 'Paises Bajos' },
    { value: 'dest_d_polonia', label: 'Polonia' },
    { value: 'dest_d_portugal', label: 'Portugal' },
    { value: 'dest_d_reino_unido', label: 'Reino Unido' },
    { value: 'dest_d_republica_checa', label: 'Republica Checa' },
    { value: 'dest_d_rumania', label: 'Rumania' },
    { value: 'dest_d_rusia', label: 'Rusia' },
    { value: 'dest_d_san_marino', label: 'San Marino' },
    { value: 'dest_d_serbia', label: 'Serbia' },
    { value: 'dest_d_suecia', label: 'Suecia' },
    { value: 'dest_d_suiza', label: 'Suiza' },
    { value: 'dest_d_ucrania', label: 'Ucrania' },
    { value: 'dest_d_vaticano', label: 'Vaticano' },
    { value: 'dest_d_arabia_saudita', label: 'Arabia Saudita' },
    { value: 'dest_d_barein', label: 'Barein' },
    { value: 'dest_d_catar', label: 'Catar' },
    { value: 'dest_d_emiratos_arabes_unidos', label: 'Emiratos Arabes Unidos' },
    { value: 'dest_d_irak', label: 'Irak' },
    { value: 'dest_d_iran', label: 'Iran' },
    { value: 'dest_d_israel', label: 'Israel' },
    { value: 'dest_d_jordania', label: 'Jordania' },
    { value: 'dest_d_kuwait', label: 'Kuwait' },
    { value: 'dest_d_libano', label: 'Libano' },
    { value: 'dest_d_oman', label: 'Oman' },
    { value: 'dest_d_palestina', label: 'Palestina' },
    { value: 'dest_d_siria', label: 'Siria' },
    { value: 'dest_d_turquia', label: 'Turquia' },
    { value: 'dest_d_yemen', label: 'Yemen' },
    { value: 'dest_e_argelia', label: 'Argelia' },
    { value: 'dest_e_angola', label: 'Angola' },
    { value: 'dest_e_benin', label: 'Benin' },
    { value: 'dest_e_botsuana', label: 'Botsuana' },
    { value: 'dest_e_burkina_faso', label: 'Burkina Faso' },
    { value: 'dest_e_burundi', label: 'Burundi' },
    { value: 'dest_e_cabo_verde', label: 'Cabo Verde' },
    { value: 'dest_e_camerun', label: 'Camerun' },
    { value: 'dest_e_chad', label: 'Chad' },
    { value: 'dest_e_comoras', label: 'Comoras' },
    { value: 'dest_e_congo', label: 'Congo' },
    { value: 'dest_e_costa_de_marfil', label: 'Costa de Marfil' },
    { value: 'dest_e_djibouti', label: 'Djibouti' },
    { value: 'dest_e_egipto', label: 'Egipto' },
    { value: 'dest_e_eritrea', label: 'Eritrea' },
    { value: 'dest_e_esuatini', label: 'Esuatini' },
    { value: 'dest_e_etiopia', label: 'Etiopia' },
    { value: 'dest_e_gabon', label: 'Gabon' },
    { value: 'dest_e_gambia', label: 'Gambia' },
    { value: 'dest_e_ghana', label: 'Ghana' },
    { value: 'dest_e_guinea', label: 'Guinea' },
    { value: 'dest_e_guinea_bisau', label: 'Guinea-Bisau' },
    { value: 'dest_e_guinea_ecuatorial', label: 'Guinea Ecuatorial' },
    { value: 'dest_e_kenia', label: 'Kenia' },
    { value: 'dest_e_lesoto', label: 'Lesoto' },
    { value: 'dest_e_liberia', label: 'Liberia' },
    { value: 'dest_e_libia', label: 'Libia' },
    { value: 'dest_e_madagascar', label: 'Madagascar' },
    { value: 'dest_e_malawi', label: 'Malawi' },
    { value: 'dest_e_mali', label: 'Mali' },
    { value: 'dest_e_marruecos', label: 'Marruecos' },
    { value: 'dest_e_mauricio', label: 'Mauricio' },
    { value: 'dest_e_mauritania', label: 'Mauritania' },
    { value: 'dest_e_mozambique', label: 'Mozambique' },
    { value: 'dest_e_namibia', label: 'Namibia' },
    { value: 'dest_e_niger', label: 'Niger' },
    { value: 'dest_e_nigeria', label: 'Nigeria' },
    { value: 'dest_e_republica_centroafricana', label: 'Republica Centroafricana' },
    { value: 'dest_e_republica_democratica_del_congo', label: 'Republica Democratica del Congo' },
    { value: 'dest_e_ruanda', label: 'Ruanda' },
    { value: 'dest_e_santo_tome_y_principe', label: 'Santo Tome y Principe' },
    { value: 'dest_e_senegal', label: 'Senegal' },
    { value: 'dest_e_seychelles', label: 'Seychelles' },
    { value: 'dest_e_sierra_leona', label: 'Sierra Leona' },
    { value: 'dest_e_somalia', label: 'Somalia' },
    { value: 'dest_e_sudafrica', label: 'Sudafrica' },
    { value: 'dest_e_sudan', label: 'Sudan' },
    { value: 'dest_e_sudan_del_sur', label: 'Sudan del Sur' },
    { value: 'dest_e_tanzania', label: 'Tanzania' },
    { value: 'dest_e_togo', label: 'Togo' },
    { value: 'dest_e_tunez', label: 'Tunez' },
    { value: 'dest_e_uganda', label: 'Uganda' },
    { value: 'dest_e_zambia', label: 'Zambia' },
    { value: 'dest_e_zimbabue', label: 'Zimbabue' },
    { value: 'dest_e_australia', label: 'Australia' },
    { value: 'dest_e_fiyi', label: 'Fiyi' },
    { value: 'dest_e_islas_marshall', label: 'Islas Marshall' },
    { value: 'dest_e_islas_salomon', label: 'Islas Salomon' },
    { value: 'dest_e_kiribati', label: 'Kiribati' },
    { value: 'dest_e_micronesia', label: 'Micronesia' },
    { value: 'dest_e_nauru', label: 'Nauru' },
    { value: 'dest_e_nueva_zelanda', label: 'Nueva Zelanda' },
    { value: 'dest_e_palaos', label: 'Palaos' },
    { value: 'dest_e_papua_nueva_guinea', label: 'Papua Nueva Guinea' },
    { value: 'dest_e_samoa', label: 'Samoa' },
    { value: 'dest_e_tonga', label: 'Tonga' },
    { value: 'dest_e_tuvalu', label: 'Tuvalu' },
    { value: 'dest_e_vanuatu', label: 'Vanuatu' }
  ]
}

const SERVICE_DESTINATION_RULES = {
  'EMS NAT': ['local_1', 'local_2', 'local_3', 'local_4', 'nacional_*'],
  'EMS INT': ['dest_a_*', 'dest_b_*', 'dest_c_*', 'dest_d_*', 'dest_e_*'],
  'MI ENCOMIENDA': ['cui_cap_*', 'cui1', 'pro_dentro', 'pro_otro'],
  ENCOMIENDA: ['dest_a_*', 'dest_b_*', 'dest_c_*', 'dest_d_*', 'dest_e_*'],
  'LC/AO NAT': ['local_1', 'nacional_*', 'pro_dentro', 'pro_otro', 'cui1', 'cui2'],
  'LC/AO INT': ['dest_a_*', 'dest_b_*', 'dest_c_*', 'dest_d_*', 'dest_e_*'],
  'ECA NAT': ['local_1', 'nacional_*', 'pro_dentro', 'pro_otro', 'cui1', 'cui2'],
  'ECA INT': ['dest_a_*', 'dest_b_*', 'dest_c_*', 'dest_d_*', 'dest_e_*'],
  'PLIEGOS NAT': ['local_1', 'nacional_*', 'pro_dentro', 'pro_otro'],
  'PLIEGOS INT': ['dest_a_*', 'dest_b_*', 'dest_c_*', 'dest_d_*', 'dest_e_*'],
  'SACAS M NAT': ['nacional_*', 'pro_dentro'],
  'SACAS M INT': ['dest_a_*', 'dest_b_*', 'dest_c_*', 'dest_d_*', 'dest_e_*'],
  'SUPER NAT': ['nacional_*']
}

const ALL_DESTINATIONS = [
  ...DESTINATION_GROUPS.locales,
  ...DESTINATION_GROUPS.nacionales,
  ...DESTINATION_GROUPS.capitales,
  ...DESTINATION_GROUPS.especialesNacionales,
  ...DESTINATION_GROUPS.internacionales
]

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
  },
  data() {
    return {
      form: {
        category: 'EMS INT',
        destination: '',
        weight: '0.25',
        length: '',
        width: '',
        height: '',
        certificado: false,
        recibo: false
      },
      isSubmitting: false,
      calculatorResult: null,
      calculatorError: '',
      showResultModal: false
    }
  },
  computed: {
    visibleServices() {
      return SERVICE_OPTIONS.filter((service) => service.visible)
    },
    filteredDestinations() {
      const patterns = SERVICE_DESTINATION_RULES[this.form.category] || []

      return ALL_DESTINATIONS.filter((option) => patterns.some((pattern) => matchesPattern(option.value, pattern)))
    },
    destinationPlaceholder() {
      if (!this.form.category) {
        return 'Primero selecciona un servicio'
      }

      return this.filteredDestinations.length
        ? (this.content.destination_placeholder || 'Selecciona un destino')
        : 'No hay destinos disponibles'
    },
    selectedServiceLabel() {
      const service = SERVICE_OPTIONS.find((item) => item.value === this.form.category)
      return service ? service.label : this.form.category
    },
    selectedDestinationLabel() {
      const destination = ALL_DESTINATIONS.find((item) => item.value === this.form.destination)
      return destination ? destination.label : this.form.destination
    },
    normalizedWeight() {
      const parsedWeight = Number.parseFloat(this.form.weight)
      return Number.isFinite(parsedWeight) ? parsedWeight : this.form.weight
    },
    formattedTariff() {
      if (!this.calculatorResult) {
        return ''
      }

      const tariff = Number(this.calculatorResult.tarifa)

      if (!Number.isFinite(tariff)) {
        return this.calculatorResult.tarifa
      }

      return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: tariff % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2
      }).format(tariff)
    }
  },
  watch: {
    'form.category'() {
      this.form.destination = ''
      this.calculatorResult = null
      this.calculatorError = ''
    }
  },
  methods: {
    async submitCalculator() {
      this.calculatorError = ''
      this.calculatorResult = null
      this.showResultModal = false

      const weight = Number.parseFloat(this.form.weight)
      const length = parseOptionalNumber(this.form.length)
      const width = parseOptionalNumber(this.form.width)
      const height = parseOptionalNumber(this.form.height)

      if (!this.form.category) {
        this.calculatorError = 'Selecciona el servicio que quieres cotizar.'
        return
      }

      if (!this.form.destination) {
        this.calculatorError = 'Selecciona un destino valido para el servicio elegido.'
        return
      }

      if (!Number.isFinite(weight) || weight <= 0) {
        this.calculatorError = 'El peso debe ser mayor a 0.'
        return
      }

       if (!this.filteredDestinations.some((option) => option.value === this.form.destination)) {
        this.calculatorError = 'El destino no corresponde al servicio seleccionado.'
        return
      }

      if ([length, width, height].some((value) => value !== null && (!Number.isFinite(value) || value < 0))) {
        this.calculatorError = 'Las dimensiones opcionales deben ser numeros validos.'
        return
      }

      this.isSubmitting = true

      try {
        const endpoint = (this.$config && this.$config.postalCalculatorApiUrl) || '/api/calculator'
        const response = await window.fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            categoria: this.form.category,
            destino: this.form.destination,
            peso: weight
          })
        })

        const rawResponse = await response.text()
        let payload = null

        try {
          payload = rawResponse ? JSON.parse(rawResponse) : {}
        } catch (parseError) {
          payload = null
        }

        if (!response.ok) {
          this.calculatorError = (payload && payload.message) || `La API respondio con estado ${response.status}.`
          return
        }

        if (!payload || payload.success === false) {
          this.calculatorError = (payload && payload.message) || 'La API no devolvio un resultado valido.'
          return
        }

        this.calculatorResult = payload
        this.showResultModal = true
      } catch (error) {
        this.calculatorError = error && error.message
          ? `No se pudo consultar la tarifa: ${error.message}`
          : 'No se pudo consultar la tarifa en este momento.'
      } finally {
        this.isSubmitting = false
      }
    },
    closeResultModal() {
      this.showResultModal = false
    }
  }
}

function matchesPattern(value, pattern) {
  if (pattern.endsWith('*')) {
    return value.startsWith(pattern.slice(0, -1))
  }

  return value === pattern
}

function parseOptionalNumber(value) {
  if (value === '' || value === null || typeof value === 'undefined') {
    return null
  }

  const parsedValue = Number.parseFloat(value)
  return Number.isFinite(parsedValue) ? parsedValue : NaN
}
</script>
