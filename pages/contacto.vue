<template>
  <div class="cb-page cb-contact-page" :style="themeStyles" :class="{ 'cb-page--ready': !isBootLoading }">
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
    <HomeHeader v-else :logo-url="logoUrl" :icons="icons" :content="headerSettings" :links="headerLinks" />

    <div v-if="isBootLoading" class="cb-home-skeleton cb-contact-skeleton" aria-hidden="true">
      <section class="cb-home-skeleton__hero">
        <div class="cb-shell">
          <div class="cb-skeleton-card cb-skeleton-card--hero cb-contact-skeleton__hero">
            <div class="cb-skeleton cb-skeleton--eyebrow cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--title cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--title cb-skeleton--short cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--medium cb-skeleton--wave" />
          </div>
        </div>
      </section>

      <section class="cb-section cb-section--tight">
        <div class="cb-shell cb-contact-skeleton__grid">
          <div class="cb-skeleton-card cb-skeleton-card--tool cb-contact-skeleton__panel">
            <div class="cb-skeleton cb-skeleton--section-title cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--input cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--input cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--input cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--map cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--button cb-skeleton--wave" />
          </div>
          <div class="cb-skeleton-card cb-skeleton-card--tool cb-contact-skeleton__panel">
            <div class="cb-skeleton cb-skeleton--section-title cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--medium cb-skeleton--wave" />
            <div class="cb-skeleton cb-skeleton--text cb-skeleton--wave" />
          </div>
        </div>
      </section>
    </div>

    <main v-else class="cb-contact">
      <section class="cb-contact-panel">
        <div class="cb-shell cb-contact-panel__grid">
          <article class="cb-contact-form-wrap">
            <h2>{{ contactSettings.form_title || 'Envianos un mensaje' }}</h2>
            <form class="cb-contact-form" @submit.prevent="submitContact">
              <label for="contact-name">Tu nombre (requerido)</label>
              <input id="contact-name" v-model.trim="form.name" type="text" required>

              <label for="contact-email">Tu correo electronico (requerido)</label>
              <input id="contact-email" v-model.trim="form.email" type="email" required>

              <label for="contact-subject">Asunto</label>
              <input id="contact-subject" v-model.trim="form.subject" type="text">

              <label for="contact-message">Tu mensaje</label>
              <textarea id="contact-message" v-model.trim="form.message" rows="6" required></textarea>

              <button type="submit" class="cb-contact-btn" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="cb-contact-btn__loader" aria-hidden="true"></span>
                <span>{{ isSubmitting ? 'Enviando mensaje...' : 'Enviar' }}</span>
              </button>

              <transition name="cb-contact-feedback-fade">
                <div
                  v-if="submitState"
                  :class="[
                    'cb-contact-feedback-box',
                    submitState === 'ok' ? 'cb-contact-feedback-box--ok' : 'cb-contact-feedback-box--error'
                  ]"
                  role="status"
                  aria-live="polite"
                >
                  <span class="cb-contact-feedback-box__icon" aria-hidden="true">
                    {{ submitState === 'ok' ? 'OK' : '!' }}
                  </span>
                  <div class="cb-contact-feedback-box__body">
                    <strong>{{ submitState === 'ok' ? 'Mensaje enviado' : 'No se pudo enviar' }}</strong>
                    <p>{{ submitMessage }}</p>
                  </div>
                </div>
              </transition>
            </form>
          </article>

          <aside class="cb-contact-info">
            <h3>{{ contactSettings.info_title || 'Canales directos' }}</h3>
            <ul>
              <li>
                <span class="cb-inline-icon" v-html="icons.pin"></span>
                <span>{{ contactAddress }}</span>
              </li>
              <li>
                <span class="cb-inline-icon" v-html="icons['phone-call']"></span>
                <span>{{ contactPhone }}</span>
              </li>
              <li>
                <span class="cb-inline-icon" v-html="icons.mail"></span>
                <span>{{ contactEmail }}</span>
              </li>
            </ul>

            <div class="cb-contact-info__character">
              <img src="/personajechica.png" alt="Asesora de atencion al cliente de Correos de Bolivia">
            </div>
          </aside>
        </div>
      </section>
    </main>

    <HomeFooter v-if="!isBootLoading" :logo-url="logoUrl" :icons="icons" :content="footerSettings" :links="footerLinks" />
  </div>
</template>

<script>
import { sanitizeContentTree } from '~/utils/contentSecurity'

const SHARED_LAYOUT_PAGE = {
  theme: { logo_url: '', primary_color: '#20539a', secondary_color: '#2f3f5c', accent_color: '#fecc36' },
  sections: [
    { key: 'header', settings: { help_label: '', login_label: '', search_placeholder: '', language_primary: '', language_secondary: '', accessibility_label: '' }, items: [] },
    { key: 'footer', settings: { help_title: '', company_title: '', contact_title: '', social_title: '', social_text: '', address: '', phone: '', email: '', copyright: '', legal_text: '' }, items: [] }
  ]
}

