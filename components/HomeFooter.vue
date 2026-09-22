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
                <span class="cb-inline-icon" v-html="footerIcons.pin"></span>
                <span>{{ addressLines[0] }}<br>{{ addressLines[1] }}</span>
              </div>
              <div class="cb-contact-line">
                <span class="cb-inline-icon" v-html="footerIcons['phone-call']"></span>
                <span>{{ phoneLines[0] }}<br>{{ phoneLines[1] }}</span>
              </div>
              <div class="cb-contact-line">
                <span class="cb-inline-icon" v-html="footerIcons.mail"></span>
                <span>{{ content.email || '' }}</span>
              </div>
            </div>

            <div class="cb-footer-social-block">
              <h4>{{ content.social_title || '' }}</h4>
              <p class="cb-footer-copy">{{ content.social_text || '' }}</p>
              <div class="cb-socials">
                <a v-for="social in socialLinks" :key="social.aria_label" :href="social.url || '#'" :aria-label="social.aria_label || social.label">
                  <img v-if="social.image" :src="social.image" :alt="social.aria_label || social.label">
                  <span v-else>{{ social.label }}</span>
                </a>
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
                <span class="cb-footer-mobile__chevron" :class="{ 'is-open': isMobileSectionOpen(section.key) }" aria-hidden="true"></span>
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
                    <span class="cb-inline-icon" v-html="footerIcons.pin"></span>
                    <span>{{ addressLines[0] }}<br>{{ addressLines[1] }}</span>
                  </div>
                  <div class="cb-contact-line">
                    <span class="cb-inline-icon" v-html="footerIcons['phone-call']"></span>
                    <span>{{ phoneLines[0] }}<br>{{ phoneLines[1] }}</span>
                  </div>
                  <div class="cb-contact-line">
                    <span class="cb-inline-icon" v-html="footerIcons.mail"></span>
                    <span>{{ content.email || '' }}</span>
                  </div>

                  <div v-if="socialLinks.length" class="cb-footer-mobile__socials">
                    <p v-if="content.social_text" class="cb-footer-copy">{{ content.social_text }}</p>
                    <div class="cb-socials">
                      <a v-for="social in socialLinks" :key="`mobile-${social.aria_label}`" :href="social.url || '#'" :aria-label="social.aria_label || social.label">
                        <img v-if="social.image" :src="social.image" :alt="social.aria_label || social.label">
                        <span v-else>{{ social.label }}</span>
                      </a>
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
            <p><nuxt-link class="cb-footer-privacy-link" to="/politica-privacidad-trackingbo-app">Politica de privacidad TrackingBO App</nuxt-link></p>
          </div>
        </div>

        <div class="cb-footer-bottom cb-footer-bottom--desktop">
          <nuxt-link class="cb-logo cb-logo--footer" to="/">
            <img :src="logoUrl" alt="Correos de Bolivia">
          </nuxt-link>
          <div class="cb-copyright">
            <p>{{ content.copyright || '' }}</p>
            <p>{{ content.legal_text || '' }}</p>
            <p><nuxt-link class="cb-footer-privacy-link" to="/politica-privacidad-trackingbo-app">Politica de privacidad TrackingBO App</nuxt-link></p>
          </div>
        </div>
      </div>
    </footer>

    <div class="cb-footer-seal-bar cb-footer-seal-bar--desktop" aria-hidden="true">
      <div class="cb-footer-seal">
        <img class="cb-footer-seal__image" :src="sealLogoUrl" alt="">
      </div>
    </div>
    <script
      src="https://chatbot.correos.gob.bo:5000/widget-embed.js"
      data-lang="es"
      data-position="right"
      defer>
    </script>
  </div>
</template>

<script>
const CONTACT_ROUTE = '/contacto'
const FOOTER_ICONS = {
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
  'phone-call': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.3a2 2 0 0 1 2.11-.45c.85.3 1.74.52 2.64.64A2 2 0 0 1 22 16.92z"></path></svg>'
}

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
      mobileOpenSections: ['company'],
      chatbotForceTimer: null
    }
  },
  computed: {
    footerIcons() {
      return { ...FOOTER_ICONS, ...this.icons }
    },
    helpLinks() {
      return this.links
        .filter((link) => link.group === 'help')
        .map((link) => ({ ...link, url: CONTACT_ROUTE }))
    },
    companyLinks() {
      return this.links
        .filter((link) => link.group === 'company')
        .map((link) => ({ ...link, url: this.resolveRoute(link) }))
    },
    alliancesLinks() {
      return this.links
        .filter((link) => link.group === 'alliances')
        .map((link) => ({ ...link, url: this.resolveRoute(link) }))
    },
    internationalLinks() {
      return this.links
        .filter((link) => link.group === 'international')
        .map((link) => ({ ...link, url: this.resolveRoute(link) }))
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
      return this.content.alliances_title || ''
    },
    internationalTitle() {
      return this.content.international_title || ''
    },
    sealLogoUrl() {
      return this.content.seal_logo || ''
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
    forceFooterChatbotMobile() {
      if (!process.client) {
        return
      }

      const isMobile = window.matchMedia('(max-width: 767px)').matches
      if (!isMobile) {
        return
      }

      const candidates = document.querySelectorAll(
        'iframe[src*="chatbot.correos.gob.bo:5000"], [id*="chatbot"], [class*="chatbot"]'
      )

      candidates.forEach((node) => {
        if (!node || !node.style) {
          return
        }

        node.style.display = 'block'
        node.style.visibility = 'visible'
        node.style.opacity = '1'
        node.style.pointerEvents = 'auto'
        node.style.zIndex = '2147483647'
      })
    },
    resolveRoute(link) {
      const label = this.normalizeLabel(link.label)
      const url = typeof link.url === 'string' ? link.url.trim() : ''

      if (
        label.includes('sobre nosotros') ||
        label.includes('nuestra historia') ||
        label.includes('quienes somos')
      ) {
        return '/quienes-somos'
      }

      if (label.includes('ems') || label.includes('express mail')) {
        return '/ems'
      }

      if (label.includes('delivery express') || label.includes('delivery')) {
        return '/deliveryexpress'
      }

      if (label.includes('eca')) {
        return '/eca'
      }

      if (label.includes('encomienda')) {
        return '/encomienda'
      }

      if (label.includes('noticias')) {
        return '/noticias'
      }

      if (
        label.includes('contacto') ||
        label.includes('contactanos') ||
        label.includes('consulta') ||
        label.includes('reclamos')
      ) {
        return CONTACT_ROUTE
      }

      if (url && url !== '#') {
        return url
      }

      return url || '#'
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
  },
  mounted() {
    this.forceFooterChatbotMobile()
    this.chatbotForceTimer = setTimeout(() => {
      this.forceFooterChatbotMobile()
      this.chatbotForceTimer = null
    }, 2000)
  },
  beforeDestroy() {
    if (this.chatbotForceTimer) {
      clearTimeout(this.chatbotForceTimer)
      this.chatbotForceTimer = null
    }
  }
}
</script>

<style scoped>
.cb-footer-privacy-link {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.18em;
}

.cb-footer-privacy-link:hover,
.cb-footer-privacy-link:focus-visible {
  opacity: 0.82;
}
</style>

