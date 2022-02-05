<template>
  <ul class="list">
      <li class="list-item" v-for="tag in tags">
        <a href="#" @click="$emit('tag-click', tag)">
          <span :class="getTagClass">{{ tag }}</span>                
        </a>
      </li>
    </ul>
</template>

<script>
export default {
  props: ['tags'],
  computed: {
    getTagClass: function () {
      return 'tag ' + this.tags.toString().toLowerCase();
    }
  }
}
</script>

<style lang="stylus" scoped>
.list
  display flex
  list-style none
  margin 0
  padding 0

.list-item
  margin-right 4px

.tag
  display inline-block
  font-size 16px
  font-weight 700
  line-height 1
  text-align center
  white-space nowrap
  vertical-align baseline
  border-radius 16px;
  line-height: 32px
  padding: 0px 16px;

.tag.personal
  background: rgba(255,209,155,.35);
  color: #FFD19B;

.tag.crypto
  color:#0CFFFF;
  background: rgba(12,255,255,.35);

</style>