export default {
  name: 'ContactoPage',
  data() {
    return {
      isBootLoading: true,
      homeContent: SHARED_LAYOUT_PAGE,
      isSubmitting: false,
      submitState: '',
      submitMessage: '',
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  },
  async asyncData({ $api }) {
    const homePayload = await fetchHome($api)

    return {
      homeContent: normalizePage(homePayload || SHARED_LAYOUT_PAGE, SHARED_LAYOUT_PAGE)
    }
  },
  async mounted() {
    const startedAt = Date.now()
    const payload = await fetchHome(this.$api)

    if (payload) {
      this.homeContent = normalizePage(payload, SHARED_LAYOUT_PAGE)
    }

    const minimumRevealDelay = 900
    const elapsed = Date.now() - startedAt
    const remaining = Math.max(0, minimumRevealDelay - elapsed)

    window.setTimeout(() => {
      this.isBootLoading = false
    }, remaining)
  },
  computed: {
    logoUrl() {
      return this.homeContent.theme.logo_url || ''
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
    themeStyles() {
      const theme = this.homeContent.theme || {}
      return {
        '--cb-blue': theme.primary_color || '#20539a',
        '--cb-yellow': theme.accent_color || '#fecc36',
        '--cb-ink': theme.secondary_color || '#2f3f5c'
      }
    },
    contactSettings() {
      const section = this.homeContent.sections.find((item) => item.key === 'footer')
      return section ? section.settings || {} : {}
    },
    contactAddress() {
      return this.footerSettings.address ? this.footerSettings.address.replace('|', ', ') : 'Av. Mariscal Santa Cruz 1278, La Paz - Bolivia'
    },
    contactPhone() {
      return this.footerSettings.phone || '+591 2 2356789 | 0800-10-5050'
    },
    contactEmail() {
      return this.footerSettings.email || 'info@correos.bo'
    },
    icons() {
      return buildIcons()
    }
  },
  methods: {
    getSectionSettings(key) {
      const section = this.homeContent.sections.find((item) => item.key === key)
      return section ? section.settings || {} : {}
    },
    getSectionItems(key) {
      const section = this.homeContent.sections.find((item) => item.key === key)

      if (!section || !Array.isArray(section.items)) {
        return []
      }

      return section.items.map((item) => ({
        ...(item.data || {}),
        id: item.id,
        type: item.type,
        itemName: item.name
      }))
    },
    async submitContact() {
      if (this.isSubmitting) {
        return
      }

      this.isSubmitting = true
      this.submitState = ''
      this.submitMessage = ''

      try {
        const response = await this.$api.$post('/api/contact', {
          name: this.form.name,
          email: this.form.email,
          subject: this.form.subject,
          message: this.form.message,
        })

        this.submitMessage = (response && response.message) || 'Tu mensaje fue enviado correctamente.'
        this.submitState = 'ok'
        this.form = {
          name: '',
          email: '',
          subject: '',
          message: ''
        }
      } catch (error) {
        this.submitState = 'error'
        this.submitMessage = resolveSubmitError(error)
      } finally {
        this.isSubmitting = false
      }
    }
  },
  head() {
    return {
      title: 'Contactos | Correos de Bolivia',
      meta: [
        { hid: 'description', name: 'description', content: 'Pagina de contacto de Correos de Bolivia.' }
      ],
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

async function fetchHome($api) {
  const endpoints = ['/api/site/pages/home', '/frontapi/api/site/pages/home']

  for (const endpoint of endpoints) {
    const payload = await safeGet($api, endpoint)

    if (payload) {
      return payload
    }
  }

  return null
}

function normalizePage(payload = {}, base = SHARED_LAYOUT_PAGE) {
  const sectionMap = payload.section_map || {}
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
        return fallback
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
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="20" y1="20" x2="16.65" y2="16.65"></line></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
    'phone-call': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.3a2 2 0 0 1 2.11-.45c.85.3 1.74.52 2.64.64A2 2 0 0 1 22 16.92z"></path></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
    accessibility: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.8"></circle><path d="M7 8h10"></path><path d="M12 8v5"></path><path d="m9 21 3-6 3 6"></path><path d="m8 12 4 2 4-2"></path></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"></path><path d="M12 17h.01"></path></svg>',
    login: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path></svg>'
  }
}

function resolveSubmitError(error) {
  const data = error && error.response && error.response.data

  if (data && typeof data.message === 'string' && data.message.trim() !== '') {
    return data.message
  }

  return 'No se pudo enviar el mensaje. Intenta nuevamente en unos momentos.'
}
</script>

<style src="~/assets/css/home.css"></style>
<style src="~/assets/css/contact.css"></style>
