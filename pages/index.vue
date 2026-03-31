<template>
  <div class="cb-page" :style="themeStyles" :class="{ 'cb-page--ready': !isBootLoading }">
    <transition name="cb-page-loader">
      <div v-if="isBootLoading" class="cb-page-loader" aria-live="polite" aria-busy="true">
        <div class="cb-page-loader__backdrop" />
        <div class="cb-page-loader__panel">
          <div class="cb-page-loader__brand">
            <div class="cb-page-loader__logo">
              <img v-if="logoUrl" :src="logoUrl" alt="Correos de Bolivia" />
            </div>
            <div class="cb-page-loader__copy">
              <span class="cb-page-loader__eyebrow">Cargando contenido actualizado</span>
              <h2>Estamos preparando tu experiencia</h2>
              <p>Recuperamos la informacion del servidor para mostrar el sitio completo y sin saltos visuales.</p>
            </div>
          </div>
          <div class="cb-page-loader__pulse">
            <span />
            <span />
            <span />
          </div>
          <div class="cb-page-loader__bar">
            <span />
          </div>
        </div>
      </div>
    </transition>
    <div class="cb-page__content">
      <HomeAnnouncementModal :content="sectionSettings.announcement_modal" :slides="announcementSlides" />
      <HomeHeader :logo-url="logoUrl" :icons="icons" :content="sectionSettings.header" :links="headerLinks" />
      <HomeHero :icons="icons" :content="sectionSettings.hero" :slides="heroSlides" />
      <HomeServices :services="services" :icons="icons" :content="sectionSettings.services" />
      <HomeTools :icons="icons" :content="sectionSettings.tools" :offices="toolOffices" />
      <HomeAppBanner :content="sectionSettings.app_banner" :slides="appBannerSlides" />
      <HomeMarket :products="products" :icons="icons" :content="sectionSettings.market" />
      <HomeFooter :logo-url="logoUrl" :icons="icons" :content="sectionSettings.footer" :links="footerLinks" />
    </div>
  </div>
</template>

<script>
import { sanitizeContentTree } from '~/utils/contentSecurity'

