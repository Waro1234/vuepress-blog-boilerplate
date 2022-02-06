<template>
	<div class="theme-default-content">
        <div class="header">
            <div class="content">
                <h1>My Daily Draft</h1>
                <article>
                    Personal blog site where I update you on parts of my life and hopefully grow along the way
                </article>
            </div>
            <div class="icon-list">
                <div class="inner">
                    <a href="https://www.linkedin.com/in/stijn-klarenbeek-983188141" target="_blank">
                        <object class="icon" :data="$withBase('svgs/linkedin-svg.svg')" type="image/svg+xml"></object>
                    </a>
                    <a href="https://dribbble.com/Waro" target="_blank">
                        <object class="icon" :data="$withBase('svgs/dribbble-svg.svg')" type="image/svg+xml"></object>
                    </a>
                </div>
            </div>
        </div>

        <!-- Search and tags -->
        <div class="filter-heading">
            <!-- The idea is to have an inner and an outer shell, 
                 the outer shell has the sort button and the inner
                 has the tags and the search bar -->
            <div class="inner">
                <!-- list of scrollable tags -->
                <div class="tag-list">
                   <div class="inner-list">
                        <span class="tag">
                            Personal
                        </span>
                        <span class="tag">
                            Crypto
                        </span>
                        <span class="tag">
                            Design
                        </span>
                        <span class="tag">
                            Development
                        </span>
                   </div>
                </div>

                <!-- Search input -->
                <div class="search-container">
                    <!-- icon and input -->
                    <object class="icon" :data="$withBase('svgs/search-svg.svg')" type="image/svg+xml"></object>
                    <input type="search" placeholder="Search...">
                </div>
            </div>

            <!-- something dropdown with a filter to sort by a-b and date -->
            <div class="sort-container">
                <div class="initiator">
                    Sort by
                    <!-- Add angle down icon -->
                </div>
                <div class="target"></div>
            </div>
        </div>

        <div v-if="selectedTags.length > 0" class="filtered-heading">

            <h2>Filtered by {{ selectedTags.join(',') }}</h2>
            <button
                type="button"
                @click="resetTags"
                class="btn clear-filter-btn"
            >
                Clear filter
            </button>
        </div>


        <ul class="blog-list">
            <li v-for="(item, index) in filteredList" 
                v-bind:key="index"
                class="blog-list__item">

                    <PostPreview 
                        v-on:add-tag="addTag($event)"
                        v-show="index >= currentPage * pageSize && index < (currentPage + 1) * pageSize"
                        :item="item"
                        v-on:tag-click="console.log($event)"
                    />
            </li>
        </ul>

        <div class="pagination">
            <div>
                <a href="#"
                    v-show="currentPage > 0" 
                    @click="previousPage"
                    class="button--pagination" 
                >
                    Newer Posts
                </a>
            </div>
            <div>
                <a href="#"
                    v-show="currentPage < totalPages - 1"
                    @click="nextPage"
                    class="button--pagination"
                >
                    Older Posts
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import PostPreview from './PostPreview'

export default {
    components: { PostPreview },
    props: {
        pages: {
            type: Array,
            default: []
        },
        pageSize: {
            type: Number,
            default: 5
        },
        startPage: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            currentPage: Math.ceil(this.startPage / this.pageSize),
            selectedTags: []
        }
    },
    computed: {
        filteredList() {
            if (this.pages) {
                
                return this.pages.filter(item => {
                    const isBlogPost = !!item.frontmatter.blog
                    const isReadyToPublish = new Date(item.frontmatter.date) <= new Date()
                     // check for locales
                    let isCurrentLocale = true;
                    if(this.$site.locales) {
                        const localePath = this.$route.path.split('/')[1] || "";
                        isCurrentLocale = item.relativePath.startsWith(localePath);   
                    }
                    // check if tags contain all of the selected tags
                    const hasTags = !!item.frontmatter.tags && this.selectedTags.every((tag) => item.frontmatter.tags.includes(tag))

                    if (!isBlogPost || !isReadyToPublish || (this.selectedTags.length > 0 && !hasTags) || !isCurrentLocale){ 
                        return false
                    }

                    return true
                    
                }).sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
            }
        },

        totalPages() {
            
            return Math.ceil(this.filteredList.length / this.pageSize)
        },
    },

    mounted() {
        this.currentPage =  Math.min(Math.max(this.currentPage, 0), this.totalPages - 1)
    },

    methods: {
        nextPage() {
            this.currentPage = this.currentPage >= this.totalPages - 1 ? this.totalPages - 1 : this.currentPage + 1
        },
        previousPage() {
            this.currentPage = this.currentPage < 0 ? 0 : this.currentPage - 1
        },
        addTag(tag) {
            const tagExists = this.selectedTags.some(item => {
                return item === tag
            })

            if (!tagExists){
                this.selectedTags = this.selectedTags.concat(tag)
            }
        },
        removeTag(tag) {
            this.selectedTags.filter(t => t != tag)
        },
        resetTags(){
            this.selectedTags = []
        }
    }
}
</script>

