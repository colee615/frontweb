<template>
  <div />
</template>

<script>
export default {
  name: 'MisAplicaiconesLegacyRedirect',
  middleware({ redirect }) {
    redirect('/misaplicaciones')
  }
}
</script>
