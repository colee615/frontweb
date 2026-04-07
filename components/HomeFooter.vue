<template>
  <div>
    <footer id="site-footer" class="cb-footer">
      <div class="cb-shell">
        <div class="cb-footer-grid">
          <div class="cb-footer-stack cb-footer-stack--meta">
            <div class="cb-footer-column cb-footer-column--desktop">
              <h4>{{ content.company_title || '' }}</h4>
              <component
                :is="isInternalRoute(link.url) ? 'nuxt-link' : 'a'"
                v-for="link in companyLinks"
                :key="`${link.label}-${link.url}`"
                v-bind="linkAttrs(link.url)"
              >
                {{ link.label }}
              </component>
            </div>

            <div class="cb-footer-column cb-footer-column--desktop">
              <h4>{{ content.help_title || '' }}</h4>
              <component
                :is="isInternalRoute(link.url) ? 'nuxt-link' : 'a'"
                v-for="link in helpLinks"
                :key="`${link.label}-${link.url}`"
                v-bind="linkAttrs(link.url)"
              >
                {{ link.label }}
              </component>
            </div>
          </div>

          <div class="cb-footer-links-area">
            <div class="cb-footer-column cb-footer-column--alliances cb-footer-column--desktop">
              <h4>{{ alliancesTitle }}</h4>
              <ul class="cb-footer-list">
                <li v-for="link in alliancesLinks" :key="`${link.label}-${link.url}`">
                  <component
                    :is="isInternalRoute(link.url) ? 'nuxt-link' : 'a'"
                    v-bind="linkAttrs(link.url)"
                  >
                    {{ link.label }}
                  </component>
                </li>
              </ul>
            </div>

            <div class="cb-footer-column cb-footer-column--international cb-footer-column--desktop">
              <h4>{{ internationalTitle }}</h4>
              <ul class="cb-footer-list">
                <li v-for="link in internationalLinks" :key="`${link.label}-${link.url}`">
                  <component
                    :is="isInternalRoute(link.url) ? 'nuxt-link' : 'a'"
                    v-bind="linkAttrs(link.url)"
                  >
                    {{ link.label }}
                  </component>
                </li>
              </ul>
            </div>
          </div>

          <div class="cb-footer-stack cb-footer-stack--contact cb-footer-column--desktop">
            <div class="cb-footer-column">
              <h4>{{ content.contact_title || '' }}</h4>
              <div class="cb-contact-line">
                <span class="cb-inline-icon" v-html="icons.pin"></span>
                <span>{{ addressLines[0] }}<br>{{ addressLines[1] }}</span>
              </div>
              <div class="cb-contact-line">
                <span class="cb-inline-icon" v-html="icons['phone-call']"></span>
                <span>{{ phoneLines[0] }}<br>{{ phoneLines[1] }}</span>
              </div>
              <div class="cb-contact-line">
                <span class="cb-inline-icon" v-html="icons.mail"></span>
                <span>{{ content.email || '' }}</span>
              </div>
            </div>

            <div class="cb-footer-social-block">
              <h4>{{ content.social_title || '' }}</h4>
              <p class="cb-footer-copy">{{ content.social_text || '' }}</p>
              <div class="cb-socials">
                <a v-for="social in socialLinks" :key="social.aria_label" :href="social.url || '#'" :aria-label="social.aria_label">{{ social.label }}</a>
              </div>
            </div>
          </div>

          <div class="cb-footer-mobile">
            <div
              v-for="section in mobileSections"
              :key="section.key"
              class="cb-footer-mobile__section"
            >
              <button
                type="button"
                class="cb-footer-mobile__toggle"
                :aria-expanded="isMobileSectionOpen(section.key) ? 'true' : 'false'"
                @click="toggleMobileSection(section.key)"
              >
                <span>{{ section.title }}</span>
                <span class="cb-footer-mobile__chevron" :class="{ 'is-open': isMobileSectionOpen(section.key) }">⌄</span>
              </button>

              <div v-show="isMobileSectionOpen(section.key)" class="cb-footer-mobile__body">
                <template v-if="section.type === 'links'">
                  <component
                    :is="isInternalRoute(link.url) ? 'nuxt-link' : 'a'"
                    v-for="link in section.items"
                    :key="`${section.key}-${link.label}-${link.url}`"
                    v-bind="linkAttrs(link.url)"
                    class="cb-footer-mobile__link"
                  >
                    {{ link.label }}
                  </component>
                </template>

                <template v-else-if="section.type === 'contact'">
                  <div class="cb-contact-line">
                    <span class="cb-inline-icon" v-html="icons.pin"></span>
                    <span>{{ addressLines[0] }}<br>{{ addressLines[1] }}</span>
                  </div>
                  <div class="cb-contact-line">
                    <span class="cb-inline-icon" v-html="icons['phone-call']"></span>
                    <span>{{ phoneLines[0] }}<br>{{ phoneLines[1] }}</span>
                  </div>
                  <div class="cb-contact-line">
                    <span class="cb-inline-icon" v-html="icons.mail"></span>
                    <span>{{ content.email || '' }}</span>
                  </div>

                  <div v-if="socialLinks.length" class="cb-footer-mobile__socials">
                    <p v-if="content.social_text" class="cb-footer-copy">{{ content.social_text }}</p>
                    <div class="cb-socials">
                      <a v-for="social in socialLinks" :key="`mobile-${social.aria_label}`" :href="social.url || '#'" :aria-label="social.aria_label">{{ social.label }}</a>
                    </div>
                  </div>

                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="cb-footer-mobile__bottom">
          <div class="cb-footer-mobile__seal" v-if="sealLogoUrl">
            <img class="cb-footer-mobile__seal-image" :src="sealLogoUrl" alt="">
          </div>

          <div class="cb-copyright cb-copyright--mobile">
            <p>{{ content.copyright || '' }}</p>
            <p>{{ content.legal_text || '' }}</p>
          </div>
        </div>

        <div class="cb-footer-bottom cb-footer-bottom--desktop">
          <nuxt-link class="cb-logo cb-logo--footer" to="/">
            <img :src="logoUrl" alt="Correos de Bolivia">
          </nuxt-link>
          <div class="cb-copyright">
            <p>{{ content.copyright || '' }}</p>
            <p>{{ content.legal_text || '' }}</p>
          </div>
        </div>
      </div>
    </footer>

    <div class="cb-footer-seal-bar cb-footer-seal-bar--desktop" aria-hidden="true">
      <div class="cb-footer-seal">
        <img class="cb-footer-seal__image" :src="sealLogoUrl" alt="">
      </div>
    </div>
  </div>
