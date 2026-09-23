<script>
export default {
  name: 'UnmatchedRouteRedirect',
  async asyncData({ redirect }) {
    return redirect(302, '/404')
  }
}
</script>
