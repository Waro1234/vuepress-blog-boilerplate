<template>
  <div class="theme-default-content">
    <article>

      <router-link class="go-back" to="/">
        <span class="arrow">←</span>
        Go home
      </router-link>

      <header class="header">
        <div class="left">
          <h1 class="title">{{ $page.title }}</h1>
          <!-- <template v-if="$page.frontmatter.excerpt">
            <p class="excerpt">{{ $page.frontmatter.excerpt }}</p>
          </template> -->
          <section>
            <PostMeta :post="$page" show-updated/>
          </section>
        </div>
        <section class="right">
          <TagList :tags="$frontmatter.tags" />
        </section>
      </header>

      <section>
        <Content class="body" :custom="false"/>
      </section>


      <div class="page-nav" v-if="prev || next">
        <div class="inner">
          <router-link v-if="prev" class="prev" :to="prev.path">
            <span class="arrow">←</span>
            Previous
          </router-link>

          <router-link class="next" v-if="next" :to="next.path">
            Next
            <span class="arrow">→</span>
          </router-link>
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

<style lang="stylus" scoped>
.body
  margin-bottom 3rem

.theme-default-content:not(.custom)
  max-width:628.9px;
  padding 0
  padding-bottom 72px //height of footer
  padding-top 72px

.go-back
  font-size:16px;
  text-decoration: none !important
  color #fff
  position relative

  .arrow
    color rgba(255,255,255,.75)
    width: unset
    height: unset
    font-weight:400;
    display: inline-block
    margin-right:8px;

  &:hover
    text-decoration: none

  &:hover:after
    display: block
    content: ''
    position absolute
    width:100%
    left:0px
    bottom:-4px;
    height 2px
    background-color rgb(12,255,255)

.header
  margin-top:1.5rem;
  padding-top:1.5rem;
  padding-bottom 1.5rem
  margin-bottom 1.5rem
  display: flex;
  justify-content: space-between
  align-items: flex-start

  .left
    flex:1;
  .right
    display: inline-block
    width:auto;
    padding-top 20px

.title
  font-size 56px
  margin 0 0 .4em
  margin-bottom 0
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
    max-width: 628.9px
    overflow:visible

    .next,.prev
      color #fff
      font-weight:500;
      position relative

      .arrow
        color rgba(255,255,255,.75)
        width: unset
        height: unset
        font-weight:400;
        display: inline-block

      &:hover
        text-decoration: none

      &:hover:after
        display: block
        content: ''
        position absolute
        width:100%
        left:0px
        bottom:-4px;
        height 2px
        background-color rgb(12,255,255)

    .next
      margin-left: auto

      .arrow
        color rgba(255,255,255,.75)
        margin-left:8px;
    .prev
      .arrow
        margin-right 8px

@media (max-width: $MQNarrow)
  .theme-default-content:not(.custom)
    max-width:724.9px;
    padding-left 48px;
    padding-right:48px;
    box-sizing: border-box;
  
  .header
    flex-wrap: wrap

    .right
      width 100%

  .page-nav
    .inner
      padding-left 48px;
      padding-right:48px;
      max-width:724.9px;
      box-sizing: border-box;

@media (max-width: $MQMobile)
  .theme-default-content:not(.custom)
    padding-bottom 56px

  .page-nav
    height 56px

@media (max-width: $MQMobileNarrow)
  .theme-default-content:not(.custom)
    max-width:676.9px;
    padding-left 24px;
    padding-right:24px;
    box-sizing: border-box;
    padding-bottom 48px
  
  .page-nav
    height 48px
    
    .inner
      max-width:676.9px;
      padding-left 24px;
      padding-right:24px;
      box-sizing: border-box;

  .title 
    font-size: 2.441rem;
  

</style>
