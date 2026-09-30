<template>
  <section v-if="recentArticles.length" id="home-news" class="cb-home-news" aria-labelledby="home-news-title">
    <div class="cb-shell">
      <header class="cb-home-news__header">
        <div class="cb-home-news__intro">
          <div v-if="eyebrowText" class="cb-home-news__eyebrow">
            <span></span>
            <span>{{ eyebrowText }}</span>
          </div>
          <h2 v-if="settings.title" id="home-news-title">{{ settings.title }}</h2>
          <p v-if="settings.subtitle">{{ settings.subtitle }}</p>
        </div>
        <a
          v-if="settings.view_all_label && settings.view_all_url"
          class="cb-home-news__all"
          :href="settings.view_all_url"
        >
          <span>{{ settings.view_all_label }}</span>
          <span class="cb-home-news__arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13m-6-6 6 6-6 6" /></svg>
          </span>
        </a>
      </header>

      <div class="cb-home-news__grid">
        <article v-for="article in recentArticles" :key="article.id || article.slug || article.title" class="cb-home-news-card">
          <nuxt-link :to="articleLink(article)" class="cb-home-news-card__media-link" :aria-label="article.title">
            <div class="cb-home-news-card__media">
              <video
                v-if="isVideo(article) && mediaUrl(article)"
                :src="mediaUrl(article)"
                :poster="article.poster_image || null"
                autoplay
                muted
                loop
                playsinline
                preload="metadata"
                aria-hidden="true"
              />
              <img
                v-else-if="mediaUrl(article)"
                :src="mediaUrl(article)"
                :alt="article.image_alt || article.title"
                loading="lazy"
                decoding="async"
              >
            </div>
          </nuxt-link>

          <div class="cb-home-news-card__body">
            <div class="cb-home-news-card__meta">
              <span v-if="article.date" class="cb-home-news-card__meta-item">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M8 3v4m8-4v4M4 10h16m-11 4h2m3 0h2m-7 4h2" /></svg>
                {{ article.date }}
              </span>
              <span v-if="article.category" class="cb-home-news-card__meta-item cb-home-news-card__category">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m20 13-7 7L3 10V3h7l10 10Z" /><path d="M7.5 7.5h.01" /></svg>
                {{ article.category }}
              </span>
            </div>
            <h3><nuxt-link :to="articleLink(article)">{{ article.title }}</nuxt-link></h3>
            <p v-if="article.excerpt">{{ article.excerpt }}</p>
            <nuxt-link v-if="settings.cta_label" :to="articleLink(article)" class="cb-home-news-card__read">
              <span>{{ settings.cta_label }}</span>
              <span class="cb-home-news-card__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13m-6-6 6 6-6 6" /></svg>
              </span>
            </nuxt-link>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeNews',
  props: {
    articles: { type: Array, default: () => [] },
    settings: { type: Object, default: () => ({}) },
    eyebrow: { type: String, default: '' }
  },
  computed: {
    eyebrowText() {
      return this.settings.eyebrow || this.eyebrow
    },
    recentArticles() {
      return this.articles.slice(0, 3)
    }
  },
  methods: {
    mediaUrl(article) {
      return article.media_url || article.image || ''
    },
    isVideo(article) {
      return article.media_type === 'video' || /\.(mp4|webm)(\?.*)?$/i.test(this.mediaUrl(article))
    },
    articleLink(article) {
      const slug = article.slug || article.id || this.slugify(article.title)
      return `/noticias/${encodeURIComponent(slug)}`
    },
    slugify(value) {
      return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
  }
}
</script>