</template>

<script>
const DEFAULT_ALLIANCES_TITLE = 'Ministerio de Obras Publicas, Servicio y Vivienda'
const DEFAULT_ALLIANCES_LINKS = [
  'Administradora Boliviana de Carreteras',
  'Aduana Nacional',
  'Agencia Boliviana Espacial',
  'Autoridad de Fiscalizacion y Regulacion de Telecomunicaciones',
  'Boliviana de Aviacion',
  'Centro de Comunicaciones La Paz',
  'Empresa Nacional de Telecomunicaciones',
  'Empresa Mi Teleferico',
  'Navegacion Aerea y Aeropuertos Bolivianos'
]
const DEFAULT_INTERNATIONAL_TITLE = 'Organizaciones Internacionales'
const DEFAULT_INTERNATIONAL_LINKS = [
  'Union Postal Universal',
  'Union Postal de las Americas, Espana y Portugal'
]

export default {
  name: 'HomeFooter',
  props: {
    logoUrl: {
      type: String,
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
    links: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      mobileOpenSections: ['company']
    }
  },
  computed: {
    helpLinks() {
      return this.links
        .filter((link) => link.group === 'help')
        .map((link) => ({ ...link, url: this.resolveRoute(link) }))
    },
    companyLinks() {
      return this.links
        .filter((link) => link.group === 'company')
        .map((link) => ({ ...link, url: this.resolveRoute(link) }))
    },
    alliancesLinks() {
      const links = this.links
        .filter((link) => link.group === 'alliances')
        .map((link) => ({ ...link, url: this.resolveRoute(link) }))

      if (links.length) {
        return links
      }

      return DEFAULT_ALLIANCES_LINKS.map((label) => ({ label, url: '#' }))
    },
    internationalLinks() {
      const links = this.links
        .filter((link) => link.group === 'international')
        .map((link) => ({ ...link, url: this.resolveRoute(link) }))

      if (links.length) {
        return links
      }

      return DEFAULT_INTERNATIONAL_LINKS.map((label) => ({ label, url: '#' }))
    },
    socialLinks() {
      return this.links.filter((link) => link.group === 'social')
    },
    addressLines() {
      return this.parseLines(this.content.address || '')
    },
    phoneLines() {
      return this.parseLines(this.content.phone || '')
    },
    alliancesTitle() {
      return this.content.alliances_title || DEFAULT_ALLIANCES_TITLE
    },
    internationalTitle() {
      return this.content.international_title || DEFAULT_INTERNATIONAL_TITLE
    },
    sealLogoUrl() {
      return this.content.seal_logo || this.logoUrl
    },
    mobileSections() {
      return [
        {
          key: 'company',
          title: this.content.company_title || '',
          type: 'links',
          items: this.companyLinks
        },
        {
          key: 'help',
          title: this.content.help_title || '',
          type: 'links',
          items: this.helpLinks
        },
        {
          key: 'alliances',
          title: this.alliancesTitle,
          type: 'links',
          items: this.alliancesLinks
        },
        {
          key: 'international',
          title: this.internationalTitle,
          type: 'links',
          items: this.internationalLinks
        },
        {
          key: 'contact',
          title: this.content.contact_title || '',
          type: 'contact',
          items: []
        }
      ].filter((section) => section.title)
    }
  },
  methods: {
    resolveRoute(link) {
      const label = this.normalizeLabel(link.label)
      const url = typeof link.url === 'string' ? link.url.trim() : ''

      if (url && url !== '#') {
        return url
      }

      if (
        label.includes('sobre nosotros') ||
        label.includes('nuestra historia') ||
        label.includes('quienes somos')
      ) {
        return '/quienes-somos'
      }

      return '#'
    },
    normalizeLabel(value) {
      if (typeof value !== 'string') {
        return ''
      }

      return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()
    },
    isInternalRoute(url) {
      return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//')
    },
    linkAttrs(url) {
      if (this.isInternalRoute(url)) {
        return { to: url }
      }

      return { href: url || '#' }
    },
    isMobileSectionOpen(key) {
      return this.mobileOpenSections.includes(key)
    },
    toggleMobileSection(key) {
      if (this.isMobileSectionOpen(key)) {
        this.mobileOpenSections = this.mobileOpenSections.filter((sectionKey) => sectionKey !== key)
        return
      }

      this.mobileOpenSections = [...this.mobileOpenSections, key]
    },
    parseLines(value) {
      const parts = value.split('|')
      return parts.length >= 2 ? parts : [value, '']
    }
  }
}
</script>