const DEFAULT_TOOL_OFFICES = [
  {
    title: 'Oficina Correos Cobija',
    name: 'Cobija',
    dept: 'BON',
    address: 'Av. 9 de Febrero, Cobija, Pando',
    hours: 'Lun a Vie, 08:30 a 16:30',
    weekday_hours: '08:30 a 16:30',
    saturday_hours: '09:00 a 12:30',
    phone: '+591 3 8420001',
    left: '33.2%',
    top: '16.5%',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=-11.0267,-68.7692'
  },
  {
    title: 'Oficina Central La Paz',
    name: 'La Paz',
    dept: 'BOL',
    address: 'Av. Mariscal Santa Cruz, La Paz',
    hours: 'Lun a Vie, 08:00 a 18:00',
    weekday_hours: '08:00 a 18:00',
    saturday_hours: '09:00 a 13:00',
    phone: '+591 2 2312121',
    left: '29.6%',
    top: '46%',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=-16.4957,-68.1336'
  },
  {
    title: 'Oficina Correos Trinidad',
    name: 'Trinidad',
    dept: 'BOB',
    address: 'Zona Central, Trinidad, Beni',
    hours: 'Lun a Vie, 08:30 a 16:30',
    weekday_hours: '08:30 a 16:30',
    saturday_hours: '09:00 a 12:30',
    phone: '+591 3 4622001',
    left: '43.8%',
    top: '35.5%',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=-14.8333,-64.9'
  },
  {
    title: 'Oficina Correos Oruro',
    name: 'Oruro',
    dept: 'BOO',
    address: 'Calle La Plata, Oruro',
    hours: 'Lun a Vie, 08:30 a 16:30',
    weekday_hours: '08:30 a 16:30',
    saturday_hours: '09:00 a 12:30',
    phone: '+591 2 5277001',
    left: '31.8%',
    top: '67.2%',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=-17.9647,-67.106'
  },
  {
    title: 'Oficina Correos Cochabamba',
    name: 'Cochabamba',
    dept: 'BOC',
    address: 'Av. Ayacucho, Cochabamba',
    hours: 'Lun a Vie, 08:00 a 17:30',
    weekday_hours: '08:00 a 17:30',
    saturday_hours: '09:00 a 12:30',
    phone: '+591 4 4528001',
    left: '41.8%',
    top: '58.5%',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=-17.3895,-66.1568'
  },
  {
    title: 'Oficina Correos Santa Cruz',
    name: 'Santa Cruz',
    dept: 'BOS',
    address: 'Av. Irala, Santa Cruz de la Sierra',
    hours: 'Lun a Vie, 08:00 a 17:30',
    weekday_hours: '08:00 a 17:30',
    saturday_hours: '09:00 a 12:30',
    phone: '+591 3 3366001',
    left: '59.2%',
    top: '58%',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=-17.7833,-63.1821'
  },
  {
    title: 'Oficina Correos Sucre',
    name: 'Sucre',
    dept: 'BOH',
    address: 'Calle Aniceto Arce, Sucre',
    hours: 'Lun a Vie, 08:30 a 16:30',
    weekday_hours: '08:30 a 16:30',
    saturday_hours: '09:00 a 12:30',
    phone: '+591 4 6459001',
    left: '46.6%',
    top: '75.2%',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=-19.047,-65.2595'
  },
  {
    title: 'Oficina Correos Potosi',
    name: 'Potosi',
    dept: 'BOP',
    address: 'Zona Central, Potosi',
    hours: 'Lun a Vie, 08:30 a 16:30',
    weekday_hours: '08:30 a 16:30',
    saturday_hours: '09:00 a 12:30',
    phone: '+591 2 6229001',
    left: '35.7%',
    top: '81.2%',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=-19.5723,-65.755'
  },
  {
    title: 'Oficina Correos Tarija',
    name: 'Tarija',
    dept: 'BOT',
    address: 'Calle General Trigo, Tarija',
    hours: 'Lun a Vie, 08:30 a 16:30',
    weekday_hours: '08:30 a 16:30',
    saturday_hours: '09:00 a 12:30',
    phone: '+591 4 6648001',
    left: '47.7%',
    top: '87.5%',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=-21.5355,-64.7296'
  }
]

