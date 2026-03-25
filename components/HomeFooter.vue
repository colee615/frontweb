<template>
  <footer class="cb-footer">
    <div class="cb-shell">
      <div class="cb-footer-grid">
        <div>
          <h4>{{ content.help_title || 'Ayuda' }}</h4>
          <a v-for="link in helpLinks" :key="link.label" :href="link.url || '#'">{{ link.label }}</a>
        </div>

        <div>
          <h4>{{ content.company_title || 'Empresa' }}</h4>
          <a v-for="link in companyLinks" :key="link.label" :href="link.url || '#'">{{ link.label }}</a>
        </div>

        <div>
          <h4>{{ content.contact_title || 'Contacto' }}</h4>
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
            <span>{{ content.email || 'info@correos.bo' }}</span>
          </div>
        </div>

        <div>
          <h4>{{ content.social_title || 'Siguenos' }}</h4>
          <p class="cb-footer-copy">{{ content.social_text || 'Mantente conectado con nosotros en redes sociales' }}</p>
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
          <p>{{ content.copyright || '© 2026 Correos de Bolivia. Todos los derechos reservados.' }}</p>
          <p>{{ content.legal_text || 'Empresa Publica Nacional Estrategica' }}</p>
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
      const links = this.links.filter((link) => link.group === 'help')
      return links.length
        ? links
        : [
            { label: 'Preguntas Frecuentes', url: '#' },
            { label: 'Como Rastrear un Envio', url: '#' },
            { label: 'Tarifas y Servicios', url: '#' },
            { label: 'Reclamos', url: '#' },
            { label: 'Terminos y Condiciones', url: '#' }
          ]
    },
    companyLinks() {
      const links = this.links.filter((link) => link.group === 'company')
      return links.length
        ? links
        : [
            { label: 'Sobre Nosotros', url: '#' },
            { label: 'Nuestra Historia', url: '#' },
            { label: 'Trabaja con Nosotros', url: '#' },
            { label: 'Noticias', url: '#' },
            { label: 'Responsabilidad Social', url: '#' }
          ]
    },
    socialLinks() {
      const links = this.links.filter((link) => link.group === 'social')
      return links.length
        ? links
        : [
            { label: 'f', aria_label: 'Facebook', url: '#' },
            { label: 'x', aria_label: 'Twitter', url: '#' },
            { label: 'ig', aria_label: 'Instagram', url: '#' },
            { label: 'in', aria_label: 'LinkedIn', url: '#' }
          ]
    },
    addressLines() {
      return this.parseLines(this.content.address || 'Av. Mariscal Santa Cruz 1278|La Paz, Bolivia')
    },
    phoneLines() {
      return this.parseLines(this.content.phone || '+591 2 2356789|0800-10-5050 (Gratis)')
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
