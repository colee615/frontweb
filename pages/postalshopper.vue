<template>
  <div class="cb-page cb-postalshopper-page" :style="themeStyles" :class="{ 'cb-page--ready': !isBootLoading }">
    <transition name="cb-page-loader">
      <div v-if="isBootLoading" class="cb-page-loading-line" aria-live="polite" aria-busy="true">
        <span />
      </div>
    </transition>

    <div v-if="isBootLoading" class="cb-header-skeleton" aria-hidden="true">
      <div class="cb-shell cb-header-skeleton__top">
        <div class="cb-header-skeleton__meta">
          <span class="cb-skeleton cb-skeleton--meta cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--meta cb-skeleton--shorter cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--meta cb-skeleton--tiny cb-skeleton--wave" />
        </div>
        <div class="cb-header-skeleton__meta cb-header-skeleton__meta--right">
          <span class="cb-skeleton cb-skeleton--meta cb-skeleton--shorter cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--meta cb-skeleton--tiny cb-skeleton--wave" />
        </div>
      </div>
      <div class="cb-shell cb-header-skeleton__main">
        <div class="cb-skeleton cb-skeleton--logo cb-skeleton--wave" />
        <div class="cb-header-skeleton__nav">
          <span class="cb-skeleton cb-skeleton--nav cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--nav cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--nav cb-skeleton--shorter cb-skeleton--wave" />
        </div>
        <div class="cb-header-skeleton__actions">
          <span class="cb-skeleton cb-skeleton--search cb-skeleton--wave" />
          <span class="cb-skeleton cb-skeleton--menu cb-skeleton--wave" />
        </div>
      </div>
    </div>

    <HomeHeader v-if="!isBootLoading" :logo-url="logoUrl" :icons="icons" :content="headerSettings" :links="headerLinks" />

    <main v-if="!isBootLoading" class="cb-page__content cb-postalshopper">
      <section v-if="sectionEnabled('postalshopper_hero')" id="postalshopper-hero" class="cb-ps-hero" :style="heroStyles">
        <div class="cb-shell cb-ps-hero__grid">
          <article class="cb-ps-hero__copy">
            <div v-if="heroSettings.badge" class="cb-ps-hero__badge">
              <span class="cb-ps-hero__badge-dot"></span>
              {{ heroSettings.badge }}
            </div>

            <h1>
              <span v-for="(row, index) in heroTitleRows" :key="`ps-hero-row-${index}`">
                <strong v-if="row.white">{{ row.white }}</strong>
                <em v-if="row.yellow">{{ row.yellow }}</em>
              </span>
            </h1>

            <p v-if="heroSettings.lead_text" class="cb-ps-hero__lead">{{ heroSettings.lead_text }}</p>
            <p v-if="heroSettings.subtitle" class="cb-ps-hero__subtitle">{{ heroSettings.subtitle }}</p>

            <div v-if="heroSettings.primary_button_label || heroSettings.primary_button_url || heroSettings.secondary_button_label || heroSettings.secondary_button_url" class="cb-ps-hero__actions">
              <a
                v-if="heroSettings.primary_button_label || heroSettings.primary_button_url"
                class="cb-ps-btn cb-ps-btn--primary"
                :href="tutorialLink || '#postalshopper-tutorial'"
                :target="linkTarget(tutorialLink)"
                :rel="linkRel(tutorialLink)"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5.7c0-.8.9-1.3 1.6-.9l10 6.3a1 1 0 0 1 0 1.7l-10 6.3c-.7.4-1.6-.1-1.6-.9V5.7Z" />
                </svg>
                <span>{{ primaryButtonLabel }}</span>
              </a>
              <a
                v-if="heroSettings.secondary_button_label || secondaryButtonUrl"
                class="cb-ps-btn cb-ps-btn--secondary"
                :href="secondaryButtonUrl || '#postalshopper-steps'"
                :target="linkTarget(secondaryButtonUrl)"
                :rel="linkRel(secondaryButtonUrl)"
              >
                <span>{{ heroSettings.secondary_button_label || 'Más información' }}</span>
              </a>
            </div>

            <div v-if="heroFeatureItems.length" class="cb-ps-hero__stats">
              <article v-for="(item, index) in heroFeatureItems" :key="item.id || item.value || index" class="cb-ps-hero__stat">
                <span class="cb-ps-hero__stat-icon" v-html="icons.star"></span>
                <strong>{{ item.value }}</strong>
                <small>{{ item.label }}</small>
              </article>
            </div>
          </article>

        </div>
        <div class="cb-ps-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 110" preserveAspectRatio="none" role="presentation">
            <path d="M0,62 C170,38 322,70 498,54 C650,40 802,35 965,45 C1126,55 1274,66 1440,48 L1440,110 L0,110 Z" />
          </svg>
        </div>
      </section>

      <section
        v-if="sectionEnabled('postalshopper_destinations') && (availableDestinationItems.length || hasUpcomingDestinations)"
        class="cb-ps-destinations cb-ps-destinations--service-links"
        aria-label="Disponibilidad de envíos Postal Shopper"
      >
        <div class="cb-ps-destinations__grid">
          <component
            v-for="(item, index) in availableDestinationItems"
            :key="item.id || item.label || index"
            :is="destinationCardComponent(item)"
            v-bind="destinationCardAttributes(item)"
            class="cb-ps-destination-card"
            :class="{
              'cb-ps-destination-card--linked': item.url,
              'cb-ps-destination-card--available': isDestinationAvailable(item.status)
            }"
            :aria-label="destinationCardAriaLabel(item)"
            :aria-disabled="!item.url || null"
          >
            <span
              class="cb-ps-destination-card__flag"
              :class="{ 'cb-ps-destination-card__flag--us': destinationFlagImage(item.flag) === '/flags/us.svg' }"
              aria-hidden="true"
            >
              <img v-if="destinationFlagImage(item.flag)" :src="destinationFlagImage(item.flag)" alt="" loading="lazy" decoding="async">
              <span v-else-if="item.flag && item.flag !== '🌐'">{{ item.flag }}</span>
              <span v-else class="cb-ps-destination-card__globe" v-html="icons.globe"></span>
            </span>
            <span class="cb-ps-destination-card__copy">
              <strong>{{ item.label }}</strong>
              <small :class="destinationStatusClass(item.status)">
                <span aria-hidden="true"></span>
                {{ item.status || 'Próximamente' }}
              </small>
            </span>
            <span v-if="item.url" class="cb-ps-destination-card__arrow" aria-hidden="true">↗</span>
          </component>

          <article
            v-if="hasUpcomingDestinations"
            class="cb-ps-destination-card cb-ps-destination-card--upcoming"
            :aria-label="`${destinationSettings.upcoming_label || 'Nuevos envíos'}: ${destinationSettings.upcoming_status || 'Muy pronto'}`"
          >
            <span class="cb-ps-destination-card__flag cb-ps-destination-card__flag--upcoming" aria-hidden="true">
              <img src="/flags/globe.svg" alt="" loading="lazy" decoding="async">
              <span class="cb-ps-upcoming-flag__mark">?</span>
            </span>
            <span class="cb-ps-destination-card__copy">
              <strong>{{ destinationSettings.upcoming_label || 'Nuevos envíos' }}</strong>
              <small class="cb-ps-destination-card__status">
                <span aria-hidden="true"></span>
                {{ destinationSettings.upcoming_status || 'Muy pronto' }}
              </small>
            </span>
          </article>
        </div>
      </section>

      <section v-if="sectionEnabled('postalshopper_steps')" id="postalshopper-steps" class="cb-ps-steps">
        <div class="cb-shell">
          <div class="cb-ps-heading cb-ps-heading--center">
            <div class="cb-ps-heading__accent"></div>
            <h2>{{ stepsSettings.title || '¿Cómo funciona Postal Shopper?' }}</h2>
            <p v-if="stepsSettings.subtitle">{{ stepsSettings.subtitle }}</p>
          </div>

          <div class="cb-ps-steps__grid">
            <div class="cb-ps-steps__cards">
              <article v-for="(item, index) in stepItems" :key="item.id || item.title || index" class="cb-ps-step-card">
                <span class="cb-ps-step-card__icon" aria-hidden="true" v-html="resolveIcon(item.icon || 'package')"></span>
                <span class="cb-ps-step-card__copy">
                  <h3><span>{{ item.step || index + 1 }}.</span> {{ item.title }}</h3>
                  <p v-if="item.text">{{ item.text }}</p>
                </span>
              </article>
            </div>

            <component
              :is="tutorialLink ? 'a' : 'article'"
              v-if="stepsSettings.tutorial_label || stepsSettings.tutorial_image || tutorialLink"
              id="postalshopper-tutorial"
              class="cb-ps-tutorial-card"
              :href="tutorialLink || null"
              :target="linkTarget(tutorialLink)"
              :rel="linkRel(tutorialLink)"
              :aria-label="`${stepsSettings.tutorial_label || 'Ver tutorial completo de Postal Shopper'}${stepsSettings.tutorial_duration ? ', duración ' + stepsSettings.tutorial_duration : ''}`"
            >
              <span class="cb-ps-tutorial-card__city" aria-hidden="true">
                <svg viewBox="0 0 480 180" preserveAspectRatio="none">
                  <path d="M0 180V112h35V90h18v22h24V61h35v51h18V77h34v35h19V43h43v69h22V84h34v28h17V60h41v52h21V94h28v18h27V72h34v40h30v68H0Z" fill="currentColor" />
                </svg>
              </span>
              <img :src="stepsSettings.tutorial_image || '/postalshopper-calculator-mascot.png'" alt="" loading="lazy" decoding="async">
              <span class="cb-ps-tutorial-card__play" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.7c0-.8.9-1.3 1.6-.9l10 6.3a1 1 0 0 1 0 1.7l-10 6.3c-.7.4-1.6-.1-1.6-.9V5.7Z" />
                </svg>
              </span>
              <span class="cb-ps-tutorial-card__label">{{ stepsSettings.tutorial_label || 'Ver tutorial completo' }} <span v-if="stepsSettings.tutorial_duration">· {{ stepsSettings.tutorial_duration }}</span></span>
            </component>
          </div>

        </div>
      </section>

      <section v-if="sectionEnabled('postalshopper_calculator')" id="postalshopper-calculadora" class="cb-ps-calculator" aria-labelledby="postalshopper-calculator-title">
        <div class="cb-shell">
          <div class="cb-ps-calculator__grid">
            <figure class="cb-ps-calculator__visual">
              <img :src="calculatorSettings.image || '/postalshopper-calculator-mascot.png'" :alt="calculatorSettings.image_alt || 'Cartero con un paquete y una calculadora de envíos'" loading="lazy" decoding="async">
              <figcaption class="cb-ps-calculator__visual-caption">
                <span class="cb-ps-calculator__caption-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="m4 8 8-4 8 4v8l-8 4-8-4V8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                    <path d="m4.5 8.3 7.5 4 7.5-4M12 12.5V20M8 6l8 4" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                  </svg>
                </span>
                <span class="cb-ps-calculator__caption-copy">
                  <small>{{ calculatorSettings.caption_label || 'POSTAL SHOPPER' }}</small>
                  <strong>{{ calculatorSettings.caption_text || 'Tus compras, de Miami a Bolivia' }}</strong>
                </span>
              </figcaption>
            </figure>
            <article class="cb-ps-calculator__card" aria-label="Calculadora de tarifa Postal Shopper">
              <header class="cb-ps-calculator__heading">
                <span class="cb-ps-calculator__heading-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="2.75" width="14" height="18.5" rx="2.5" stroke="currentColor" stroke-width="1.7" />
                    <path d="M8 6.5h8M8 11h1m3 0h1m3 0h.01M8 14.5h1m3 0h1m3 0h.01M8 18h1m3 0h1m3 0h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  </svg>
                </span>
                <span class="cb-ps-calculator__heading-copy">
                  <small>{{ calculatorSettings.eyebrow || 'COTIZADOR DE ENVÍOS' }}</small>
                  <h2 id="postalshopper-calculator-title">{{ calculatorSettings.title || 'Cotiza tu paquete' }} <em>{{ calculatorSettings.title_accent || 'en segundos.' }}</em></h2>
                  <p>{{ calculatorSettings.description || 'Consulta una tarifa estimada para tu envío.' }}</p>
                </span>
              </header>

              <div class="cb-ps-calculator__selection">
                <span class="cb-ps-calculator__selection-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 4h10l4 5v11H3V9l4-5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                    <path d="M7 4 5 9h14l-2-5M12 12l2.2 2.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                    <circle cx="11" cy="13" r="2.5" stroke="currentColor" stroke-width="1.5" />
                  </svg>
                </span>
                <span class="cb-ps-calculator__selection-copy">
                  <strong>{{ calculatorSettings.weight_title || 'Elige el peso del paquete' }}</strong>
                  <small>{{ calculatorSettings.weight_help || 'Selecciona entre 1 y 5 libras' }}</small>
                </span>
              </div>
              <div class="cb-ps-calculator__presets" role="group" aria-label="Tarifas por peso">
                <div class="cb-ps-calculator__presets-grid">
                  <button
                    v-for="rate in parcelRates"
                    :key="rate.weight"
                    type="button"
                    class="cb-ps-calculator__preset"
                    :class="{ 'cb-ps-calculator__preset--selected': parcelWeight === rate.weight }"
                    :aria-pressed="parcelWeight === rate.weight"
                    :aria-label="'Elegir ' + rate.weight + ' ' + (rate.weight === 1 ? (calculatorSettings.weight_unit_singular || 'libra') : (calculatorSettings.weight_unit_plural || 'libras')) + ', precio ' + (calculatorSettings.currency_label || '$us') + ' ' + formatParcelPrice(rate.price)"
                    @click="parcelWeight = rate.weight"
                  >
                    <span
                      class="cb-ps-calculator__preset-icon"
                      :class="{ 'cb-ps-calculator__preset-icon--heavy': rate.weight >= 4 }"
                      :style="{ width: (24 + rate.weight * 2) + 'px', height: (24 + rate.weight * 2) + 'px' }"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.5 10.5 16 4l11.5 6.5v13L16 30 4.5 23.5v-13Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                        <path d="m5 10.7 11 6.1 11-6.1M16 17v12.5M11 7l11 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                    <span class="cb-ps-calculator__preset-weight">{{ rate.weight }} {{ rate.weight === 1 ? (calculatorSettings.weight_unit_singular || 'libra') : (calculatorSettings.weight_unit_plural || 'libras') }}</span>
                    <strong>{{ calculatorSettings.currency_label || '$us' }} {{ formatParcelPrice(rate.price) }}</strong>
                  </button>
                </div>
              </div>

              <div class="cb-ps-calculator__quote" aria-live="polite" aria-atomic="true">
                <span class="cb-ps-calculator__quote-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 3.75h12a2 2 0 0 1 2 2v14.5l-4-2.5-4 2.5-4-2.5-4 2.5V5.75a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                    <path d="M8 8h8M8 11.5h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                  </svg>
                </span>
                <span class="cb-ps-calculator__quote-label">{{ calculatorSettings.total_label || 'Tarifa estimada' }}</span>
                <strong class="cb-ps-calculator__quote-total"><span>{{ calculatorSettings.currency_label || '$us' }}</span> {{ formatParcelPrice(selectedParcelRate.price) }}</strong>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="sectionEnabled('postalshopper_intro')" id="postalshopper-intro" class="cb-ps-intro">
        <div class="cb-shell cb-ps-intro__inner">
          <div class="cb-ps-heading cb-ps-heading--center">
            <div v-if="introSettings.eyebrow" class="cb-ps-heading__eyebrow">
              <span></span>
              <small>{{ introSettings.eyebrow }}</small>
              <span></span>
            </div>
            <h2 v-if="introSettings.title">{{ introSettings.title }}</h2>
            <p v-if="introSettings.paragraph_one" class="cb-ps-intro__lead">{{ introSettings.paragraph_one }}</p>
            <p v-if="introSettings.paragraph_two" class="cb-ps-intro__copy">{{ introSettings.paragraph_two }}</p>
          </div>

          <div v-if="marketChips.length" class="cb-ps-intro__brand-marquee" aria-label="Tiendas compatibles">
            <div class="cb-ps-intro__brand-track">
              <span
                v-for="(item, index) in marketMarqueeItems"
                :key="`${item.id || item.label || index}-${index}`"
                class="cb-ps-intro__brand"
              >
                <strong :class="brandLogoClass(item.label)">
                  <img
                    v-if="marketLogoUrl(item)"
                    :src="marketLogoUrl(item)"
                    :alt="`${item.label || 'Tienda'} logo`"
                    loading="lazy"
                    decoding="async"
                  >
                  <span v-else v-html="brandLogoSvg(item.label)"></span>
                </strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section v-if="sectionEnabled('postalshopper_benefits')" id="postalshopper-benefits" class="cb-ps-benefits">
        <div class="cb-shell">
          <div class="cb-ps-heading cb-ps-heading--center cb-ps-heading--light">
            <div class="cb-ps-heading__accent"></div>
            <h2 v-if="benefitsSettings.title">{{ benefitsSettings.title }}</h2>
            <p v-if="benefitsSettings.subtitle">{{ benefitsSettings.subtitle }}</p>
          </div>

          <div class="cb-ps-benefits__grid">
            <article v-for="(item, index) in benefitItems" :key="item.id || item.title || index" class="cb-ps-benefit-card">
              <div class="cb-ps-benefit-card__icon" v-html="resolveIcon(item.icon || 'globe')"></div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>

          <div v-if="benefitsSettings.banner_title || benefitsSettings.banner_text" class="cb-ps-benefits__banner">
            <div class="cb-ps-benefits__banner-icon" v-html="icons.package"></div>
            <div class="cb-ps-benefits__banner-copy">
              <h3 v-if="benefitsSettings.banner_title">{{ benefitsSettings.banner_title }}</h3>
              <p v-if="benefitsSettings.banner_text">{{ benefitsSettings.banner_text }}</p>
            </div>
            <a
              v-if="benefitsSettings.banner_button_label && benefitsSettings.banner_button_url"
              class="cb-ps-btn cb-ps-btn--banner"
              :href="benefitsSettings.banner_button_url"
              :target="linkTarget(benefitsSettings.banner_button_url)"
              :rel="linkRel(benefitsSettings.banner_button_url)"
            >{{ benefitsSettings.banner_button_label }}</a>
          </div>
        </div>
      </section>
    </main>

    <HomeFooter v-if="!isBootLoading" :logo-url="logoUrl" :icons="icons" :content="footerSettings" :links="footerLinks" />
  </div>