const FALLBACK_PAGE = {
  meta_title: 'Correos de Bolivia',
  meta_description: '',
  theme: {
    logo_url: 'https://correos.gob.bo/wp-content/uploads/2023/06/LOGO-19-2-26-B-scaled.png',
    primary_color: '#20539a',
    secondary_color: '#2f3f5c',
    accent_color: '#fecc36'
  },
  sections: [
    {
      key: 'announcement_modal',
      settings: {
        enabled: false,
        show_once: false,
        storage_key: 'cb-home-invitation-2026',
        modal_title: 'Invitacion oficial',
        poster_image: '',
        poster_alt: 'Comunicado institucional'
      },
      items: []
    },
    { key: 'header', settings: { help_label: 'Ayuda / Contacto', login_label: 'Iniciar Sesion', search_placeholder: 'Buscar...', language_primary: 'Espanol', language_secondary: 'English', accessibility_label: 'Accesibilidad' }, items: [{ data: { label: 'Quienes somos', url: '#' } }, { data: { label: 'Noticias', url: '#' } }, { data: { label: 'Institucional', url: '#' } }] },
    { key: 'hero', settings: { title: 'Conectando Bolivia|con el Mundo', subtitle: 'Servicio postal confiable, rapido y seguro', tracking_title: 'Rastrea tu Envio', tracking_text: 'Ingresa tu codigo de seguimiento para conocer el estado de tu paquete', tracking_label: 'Codigo de seguimiento', tracking_placeholder: 'Ej: PE123456789', tracking_button: 'Buscar' }, items: [{ data: { title: 'Principal', media_type: 'image', src: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=80', poster: '' } }] },
    { key: 'services', settings: { title: 'Servicios Destacados', subtitle: 'Soluciones integrales para todas tus necesidades de envio', kicker: 'Servicio destacado' }, items: [{ data: { icon: 'plane', iconImage: '/IconosWEB-normalized/Icono EMS Bolivia.png', title: 'EMS', text: 'Envio expreso internacional' } }, { data: { icon: 'truck', iconImage: '/IconosWEB-normalized/Icono Delivery.png', title: 'Delivery Express', text: 'Entregas rapidas nacionales' } }, { data: { icon: 'mail', title: 'Correspondencia Agrupada', text: 'Envios de correspondencia masiva' } }, { data: { icon: 'box', iconImage: '/IconosWEB-normalized/Icono Encomienda Postal.png', title: 'Encomienda Postal', text: 'Paquetes y encomiendas' } }, { data: { icon: 'grid', iconImage: '/IconosWEB-normalized/ICONOS NUEVOS casillas postales.png', title: 'Casillas', text: 'Casillas postales de alquiler' } }, { data: { icon: 'cube', iconImage: '/IconosWEB-normalized/Icono Mi Encomienda.png', title: 'Mi Encomienda', text: 'Seguimiento personalizado' } }, { data: { icon: 'clock', iconImage: '/IconosWEB-normalized/Icono Servicio Prioritario.png', title: 'Servicio Prioritario', text: 'Entregas con prioridad' } }, { data: { icon: 'stamp', iconImage: '/IconosWEB-normalized/Icono Filatelia.png', title: 'Filatelia', text: 'Sellos y colecciones' } }, { data: { icon: 'pin', title: 'Red Nacional', text: 'Oficinas en todo el pais' } }] },
    { key: 'tools', settings: { map_title: 'Mapa de Oficinas', map_text: 'Encuentra la oficina de Correos más cercana a tu ubicación', map_button_label: 'Ver Todas las Oficinas', calculator_title: 'Calculadora de Tarifas', calculator_text: 'Calcula el costo de tu envio de manera rapida', origin_label: 'Ciudad de Origen', origin_placeholder: 'Selecciona una ciudad', destination_label: 'Ciudad de Destino', destination_placeholder: 'Selecciona una ciudad', weight_label: 'Peso (kg)', weight_placeholder: 'Ej: 2.5', calculate_button_label: 'Calcular Tarifa' }, items: [] },
    { key: 'app_banner', settings: { title: 'Nueva App de Correos de Bolivia', text: 'Descargala ahora y gestiona tus envios desde tu movil con total comodidad', app_store_label: 'Disponible en|App Store', play_store_label: 'Disponible en|Google Play', app_store_url: '#', play_store_url: '#', background_image: '' }, items: [] },
    { key: 'market', settings: { title: 'Correos Market / Filatelia', subtitle: 'Descubre nuestra coleccion exclusiva de sellos y souvenirs', view_all_label: 'Ver todos los productos ->', view_all_url: '#' }, items: [{ data: { title: 'Coleccion Bolivia 2026', price: 'Bs. 85.00', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Bolivia_stamp_1988.jpg/320px-Bolivia_stamp_1988.jpg', year: '2026', series: 'Coleccion Oficial', description: 'Una pieza conmemorativa pensada para coleccionistas que valoran la identidad postal boliviana.' } }, { data: { title: 'Serie Especial Patrimonio', price: 'Bs. 120.00', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Bolivia_stamp_1951.jpg/320px-Bolivia_stamp_1951.jpg', year: 'Edicion Especial', series: 'Patrimonio Cultural', description: 'Serie dedicada al legado historico y arquitectonico, con una presentacion elegante y coleccionable.' } }, { data: { title: 'Sellos Conmemorativos', price: 'Bs. 65.00', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Bolivia_1868_5c_stamp.jpg/320px-Bolivia_1868_5c_stamp.jpg', year: 'Serie Clasica', series: 'Memoria Postal', description: 'Una seleccion de emisiones historicas con valor documental y un acabado visual refinado.' } }, { data: { title: 'Album Filatelico Premium', price: 'Bs. 200.00', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bolivia_stamp_1938.jpg/320px-Bolivia_stamp_1938.jpg', year: 'Premium', series: 'Edicion Institucional', description: 'Un formato distinguido para preservar piezas filatelicas con mejor presentacion y cuidado editorial.' } }] },
    { key: 'footer', settings: { help_title: 'Ayuda', company_title: 'Empresa', contact_title: 'Contacto', social_title: 'Siguenos', social_text: 'Mantente conectado con nosotros en redes sociales', address: 'Av. Mariscal Santa Cruz 1278|La Paz, Bolivia', phone: '+591 2 2356789|0800-10-5050 (Gratis)', email: 'info@correos.bo', copyright: '© 2026 Correos de Bolivia. Todos los derechos reservados.', legal_text: 'Empresa Publica Nacional Estrategica' }, items: [{ data: { group: 'help', label: 'Preguntas Frecuentes', url: '#' } }, { data: { group: 'help', label: 'Como Rastrear un Envio', url: '#' } }, { data: { group: 'help', label: 'Tarifas y Servicios', url: '#' } }, { data: { group: 'help', label: 'Reclamos', url: '#' } }, { data: { group: 'help', label: 'Terminos y Condiciones', url: '#' } }, { data: { group: 'company', label: 'Sobre Nosotros', url: '#' } }, { data: { group: 'company', label: 'Nuestra Historia', url: '#' } }, { data: { group: 'company', label: 'Trabaja con Nosotros', url: '#' } }, { data: { group: 'company', label: 'Noticias', url: '#' } }, { data: { group: 'company', label: 'Responsabilidad Social', url: '#' } }, { data: { group: 'social', label: 'f', aria_label: 'Facebook', url: '#' } }, { data: { group: 'social', label: 'x', aria_label: 'Twitter', url: '#' } }, { data: { group: 'social', label: 'ig', aria_label: 'Instagram', url: '#' } }, { data: { group: 'social', label: 'in', aria_label: 'LinkedIn', url: '#' } }] }
  ]
}

export default {
  name: 'IndexPage',
  data() {
    return {
      isBootLoading: true
    }
  },
  async asyncData({ $api }) {
    try {
      const payload = await $api.$get('/api/site/pages/home')

      return {
        pageContent: normalizePageContent(payload)
      }
    } catch (error) {
      return {
        pageContent: normalizePageContent()
      }
    }
  },
  async mounted() {
    await this.refreshPageContent()
  },
  computed: {
    logoUrl() {
      return this.pageContent.theme.logo_url || FALLBACK_PAGE.theme.logo_url
    },
    services() {
      return this.getSectionItems('services')
    },
    heroSlides() {
      return this.getSectionItems('hero')
    },
    products() {
      return this.getSectionItems('market')
    },
    toolOffices() {
      const items = this.getSectionItems('tools')
      return items.length ? items : DEFAULT_TOOL_OFFICES
    },
    headerLinks() {
      return this.getSectionItems('header')
    },
    footerLinks() {
      return this.getSectionItems('footer')
    },
    sectionSettings() {
      return {
        announcement_modal: this.getSectionSettings('announcement_modal'),
        header: this.getSectionSettings('header'),
        hero: this.getSectionSettings('hero'),
        services: this.getSectionSettings('services'),
        tools: this.getSectionSettings('tools'),
        app_banner: this.getSectionSettings('app_banner'),
        market: this.getSectionSettings('market'),
        footer: this.getSectionSettings('footer')
      }
    },
    announcementSlides() {
      return this.getSectionItems('announcement_modal')
    },
    appBannerSlides() {
      const items = this.getSectionItems('app_banner')

      if (items.length) {
        return items
      }

      const settings = this.getSectionSettings('app_banner')

      if (!settings.background_image) {
        return []
      }

      return [{
        title: 'Banner principal',
        image: settings.background_image,
        duration_seconds: 5
      }]
    },
    themeStyles() {
      const theme = this.pageContent.theme || {}

      return {
        '--cb-blue': theme.primary_color || FALLBACK_PAGE.theme.primary_color,
        '--cb-yellow': theme.accent_color || FALLBACK_PAGE.theme.accent_color,
        '--cb-ink': theme.secondary_color || FALLBACK_PAGE.theme.secondary_color
      }
    },
    icons() {
      return {
        search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="20" y1="20" x2="16.65" y2="16.65"></line></svg>',
        plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path></svg>',
        truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="1.5"></circle><circle cx="18.5" cy="18.5" r="1.5"></circle></svg>',
        mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
        box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="M3.3 7l8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>',
        grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
        cube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="M3.3 7l8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>',
        clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v6l4 2"></path></svg>',
        stamp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4.8h8"></path><path d="M6.8 6.2h10.4v11.1H6.8z"></path><path d="M9.4 8.8h5.2v5.4H9.4z"></path><path d="M6.8 9.2H5.6"></path><path d="M6.8 12H5.6"></path><path d="M6.8 14.8H5.6"></path><path d="M18.4 9.2h-1.2"></path><path d="M18.4 12h-1.2"></path><path d="M18.4 14.8h-1.2"></path><path d="M9.2 17.3h5.6"></path></svg>',
        pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
        calculator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"></rect><path d="M9 6h6"></path><path d="M9 11h.01"></path><path d="M12 11h.01"></path><path d="M15 11h.01"></path><path d="M9 15h.01"></path><path d="M12 15h.01"></path><path d="M15 15h.01"></path><path d="M9 19h6"></path></svg>',
        phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"></rect><path d="M12 18h.01"></path></svg>',
        download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 21h14"></path></svg>',
        cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1"></circle><circle cx="18" cy="20" r="1"></circle><path d="M2 3h3l3.6 10.59a1 1 0 0 0 .95.68H19a1 1 0 0 0 .96-.73L22 6H7"></path></svg>',
        'phone-call': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.64 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.3a2 2 0 0 1 2.11-.45c.85.3 1.74.52 2.64.64A2 2 0 0 1 22 16.92z"></path></svg>',
        globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
        accessibility: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.8"></circle><path d="M7 8h10"></path><path d="M12 8v5"></path><path d="m9 21 3-6 3 6"></path><path d="m8 12 4 2 4-2"></path></svg>',
        help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"></path><path d="M12 17h.01"></path></svg>',
        login: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path></svg>'
      }
    }
  },
  methods: {
    async refreshPageContent() {
      const startedAt = Date.now()

      try {
        const payload = await this.$api.$get('/api/site/pages/home')
        this.pageContent = normalizePageContent(payload)
      } catch (error) {
        // Keep the rendered content already available and simply reveal it.
      } finally {
        const minimumRevealDelay = 900
        const elapsed = Date.now() - startedAt
        const remaining = Math.max(0, minimumRevealDelay - elapsed)

        window.setTimeout(() => {
          this.isBootLoading = false
        }, remaining)
      }
    },
    getSectionSettings(key) {
      const section = this.pageContent.sections.find((item) => item.key === key)
      return section ? section.settings || {} : {}
    },
    getSectionItems(key) {
      const section = this.pageContent.sections.find((item) => item.key === key)

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
      title: this.pageContent.meta_title || 'Correos de Bolivia',
      meta: [
        { hid: 'description', name: 'description', content: this.pageContent.meta_description || '' }
      ],
      htmlAttrs: { lang: 'es' }
    }
  }
}

function normalizePageContent(payload = {}) {
  const sectionMap = payload.section_map || {}
  const fallbackSectionMap = FALLBACK_PAGE.sections.reduce((accumulator, section) => {
    accumulator[section.key] = section
    return accumulator
  }, {})

  const normalizedSections = Object.keys(fallbackSectionMap).map((key, index) => {
    const fallbackSection = fallbackSectionMap[key]
    const payloadSection = sectionMap[key] || (Array.isArray(payload.sections) ? payload.sections.find((section) => section.key === key) : null)

    if (!payloadSection) {
      return fallbackSection
    }

    return {
      ...fallbackSection,
      ...payloadSection,
      sort_order: typeof payloadSection.sort_order === 'number' ? payloadSection.sort_order : index,
      settings: {
        ...(fallbackSection.settings || {}),
        ...(payloadSection.settings || {})
      },
      items: Array.isArray(payloadSection.items) ? payloadSection.items : fallbackSection.items
    }
  })

  return {
    ...FALLBACK_PAGE,
    ...payload,
    theme: {
      ...FALLBACK_PAGE.theme,
      ...sanitizeContentTree(payload.theme || {})
    },
    sections: normalizedSections.map((section) => sanitizeContentTree(section))
  }
}
</script>
<style src="~/assets/css/home.css"></style>
