<template>
  <footer class="cb-footer">
    <div class="cb-shell">
      <div class="cb-footer-grid">
        <div>
          <h4>{{ content.help_title || '' }}</h4>
          <a v-for="link in helpLinks" :key="link.label" :href="link.url || '#'">{{ link.label }}</a>
        </div>

        <div>
          <h4>{{ content.company_title || '' }}</h4>
          <a v-for="link in companyLinks" :key="link.label" :href="link.url || '#'">{{ link.label }}</a>
        </div>

        <div>
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

        <div>
          <h4>{{ content.social_title || '' }}</h4>
          <p class="cb-footer-copy">{{ content.social_text || '' }}</p>
          <div class="cb-socials">
            <a v-for="social in socialLinks" :key="social.aria_label" :href="social.url || '#'" :aria-label="social.aria_label">{{ social.label }}</a>
          </div>
        </div>
      </div>

      <div class="cb-footer-bottom">
        <a class="cb-logo cb-logo--footer" href="#">
          <img :src="logoUrl" alt="Correos de Bolivia">
        </a>
        <div class="cb-copyright">
          <p>{{ content.copyright || '' }}</p>
          <p>{{ content.legal_text || '' }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
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
      return this.links.filter((link) => link.group === 'help')
    },
    companyLinks() {
      return this.links.filter((link) => link.group === 'company')
    },
    socialLinks() {
      return this.links.filter((link) => link.group === 'social')
    },
    addressLines() {
      return this.parseLines(this.content.address || '')
    },
    phoneLines() {
      return this.parseLines(this.content.phone || '')
    }
  },
  methods: {
    parseLines(value) {
      const parts = value.split('|')
      return parts.length >= 2 ? parts : [value, '']
    }
  }
}
</script>