<style lang="stylus" scoped>
html 
    background black

.header 
    display flex
    justify-content flex-start
    align-items stretch

    .content 
        flex:1;

        h1
            color white
            font-weight bold
            line-height 130%
            font-size: 56px
            margin: 0
            margin-bottom:16px;
        article
            max-width:400px;
            
    .icon-list
        display: inline-flex;
        justify-content: flex-end;

        .inner
            padding-top:24px;
            a
                display inline-flex
                padding-right:24px
                opacity: .55
                transition: 250ms

                .icon
                    width 24px
                    height 24px
                    pointer-events: none;
                    
                &:hover
                    opacity: 1
                    transition: 250ms

                &:last-of-type
                    padding-right:0px
                

.filter-heading
    margin: 96px 0px;
    display: flex;
    justify-content: center
    align-items: center
    height:40px;

    .inner
        display: flex;
        height:inherit;
        border-radius:20px;
        flex:1;
        background: rgba(255,255,255,.25)
        justify-content: space-between
        align-items: center
        padding-right:4px;
        max-width: calc(900px - 90px);

        .tag-list
            flex:1
            overflow: hidden;
            height:48px;
            margin 0 24px;
            
            .inner-list
                height: 90px; /* 40px - more place for scrollbar, is hidden under parent box */
                padding-top:14px;
                white-space: nowrap;
                overflow-x: scroll;
                overflow-y: hidden;
                -webkit-overflow-scrolling: touch;
            
            .tag
                display inline-block
                padding 0 12px
                color #fff
                font-size: 16px

        .tag-list span:first-of-type
            margin-left 0px
            padding-left 0px

        .tag-list span:last-of-type
            padding-right:0px;
            margin-right:0px;

        .search-container
            width:240px;
            background: rgba(255,255,255,.25);
            height:32px;
            border-radius:16px;
            display flex
            justify-content: flex-start
            align-items: center
            padding-left:16px;
            padding-right:16px;

            .icon
                width:16px;
                height:16px;

            input
                appearance: none
                --moz-appearance: none
                -webkit-appearance: none
                border: none
                background: none
                color: #fff
                box-shadow: none
                font-size: 16px; 
                margin-left:8px;
                width:100%;

                &:focus, &focus-visible
                    border:none
                    box-shadow: none
                    outline:none

    .sort-container
        box-sizing: border-box;
        padding: 0 16px;

        .initiator
            color #fff
            font-size: 16px

.blog-list
    padding 0
    margin 0

.blog-list__item
    list-style-type none

.blog-list__tags
    margin-bottom 15px

.button--pagination
    text-decoration none
    color lighten($textColor, 25%)
    &:hover
        text-decoration none !important
        border-bottom 2px solid $accentColor

.clear-filter-btn
    align-self center
    margin-left 20px

.filtered-heading
    display flex

.pagination
    display flex
    justify-content space-between


@media (max-width: $MQNarrow)
    .theme-default-content:not(.custom)
        max-width:724.9px;
        padding-left 48px;
        padding-right:48px;
        box-sizing: border-box;

    .filter-heading
        margin 72px 0

        .inner
            max-width: calc(628.89px - 90.07px)

            .search-container
                width 180px

@media (max-width: $MQMobile)
    .theme-default-content:not(.custom)
        padding-bottom 56px
        
    .header 
        flex-wrap:wrap;
        .content
            order: 2
            h1 
                font-size: 2.441rem !important;
        .icon-list
            width:100%;
            order:1
            justify-content: flex-start
            .inner
                padding-top 0
                padding-bottom 20px

    .filter-heading
        display: block
        height:unset
        position relative
        margin 56px 0

        .inner
            height: unset
            display: block
            width:100%;
            max-width: unset
            margin-right: 0px
            background: none

            .tag-list
                background rgba(255,255,255,.25)
                height 40px
                margin 0
                padding 0 24px
                border-radius 20px
                .inner-list
                    padding-top:10.285px
            
            .search-container
                width calc(100% - 82.07px)
                box-sizing: border-box
                height:40px
                border-radius:20px
                margin-top:16px;

        .sort-container
            position: absolute
            right:0px;
            bottom:0px;

            .initiator
                height 40px
                display: flex
                justify-content: center
                align-items: center


@media (max-width: $MQMobileNarrow)
    .theme-default-content:not(.custom)
        max-width:676.9px;
        padding-left 24px;
        padding-right:24px;
        box-sizing: border-box;
        padding-bottom 48px

    .header h1 
        font-size: 2.441rem !important;
  
</style>
