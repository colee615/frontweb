<template>
  <TramitesPage :initial-page="infoPage" />
</template>

<script>
import TramitesPage from './tramites.vue'
import { fetchPageWithSharedLayout } from '~/utils/sharedLayout'

export default {
  name: 'InformacionPostalPage',
  components: { TramitesPage },
  async asyncData({ $api }) {
    const endpoints = ['/frontapi/api/site/pages/informacion-postal', '/api/site/pages/informacion-postal']
    const infoPage = await fetchPageWithSharedLayout($api, endpoints)
    return { infoPage }
  },
  head() {
    return { title: 'Informacion Postal | Correos de Bolivia', htmlAttrs: { lang: 'es' } }
  }
}
</script>
