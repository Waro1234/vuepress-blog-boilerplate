<template>
  <div class="theme-default-content">
    <article>
      <header class="header">
        <section>
          <TagList :tags="$frontmatter.tags" />
        </section>
        <h1 class="title">{{ $page.title }}</h1>
        <!-- <template v-if="$page.frontmatter.excerpt">
          <p class="excerpt">{{ $page.frontmatter.excerpt }}</p>
        </template> -->
        <section>
          <PostMeta :post="$page" show-updated/>
        </section>
      </header>

      <section>
        <Content class="body" :custom="false"/>
      </section>


      <div class="page-nav" v-if="prev || next">
        <div class="inner">
          <span v-if="prev" class="prev">
            ←
            <router-link v-if="prev" class="prev" :to="prev.path">
              Previous
            </router-link>
          </span>

          <span v-if="next" class="next">
            <router-link v-if="next" :to="next.path">
              Next
            </router-link>
            →
          </span>
        </div>
      </div>

      <slot name="bottom"/>
    </article>
  </div>
</template>

<script>
import moment from 'moment'
import TagList from './TagList'
import PostMeta from './PostMeta'
import { resolvePage, normalize, outboundRE, endingSlashRE } from '../util'

export default {
  components: { TagList, PostMeta },
  props: ['sidebarItems'],

  computed: {
    prev () {
      const prev = this.$page.frontmatter.prev
      if (prev === false) {
        return
      } else if (prev) {
        return resolvePage(this.$site.pages, prev, this.$route.path)
      } else {
        return resolvePrev(this.$page, this.sidebarItems)
      }
    },

    next () {
      const next = this.$page.frontmatter.next
      if (next === false) {
        return
      } else if (next) {
        return resolvePage(this.$site.pages, next, this.$route.path)
      } else {
        return resolveNext(this.$page, this.sidebarItems)
      }
    },

    editLink () {
      if (this.$page.frontmatter.editLink === false) {
        return
      }
      const {
        repo,
        editLinks,
        docsDir = '',
        docsBranch = 'master',
        docsRepo = repo
      } = this.$site.themeConfig

      let path = normalize(this.$page.path)
      if (endingSlashRE.test(path)) {
        path += 'README.md'
      } else {
        path += '.md'
      }
      if (docsRepo && editLinks) {
        return this.createEditLink(repo, docsRepo, docsDir, docsBranch, path)
      }
    },

    editLinkText () {
      return (
        this.$themeLocaleConfig.editLinkText ||
        this.$site.themeConfig.editLinkText ||
        `Edit this page`
      )
    },
  },

  methods: {
    createEditLink (repo, docsRepo, docsDir, docsBranch, path) {
      const bitbucket = /bitbucket.org/
      if (bitbucket.test(repo)) {
        const base = outboundRE.test(docsRepo)
          ? docsRepo
          : repo
        return (
          base.replace(endingSlashRE, '') +
           `/${docsBranch}` +
           (docsDir ? '/' + docsDir.replace(endingSlashRE, '') : '') +
           path +
           `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`
        )
      }

      const base = outboundRE.test(docsRepo)
        ? docsRepo
        : `https://github.com/${docsRepo}`

      return (
        base.replace(endingSlashRE, '') +
        `/edit/${docsBranch}` +
        (docsDir ? '/' + docsDir.replace(endingSlashRE, '') : '') +
        path
      )
    }
  }
}

function resolvePrev (page, items) {
  return find(page, items, -1)
}

function resolveNext (page, items) {
  return find(page, items, 1)
}

function find (page, items, offset) {
  const res = []
  items.forEach(item => {
    if (item.type === 'group') {
      res.push(...item.children || [])
    } else {
      res.push(item)
    }
  })
  for (let i = 0; i < res.length; i++) {
    const cur = res[i]
    if (cur.type === 'page' && cur.path === page.path) {
      return res[i + offset]
    }
  }
}
</script>

<style lang="stylus">
.body
  margin-bottom 3rem
</style>

<style lang="stylus" scoped>
.theme-default-content:not(.custom)
  max-width:70ch;
  padding 0

.header
  padding-bottom 1.5rem
  margin-bottom 1.5rem

.title
  font-size 3.2rem
  margin 0 0 .4em
  margin-bottom .5rem
  color #fff

.page-nav
  position fixed
  bottom 0px
  width 100%
  height 72px
  display flex
  justify-content center
  align-items: center
  left 0px
  max-width: unset
  margin 0
  padding 0
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);

  .inner
    display: flex
    justify-content: space-between
    margin 0
    padding 0
    border-top none
    width:100%
    max-width: 70ch

    .next
      margin-left: auto

@media (max-width: $MQMobile)
  .page-edit
    .edit-link
      margin-bottom .5rem
    .last-updated
      font-size .8em
      float none
      text-align left

@media (max-width: $MQMobileNarrow) {
  .title {
    font-size: 2.441rem;
  }
}
</style>
