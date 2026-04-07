<template>
  <div>
    <footer id="site-footer" class="cb-footer">
      <div class="cb-shell">
        <div class="cb-footer-grid">
          <div class="cb-footer-stack cb-footer-stack--meta">
            <div class="cb-footer-column">
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

            <div class="cb-footer-column">
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
            <div class="cb-footer-column cb-footer-column--alliances">
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

            <div class="cb-footer-column cb-footer-column--international">
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

          <div class="cb-footer-stack cb-footer-stack--contact">
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
        </div>

        <div class="cb-footer-bottom">
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

    <div class="cb-footer-seal-bar" aria-hidden="true">
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
    parseLines(value) {
      const parts = value.split('|')
      return parts.length >= 2 ? parts : [value, '']
    }
  }
}
</script>
