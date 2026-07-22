<template>
  <div />
</template>

<script>
export default {
  name: 'PoliticaPrivacidadRedirectPage',
  middleware({ redirect }) {
    return redirect('/politica-privacidad-trackingbo-app')
  },
  head() {
    return {
      title: 'Redirigiendo | Correos de Bolivia',
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex'
        }
      ]
    }
  }
}
</script>
