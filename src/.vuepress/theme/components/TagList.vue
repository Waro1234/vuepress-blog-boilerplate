<template>
  <ul class="list">
      <li class="list-item" v-for="(tag,index) in tags" v-bind:key="'tag'+index">
          <span :class="getTagClass(tag)">{{ tag }}</span>                
      </li>
    </ul>
</template>

<script>
export default {
  props: ['tags'],
  methods: {
    getTagClass: function (tag) {
      // var tagString = "";
      // for(var i = 0; i < this.tags.length; i++) {
      //   tagString += this.tags[i].toLowerCase() + " ";
      // }
      return 'tag ' + tag.toString().toLowerCase();
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

.list li:last-of-type
  margin-right 0 !important

.list-item
  margin-right 8px


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

.tag.development
  background: rgba(155,231,255,.35);
  color:#9BE7FF;

.tag.design
  color:#A39BFF;
  background: rgba(163,155,255,.35);

.tag.cx13
  color: #9BC3FF;
  background: rgba(155,195,255,.35);

</style>