<template>
  <TramitesPage :initial-page="infoPage" />
</template>

<script>
import TramitesPage from './tramites.vue'

export default {
  name: 'InformacionPostalPage',
  components: { TramitesPage },
  async asyncData({ $api }) {
    let infoPage = null
    for (const endpoint of ['/frontapi/api/site/pages/informacion-postal', '/api/site/pages/informacion-postal']) {
      try {
        infoPage = await $api.$get(endpoint)
        if (infoPage) break
      } catch (error) {
        // Try the next API base when the first one is unavailable.
      }
    }
    return { infoPage }
  },
  head() {
    return { title: 'Informacion Postal | Correos de Bolivia', htmlAttrs: { lang: 'es' } }
  }
}
</script>