</template>

<script>
import { sanitizeContentTree } from '~/utils/contentSecurity'
import { fetchPageWithSharedLayout } from '~/utils/sharedLayout'

const POSTALSHOPPER_REGISTER_URL = 'https://clientescorreos.sistemaml.net/'

const POSTALSHOPPER_SOURCE_PAGE = {
  meta_title: '',
  meta_description: '',
  theme: { logo_url: '', primary_color: '#0d47b5', secondary_color: '#2a4268', accent_color: '#ffcc18' },
  sections: [
    { key: 'header', settings: {}, items: [], is_active: true },
    {
      key: 'postalshopper_hero',
      settings: {
        badge: '',
        title_line_one_white: '',
        title_line_one_yellow: '',
        title_line_two_white: '',
        title_line_two_yellow: '',
        title_line_three_yellow: '',
        lead_text: '',
        subtitle: '',
        primary_button_label: '',
        primary_button_url: '',
        secondary_button_label: '',
        secondary_button_url: '',
        background_image: '',
        map_origin_country: '',
        map_origin_city: '',
        map_destination_country: '',
        map_destination_city: '',
        map_caption: ''
      },
      items: [],
      is_active: true
    },
    {
      key: 'postalshopper_destinations',
      settings: { upcoming_label: 'Nuevos envíos', upcoming_status: 'Muy pronto', upcoming_enabled: true },
      items: [],
      is_active: true
    },
    { key: 'postalshopper_intro', settings: { eyebrow: '', title: '', paragraph_one: '', paragraph_two: '' }, items: [], is_active: true },
    {
      key: 'postalshopper_steps',
      settings: {
        title: '¿Cómo funciona Postal Shopper?',
        subtitle: 'Mira el tutorial y compra desde Estados Unidos en 3 pasos',
        tutorial_url: '',
        tutorial_image: '',
        tutorial_label: 'Ver tutorial completo',
        tutorial_duration: '1:30 min'
      },
      items: [
        { id: 'step-1', data: { step: '01', icon: 'pin', title: 'Regístrate gratis', text: '' } },
        { id: 'step-2', data: { step: '02', icon: 'cart', title: 'Compra y envía a tu casilla', text: '' } },
        { id: 'step-3', data: { step: '03', icon: 'package', title: 'Recibe tu paquete en Bolivia', text: '' } }
      ],
      is_active: true
    },
    {
      key: 'postalshopper_calculator',
      settings: {
        eyebrow: 'COTIZADOR DE ENVÍOS',
        title: 'Cotiza tu paquete',
        title_accent: 'en segundos.',
        description: 'Consulta una tarifa estimada para tu envío.',
        weight_title: 'Elige el peso del paquete',
        weight_help: 'Selecciona entre 1 y 5 libras',
        weight_unit_singular: 'libra',
        weight_unit_plural: 'libras',
        currency_label: '$us',
        total_label: 'Tarifa estimada',
        image: '',
        image_alt: 'Cartero con un paquete y una calculadora de envíos',
        caption_label: 'POSTAL SHOPPER',
        caption_text: 'Tus compras, de Miami a Bolivia'
      },
      items: [
        { id: 'rate-1', data: { weight: 1, price: 10.59 } },
        { id: 'rate-2', data: { weight: 2, price: 13.86 } },
        { id: 'rate-3', data: { weight: 3, price: 17.14 } },
        { id: 'rate-4', data: { weight: 4, price: 20.41 } },
        { id: 'rate-5', data: { weight: 5, price: 23.70 } }
      ],
      is_active: true
    },
    {
      key: 'postalshopper_benefits',
      settings: { title: '', subtitle: '', banner_title: '', banner_text: '', banner_button_label: '', banner_button_url: '' },
      items: [],
      is_active: true
    },
    { key: 'footer', settings: {}, items: [], is_active: true }
  ]
}

