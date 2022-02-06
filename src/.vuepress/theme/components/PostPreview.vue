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
  text-decoration none !important
  color unset

.link
  margin-bottom:32px;
  display: flex;
  justify-content: space-between
  align-items: center
  border-bottom:1px solid rgba(255,255,255,.25)
  padding-bottom:32px;
  
.title
  margin:0px !important;
  margin-bottom:4px !important;
  padding-bottom unset
  border-bottom: none
  color #fff
  font-size 18px !important

.excerpt
  font-weight 400
  color lighten($textColor, 25%)

@media (max-width: $MQMobileNarrow)
  .link
    flex-wrap: wrap
    .right
      width:100%;
      margin-top 8px

</style>
