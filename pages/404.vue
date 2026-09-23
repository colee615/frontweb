<template>
  <StatusPage variant="not-found" :site-page="sitePage" />
</template>

<script>
import { createEmptySiteShell, fetchSiteShell } from '~/utils/statusPageData'

export default {
  name: 'NotFoundPage',
  async asyncData({ $api }) {
    return { sitePage: (await fetchSiteShell($api)) || createEmptySiteShell() }
  },
  async mounted() {
    const sitePage = await fetchSiteShell(this.$api)
    if (sitePage) this.sitePage = sitePage
  },
  head() {
    return { title: 'Página no encontrada | Correos de Bolivia', htmlAttrs: { lang: 'es' } }
  }
}
</script>