export default {
  name: 'PostalShopperPage',
  async asyncData({ $api }) {
    const payload = await fetchPage($api)
    return { pageContent: normalizePage(payload || POSTALSHOPPER_SOURCE_PAGE, POSTALSHOPPER_SOURCE_PAGE) }
  },
  data() {
    return {
      isBootLoading: true,
      parcelWeight: 1
    }
  },
  async mounted() {
    if (!this.logoUrl) {
      await this.refreshPageContent()
      return
    }

    this.isBootLoading = false
  },
  computed: {
    resolvedPageContent() {
      return this.pageContent || POSTALSHOPPER_SOURCE_PAGE
    },
    icons() {
      return buildIcons()
    },
    logoUrl() {
      return this.resolvedPageContent.theme.logo_url || ''
    },
    themeStyles() {
      const theme = this.resolvedPageContent.theme || {}
      return {
        '--cb-blue': theme.primary_color || '#0d47b5',
        '--cb-yellow': theme.accent_color || '#ffcc18',
        '--cb-ink': theme.secondary_color || '#2a4268'
      }
    },
    heroStyles() {
      const image = this.heroSettings.background_image || '/personajechica.png'
      return { '--cb-ps-hero-image': `url(${image})` }
    },
    parcelRates() {
      const savedRates = this.getSectionItems('postalshopper_calculator')
      const fallbackSection = POSTALSHOPPER_SOURCE_PAGE.sections.find((section) => section.key === 'postalshopper_calculator')
      const rates = savedRates.length
        ? savedRates
        : (fallbackSection?.items || []).map((item) => item.data || item)

      return rates
        .map((rate) => ({
          ...rate,
          weight: Number(rate.weight),
          price: Number(String(rate.price == null ? '' : rate.price).replace(',', '.'))
        }))
        .filter((rate) => Number.isFinite(rate.weight) && rate.weight > 0 && Number.isFinite(rate.price) && rate.price >= 0)
        .sort((left, right) => left.weight - right.weight)
    },
    selectedParcelRate() {
      return this.parcelRates.find((rate) => rate.weight === this.parcelWeight) || this.parcelRates[0] || { weight: this.parcelWeight, price: 0 }
    },
    headerSettings() {
      return this.getSectionSettings('header')
    },
    footerSettings() {
      return this.getSectionSettings('footer')
    },
    headerLinks() {
      return this.getSectionItems('header')
    },
    footerLinks() {
      return this.getSectionItems('footer')
    },
    heroSettings() {
      return this.getSectionSettings('postalshopper_hero')
    },
    primaryButtonLabel() {
      const label = String(this.heroSettings.primary_button_label || '').trim()
      return ['como funciona', 'ver tutorial'].includes(label.toLowerCase()) ? 'Cómo funciona' : (label || 'Cómo funciona')
    },
    secondaryButtonUrl() {
      const url = String(this.heroSettings.secondary_button_url || '').trim()
      if (!url || url === '/contacto') {
        const directService = this.availableDestinationItems.find((item) => item.url)
        return directService?.url || POSTALSHOPPER_REGISTER_URL
      }

      return url
    },
    stepsSettings() {
      const settings = this.getSectionSettings('postalshopper_steps')
      const legacyTitle = 'Tu puente directo entre Miami y Bolivia.'
      const legacySubtitle = 'Hemos simplificado el proceso de importacion para que tu unica preocupacion sea decidir que comprar hoy.'

      return {
        ...settings,
        title: settings.title === legacyTitle ? '¿Cómo funciona Postal Shopper?' : settings.title,
        subtitle: settings.subtitle === legacySubtitle ? 'Mira el tutorial y compra desde Estados Unidos en 3 pasos' : settings.subtitle
      }
    },
    calculatorSettings() {
      return this.getSectionSettings('postalshopper_calculator')
    },
    tutorialLink() {
      const candidates = [this.stepsSettings.tutorial_url, this.heroSettings.primary_button_url]
        .map((url) => String(url || '').trim())
        .filter(Boolean)
      return candidates.find((url) => /^https?:\/\//i.test(url)) || candidates[0] || ''
    },
    heroTitleRows() {
      const rows = []
      const titleOneWhite = String(this.heroSettings.title_line_one_white || '').trim()
      const titleOneYellow = String(this.heroSettings.title_line_one_yellow || '').trim()
      const titleTwoWhite = String(this.heroSettings.title_line_two_white || '').trim()
      const titleTwoYellow = String(this.heroSettings.title_line_two_yellow || '').trim()
      const titleThreeYellow = String(this.heroSettings.title_line_three_yellow || '').trim()

      if (titleOneWhite || titleOneYellow) rows.push({ white: titleOneWhite, yellow: titleOneYellow })
      if (titleTwoWhite || titleTwoYellow) rows.push({ white: titleTwoWhite, yellow: titleTwoYellow })

      if (titleThreeYellow) {
        rows.push({ white: '', yellow: titleThreeYellow })
      }

      return rows.filter((row) => String(row.white || row.yellow || '').trim() !== '')
    },
    introSettings() {
      return this.getSectionSettings('postalshopper_intro')
    },
    benefitsSettings() {
      return this.getSectionSettings('postalshopper_benefits')
    },
    heroFeatureItems() {
      return this.getSectionItems('postalshopper_hero')
    },
    stepItems() {
      const savedItems = this.getSectionItems('postalshopper_steps')
      const fallbackSection = POSTALSHOPPER_SOURCE_PAGE.sections.find((section) => section.key === 'postalshopper_steps')
      const items = savedItems.length
        ? savedItems
        : (fallbackSection?.items || []).map((item) => ({ ...(item.data || item), id: item.id }))
      const legacyTitles = ['Tu Direccion Americana', 'Compra sin Limites', 'Consolidacion y Ahorro', 'El Vuelo a Casa']

      if (items.length !== legacyTitles.length || !items.every((item, index) => item.title === legacyTitles[index])) {
        return items
      }

      return [
        { ...items[0], step: '1', icon: 'user-plus', title: 'Regístrate gratis', text: '' },
        { ...items[1], step: '2', icon: 'cart', title: 'Compra y envía a tu casilla', text: '' },
        { ...items[3], step: '3', icon: 'package', title: 'Recibe tu paquete en Bolivia', text: '' }
      ]
    },
    marketChips() {
      return this.getSectionItems('postalshopper_intro')
    },
    destinationItems() {
      return this.getSectionItems('postalshopper_destinations')
    },
    destinationSettings() {
      return this.getSectionSettings('postalshopper_destinations')
    },
    availableDestinationItems() {
      return this.destinationItems.filter((item) => {
        return this.isDestinationAvailable(item.status)
          && String(item.label || '').trim().toLowerCase() !== 'nuevos destinos'
      })
    },
    hasUpcomingDestinations() {
      return this.destinationSettings.upcoming_enabled !== false
    },
    marketMarqueeItems() {
      return [...this.marketChips, ...this.marketChips]
    },
    benefitItems() {
      return this.getSectionItems('postalshopper_benefits')
    }
  },
  watch: {
    parcelRates(rates) {
      if (rates.length && !rates.some((rate) => rate.weight === this.parcelWeight)) {
        this.parcelWeight = rates[0].weight
      }
    }
  },
  methods: {
    async refreshPageContent() {
      const startedAt = Date.now()

      try {
        const payload = await fetchPage(this.$api)
        if (payload) {
          this.pageContent = normalizePage(payload, POSTALSHOPPER_SOURCE_PAGE)
        }
      } finally {
        const elapsed = Date.now() - startedAt
        const remaining = Math.max(0, 350 - elapsed)

        window.setTimeout(() => {
          this.isBootLoading = false
        }, remaining)
      }
    },
    getSectionSettings(key) {
      const section = this.resolvedPageContent.sections.find((item) => item.key === key)
      return section ? section.settings || {} : {}
    },
    sectionEnabled(key) {
      const section = this.resolvedPageContent.sections.find((item) => item.key === key)
      return !section || section.is_active !== false
    },
    getSectionItems(key) {
      const section = this.resolvedPageContent.sections.find((item) => item.key === key)
      if (!section || !Array.isArray(section.items)) {
        return []
      }
      return section.items
        .filter((item) => item.is_active !== false)
        .map((item) => ({ ...(item.data || {}), id: item.id, type: item.type }))
    },
    formatParcelPrice(value) {
      const amount = Number(String(value == null ? '' : value).replace(',', '.'))
      return Number.isFinite(amount)
        ? amount.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '0,00'
    },
    marketLogoUrl(item) {
      return String(item?.logo || item?.image || item?.logo_url || '').trim()
    },
    brandLogoSvg(label) {
      const value = String(label || '').trim()
      const lower = value.toLowerCase()

      if (lower.includes('amazon')) {
        return '<svg viewBox="0 0 118 36" aria-hidden="true"><text x="4" y="21" font-size="18" font-weight="800" font-family="Arial, sans-serif" fill="currentColor">amazon</text><path d="M28 28c18 7 42 5 61-5" fill="none" stroke="#ffb300" stroke-width="3" stroke-linecap="round"/><path d="M84 21l9 1-5 7" fill="none" stroke="#ffb300" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      }
      if (lower.includes('ebay')) {
        return '<svg viewBox="0 0 96 34" aria-hidden="true"><text x="3" y="24" font-size="22" font-weight="800" font-family="Arial, sans-serif" fill="#e53238">e</text><text x="23" y="24" font-size="22" font-weight="800" font-family="Arial, sans-serif" fill="#0064d2">b</text><text x="43" y="24" font-size="22" font-weight="800" font-family="Arial, sans-serif" fill="#f5af02">a</text><text x="63" y="24" font-size="22" font-weight="800" font-family="Arial, sans-serif" fill="#86b817">y</text></svg>'
      }
      if (lower.includes('walmart')) {
        return '<svg viewBox="0 0 128 34" aria-hidden="true"><text x="3" y="23" font-size="20" font-weight="800" font-family="Arial, sans-serif" fill="#0071ce">Walmart</text><g fill="#ffc220" transform="translate(104 17)"><circle cx="0" cy="-11" r="2.4"/><circle cx="0" cy="11" r="2.4"/><circle cx="-10" cy="-5.5" r="2.4"/><circle cx="10" cy="-5.5" r="2.4"/><circle cx="-10" cy="5.5" r="2.4"/><circle cx="10" cy="5.5" r="2.4"/></g></svg>'
      }
      if (lower.includes('shein')) {
        return '<svg viewBox="0 0 92 34" aria-hidden="true"><text x="4" y="24" font-size="22" font-weight="800" letter-spacing="3" font-family="Arial, sans-serif" fill="#111827">SHEIN</text></svg>'
      }
      if (lower.includes('nike')) {
        return '<svg viewBox="0 0 96 34" aria-hidden="true"><path d="M8 22c16 6 37 1 80-14-33 18-58 25-73 24-7 0-11-3-7-10z" fill="#111827"/></svg>'
      }
      if (lower.includes('apple')) {
        return '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#111827" d="M31.4 6.2c1.2-1.5 2-3.6 1.8-5.7-1.8.1-4 .1-5.4 1.8-1.2 1.4-2.2 3.5-1.9 5.5 2 .2 4.2-.5 5.5-1.6zM39 34.4c-.9 2-1.4 2.9-2.6 4.7-1.7 2.6-4.1 5.8-7.1 5.8-2.6 0-3.3-1.7-6.9-1.7s-4.4 1.7-6.9 1.7c-3 0-5.3-2.9-7-5.5-4.8-7.4-5.3-16.1-2.4-20.7 2.1-3.3 5.4-5.2 8.5-5.2 3.2 0 5.2 1.7 7.8 1.7 2.5 0 4.1-1.7 7.8-1.7 2.8 0 5.8 1.5 7.8 4.2-6.9 3.8-5.8 13.6 1 16.7z"/></svg>'
      }
      if (lower.includes('miles')) {
        return '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="19" fill="#ffcc18"/><path d="M24 14v20M14 24h20" stroke="#0f4aad" stroke-width="4" stroke-linecap="round"/></svg>'
      }

      return '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" fill="#ffcc18"/><path d="M24 14v20M14 24h20" stroke="#0f4aad" stroke-width="4" stroke-linecap="round"/></svg>'
    },
    brandLogoClass(label) {
      const value = String(label || '').trim().toLowerCase()

      if (value.includes('amazon')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--amazon'
      if (value.includes('ebay')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--ebay'
      if (value.includes('walmart')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--walmart'
      if (value.includes('shein')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--shein'
      if (value.includes('nike')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--nike'
      if (value.includes('apple')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--apple'
      if (value.includes('miles')) return 'cb-ps-intro__brand-logo cb-ps-intro__brand-logo--more'

      return 'cb-ps-intro__brand-logo'
    },
    resolveIcon(icon) {
      return this.icons[icon] || ''
    },
    isInternalRoute(url) {
      return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//')
    },
    linkTarget(url) {
      return /^https?:\/\//i.test(String(url || '').trim()) ? '_blank' : null
    },
    linkRel(url) {
      return this.linkTarget(url) ? 'noopener noreferrer' : null
    },
    linkAttrs(url) {
      if (this.isInternalRoute(url)) {
        return { to: url }
      }
      return { href: url || '#' }
    },
    destinationCardComponent(item) {
      if (!item.url) return 'article'
      return this.isInternalRoute(item.url) ? 'nuxt-link' : 'a'
    },
    destinationCardAttributes(item) {
      if (!item.url) return {}
      if (this.isInternalRoute(item.url)) return { to: item.url }
      return { href: item.url, target: '_blank', rel: 'noopener noreferrer' }
    },
    destinationFlagImage(flag) {
      const value = String(flag || '').trim()
      if (/^https:\/\//i.test(value) || (value.startsWith('/') && !value.startsWith('//'))) return value

      const countryCode = Array.from(value).map((character) => {
        const point = character.codePointAt(0)
        return point >= 0x1f1e6 && point <= 0x1f1ff ? String.fromCharCode(point - 0x1f1e6 + 65) : ''
      }).join('')
      const localFlags = ['US', 'CN', 'ES', 'BR', 'CL', 'AR', 'MX']

      return countryCode.length === 2 && localFlags.includes(countryCode)
        ? `/flags/${countryCode.toLowerCase()}.svg`
        : ''
    },
    destinationCardAriaLabel(item) {
      const status = item.status || 'Próximamente'
      return `${item.label}: ${status}`
    },
    destinationStatusClass(status) {
      return this.isDestinationAvailable(status)
        ? 'cb-ps-destination-card__status cb-ps-destination-card__status--available'
        : 'cb-ps-destination-card__status'
    },
    isDestinationAvailable(status) {
      const value = String(status || '').trim()
      return /\b(disponible|directo|activo|operativo)\b/i.test(value)
        && !/\b(no disponible|inactivo|no operativo)\b/i.test(value)
    }
  },
  head() {
    return {
      title: this.resolvedPageContent.meta_title || '',
      titleTemplate: '%s',
      meta: [{ hid: 'description', name: 'description', content: this.resolvedPageContent.meta_description || '' }],
      htmlAttrs: { lang: 'es' }
    }
  }
}

async function safeGet($api, endpoint) {
  try {
    return await $api.$get(endpoint)
  } catch (error) {
    return null
  }
}

async function fetchPage($api) {
  const endpoints = ['/frontapi/api/site/pages/postalshopper', '/api/site/pages/postalshopper']
  return fetchPageWithSharedLayout($api, endpoints)
}

function normalizePage(payload = {}, base = POSTALSHOPPER_SOURCE_PAGE) {
  const sectionMap = payload.section_map || {}
  const fallbackOnMissing = new Set(['postalshopper_steps', 'postalshopper_calculator'])
  const fallbackMap = base.sections.reduce((accumulator, section) => {
    accumulator[section.key] = section
    return accumulator
  }, {})

  return {
    ...base,
    ...payload,
    theme: {
      ...(base.theme || {}),
      ...sanitizeContentTree(payload.theme || {})
    },
    sections: Object.keys(fallbackMap).map((key, index) => {
      const fallback = fallbackMap[key]
      const section = sectionMap[key] || (Array.isArray(payload.sections) ? payload.sections.find((item) => item.key === key) : null)
      if (!section) {
        const hasServerSections = Boolean(payload.section_map || Array.isArray(payload.sections))
        return hasServerSections && !fallbackOnMissing.has(key)
          ? { ...fallback, is_active: false, items: [] }
          : fallback
      }
      return sanitizeContentTree({
        ...fallback,
        ...section,
        sort_order: typeof section.sort_order === 'number' ? section.sort_order : index,
        settings: {
          ...(fallback.settings || {}),
          ...(section.settings || {})
        },
        items: Array.isArray(section.items) ? section.items : fallback.items
      })
    })
  }
}

function buildIcons() {
  return {
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
    accessibility: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.8"></circle><path d="M7 8h10"></path><path d="M12 8v5"></path><path d="m9 21 3-6 3 6"></path><path d="m8 12 4 2 4-2"></path></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"></path><path d="M12 17h.01"></path></svg>',
    login: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.7 5.47 6.03.88-4.36 4.25 1.03 6.01L12 16.77 6.6 19.61l1.03-6.01L3.27 9.35l6.03-.88L12 3Z"></path></svg>',
    'user-plus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="4"></circle><path d="M2 21v-1a7 7 0 0 1 14 0v1M19 8v6M16 11h6"></path></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1"></circle><circle cx="18" cy="20" r="1"></circle><path d="M3 4h3l2.4 10h10.8l2.1-7H7.2"></path></svg>',
    package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 8 4.5v11L12 22 4 17.5v-11L12 2Z"></path><path d="M12 22V11"></path><path d="m20 6.5-8 4.5-8-4.5"></path><path d="m8 4.2 8 4.6"></path></svg>',
    plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"></path><path d="M22 2 15 22l-4-9-9-4 20-7Z"></path></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.86l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.86-.34 1.7 1.7 0 0 0-1 1.54V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.54 1.7 1.7 0 0 0-1.86.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.86 1.7 1.7 0 0 0-1.54-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.54-1 1.7 1.7 0 0 0-.34-1.86l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.86.34h.08a1.7 1.7 0 0 0 1-1.54V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.54 1.7 1.7 0 0 0 1.86-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.86v.08a1.7 1.7 0 0 0 1.54 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.54 1Z"></path></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z"></path></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-2 7 4 1-6 12 2-8-4-1 6-11Z"></path></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
    'phone-call': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.3a2 2 0 0 1 2.11-.45c.85.3 1.74.52 2.64.64A2 2 0 0 1 22 16.92z"></path></svg>'
  }
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/postalshopper.css"></style>
