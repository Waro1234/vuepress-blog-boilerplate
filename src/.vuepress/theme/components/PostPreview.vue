<template>

  <router-link class="link" :to="item.path">
    <div class="left">
        <h2 class="title">{{ item.frontmatter.title }}</h2>
        <PostMeta :post="item" />
    </div>
    <div class="right">
      <!-- Tags here-->
      <TagList :tags="item.frontmatter.tags" v-on:tag-click="$emit('add-tag', $event)" />
    </div>
  </router-link>
</template>

<script>
import TagList from './TagList'
import PostMeta from './PostMeta'

export default {
  name: 'PostPreview',
  components: { TagList, PostMeta },
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.post-preview
  margin 60px 0

.link, .link:hover
  display block
  text-decoration none !important
  color unset
  
.title
  font-size 2.2rem
  margin 0 0 0.4em
  padding-bottom unset

.excerpt
  font-weight 400
  color lighten($textColor, 25%)

h2
  border-bottom: none
  color #fff
  font-size 22px !important

</style>
