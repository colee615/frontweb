<template>
  <div class="cb-page cb-privacy-page" :style="themeStyles" :class="{ 'cb-page--ready': !isBootLoading }">
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

    <main v-if="!isBootLoading" class="cb-privacy">
      <section class="cb-privacy-hero">
        <div class="cb-shell">
          <div class="cb-privacy-hero__card">
            <p class="cb-privacy-eyebrow">Play Store</p>
            <h1>Politica de privacidad TrackingBO App</h1>
            <p class="cb-privacy-lead">
              Esta politica describe como la aplicacion movil <strong>TrackingBo App</strong> de Correos de Bolivia
              recopila, usa, almacena y protege la informacion de sus usuarios.
            </p>
            <div class="cb-privacy-meta">
              <span>Ultima actualizacion: 22 de julio de 2026</span>
              <span>Aplicacion Android: bo.gob.correos.trackingboapp</span>
            </div>
          </div>
        </div>
      </section>

      <section class="cb-privacy-section">
        <div class="cb-shell">
          <div class="cb-privacy-card">
            <h2>1. Responsable del tratamiento</h2>
            <p>
              El responsable de esta aplicacion es <strong>Correos de Bolivia</strong>. Para consultas sobre privacidad
              o tratamiento de datos puedes comunicarte mediante los canales publicados en este sitio web.
            </p>
          </div>

          <div class="cb-privacy-card">
            <h2>2. Que informacion tratamos</h2>
            <p>La aplicacion puede tratar las siguientes categorias de informacion:</p>
            <ul>
              <li>Codigos de seguimiento ingresados manualmente o escaneados por el usuario.</li>
              <li>Nombres o alias que el usuario asigne a sus paquetes guardados.</li>
              <li>Token de notificaciones del dispositivo para enviar avisos sobre cambios de estado del envio.</li>
              <li>Permiso de camara, usado solo para escanear codigos cuando el usuario lo autoriza.</li>
              <li>Datos tecnicos minimos necesarios para el funcionamiento seguro de la app y sus servicios.</li>
            </ul>
          </div>

          <div class="cb-privacy-card">
            <h2>3. Datos que no solicitamos de forma obligatoria</h2>
            <p>
              La aplicacion no solicita crear una cuenta ni ingresar datos como nombre completo, documento de identidad
              o datos bancarios para consultar el estado de un envio.
            </p>
            <p>
              La camara es opcional y solo se utiliza para leer codigos. Si no concedes ese permiso, puedes ingresar el
              codigo manualmente.
            </p>
          </div>

          <div class="cb-privacy-card">
            <h2>4. Para que usamos la informacion</h2>
            <ul>
              <li>Consultar eventos y estados de seguimiento asociados a un codigo postal o de encomienda.</li>
              <li>Guardar paquetes en el dispositivo para acceso rapido del usuario.</li>
              <li>Suscribir un paquete a notificaciones push cuando el usuario decide guardarlo y hay un token disponible.</li>
              <li>Mostrar avisos operativos y mejorar la continuidad del servicio.</li>
            </ul>
          </div>

          <div class="cb-privacy-card">
            <h2>5. Donde se almacenan los datos</h2>
            <p>
              Algunos datos, como los paquetes guardados y el token de notificaciones, pueden almacenarse localmente en
              el dispositivo del usuario.
            </p>
            <p>
              Cuando se consulta un envio o se activa la suscripcion a notificaciones, la informacion necesaria se envia
              a los servicios de backend de Correos de Bolivia para procesar la solicitud.
            </p>
          </div>

          <div class="cb-privacy-card">
            <h2>6. Comparticion de informacion</h2>
            <p>
              No vendemos informacion personal de los usuarios. La informacion solo se comparte con proveedores o
              servicios tecnologicos cuando ello es necesario para operar la aplicacion, enviar notificaciones o atender
              requerimientos legales aplicables.
            </p>
          </div>

          <div class="cb-privacy-card">
            <h2>7. Permisos del dispositivo</h2>
            <ul>
              <li><strong>Camara:</strong> para escanear codigos de seguimiento.</li>
              <li><strong>Notificaciones:</strong> para avisar cambios o eventos de paquetes guardados.</li>
            </ul>
            <p>
              Puedes revocar estos permisos en cualquier momento desde la configuracion de tu dispositivo.
            </p>
          </div>

          <div class="cb-privacy-card">
            <h2>8. Conservacion y control por parte del usuario</h2>
            <p>
              El usuario puede eliminar los paquetes guardados en la aplicacion y desinstalarla en cualquier momento.
              Al hacerlo, dejaran de usarse los datos almacenados localmente por la app en ese dispositivo.
            </p>
          </div>

          <div class="cb-privacy-card">
            <h2>9. Seguridad</h2>
            <p>
              Aplicamos medidas razonables de seguridad para proteger la informacion contra acceso no autorizado,
              alteracion, divulgacion o destruccion indebida. Sin embargo, ningun sistema es completamente infalible.
            </p>
          </div>

          <div class="cb-privacy-card">
            <h2>10. Menores de edad</h2>
            <p>
              La aplicacion no esta dirigida especificamente a menores de edad. Si un padre, madre o tutor considera
              que un menor proporciono informacion de manera inadecuada, puede contactarnos para revisar el caso.
            </p>
          </div>

          <div class="cb-privacy-card">
            <h2>11. Cambios a esta politica</h2>
            <p>
              Esta politica puede actualizarse cuando cambien las funciones de la aplicacion o los requisitos legales y
              regulatorios. La version vigente sera la publicada en esta misma URL.
            </p>
          </div>

          <div class="cb-privacy-card">
            <h2>12. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta politica de privacidad, puedes escribir a
              <a href="mailto:info@correos.bo">info@correos.bo</a> o usar la pagina de
              <nuxt-link to="/contacto">contacto</nuxt-link>.
            </p>
          </div>
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
  name: 'PoliticaPrivacidadPage',
  data() {
    return {
      isBootLoading: true,
      homeContent: SHARED_LAYOUT_PAGE
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

    const minimumRevealDelay = 400
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
    }
  },
  head() {
    return {
      title: 'Politica de privacidad TrackingBO App | Correos de Bolivia',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Politica de privacidad de TrackingBO App para la ficha de Google Play Store.'
        }
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
</script>

<style src="~/assets/css/home.css"></style>

<style scoped>
.cb-privacy {
  background:
    radial-gradient(circle at top left, rgba(254, 204, 54, 0.2), transparent 28%),
    linear-gradient(180deg, #f4f7fb 0%, #eef2f8 100%);
  min-height: 100vh;
  padding-bottom: 4rem;
}

.cb-privacy-hero {
  padding: 2.5rem 0 1.25rem;
}

.cb-privacy-hero__card,
.cb-privacy-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(32, 83, 154, 0.1);
  border-radius: 28px;
  box-shadow: 0 18px 42px rgba(19, 48, 89, 0.08);
}

.cb-privacy-hero__card {
  padding: 2rem;
}

.cb-privacy-eyebrow {
  color: var(--cb-blue);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  margin: 0 0 0.75rem;
  text-transform: uppercase;
}

.cb-privacy-hero__card h1 {
  color: var(--cb-ink);
  font-size: clamp(2rem, 3vw, 3.25rem);
  margin: 0 0 1rem;
}

.cb-privacy-lead,
.cb-privacy-card p,
.cb-privacy-card li,
.cb-privacy-meta {
  color: #44516a;
  line-height: 1.75;
}

.cb-privacy-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  margin-top: 1.25rem;
}

.cb-privacy-section {
  padding: 0.75rem 0 0;
}

.cb-privacy-section .cb-shell {
  display: grid;
  gap: 1rem;
}

.cb-privacy-card {
  padding: 1.5rem 1.6rem;
}

.cb-privacy-card h2 {
  color: var(--cb-ink);
  font-size: 1.2rem;
  margin: 0 0 0.85rem;
}

.cb-privacy-card p,
.cb-privacy-card ul {
  margin: 0;
}

.cb-privacy-card ul {
  padding-left: 1.2rem;
}

.cb-privacy-card li + li,
.cb-privacy-card p + p {
  margin-top: 0.7rem;
}

.cb-privacy-card a {
  color: var(--cb-blue);
  font-weight: 600;
}

@media (max-width: 767px) {
  .cb-privacy-hero {
    padding-top: 1.5rem;
  }

  .cb-privacy-hero__card,
  .cb-privacy-card {
    border-radius: 22px;
  }

  .cb-privacy-hero__card {
    padding: 1.4rem;
  }

  .cb-privacy-card {
    padding: 1.25rem 1.15rem;
  }
}
</style>
