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
                        <span :class="{tag: true, active: tagIsActive(tag)}" v-for="(tag,index) in tags" v-bind:key="tag+index" v-on:click="toggleTag(tag)">
                            {{tag}}
                        </span>
                   </div>
                </div>

                <!-- Search input -->
                <div class="search-container">
                    <SearchBox placeholder="Search"/>
                </div>
            </div>

            <!-- something dropdown with a filter to sort by a-b and date -->
            <div class="sort-container">
                <div class="initiator" v-on:click="toggleDropdown()">
                    Sort by
                    <!-- Add angle down icon -->
                </div>
                <div class="target" v-if="dropdownactive">
                    <ul>
                        <li :class="{active : activeSortClass == 'date-l-f'}"  v-on:click="activateSort('date-l-f')">
                            Date <span>(L &mdash; F)</span>
                        </li>
                        <li :class="{active : activeSortClass == 'date-f-l'}"  v-on:click="activateSort('date-f-l')">
                            Date <span>(F &mdash; L)</span>
                        </li>
                        <li :class="{active : activeSortClass == 'title-a-z'}"  v-on:click="activateSort('title-a-z')">
                            Title <span>(A &mdash; Z)</span>
                        </li>
                        <li :class="{active : activeSortClass == 'title-z-a'}" v-on:click="activateSort('title-z-a')">
                            Title <span>(Z &mdash; A)</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
<!-- 
        <div v-if="selectedTags.length > 0" class="filtered-heading">

            <h2>Filtered by {{ selectedTags.join(',') }}</h2>
            <button
                type="button"
                @click="resetTags"
                class="btn clear-filter-btn"
            >
                Clear filter
            </button>
        </div> -->


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
import SearchBox from '@SearchBox'

export default {
    components: { 
        PostPreview,
        SearchBox 
    },
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
            selectedTags: [],
            dropdownactive:false,
            activeSortClass: 'date-l-f',
            tags: []
        }
    },
    computed: {
        filteredList() {
            if (this.pages) {
                
                //Do sorting here
                switch(this.activeSortClass) {
                    case "date-l-f":
                        return this.pages.filter(item => {
                            return this.inFilteredList(item);
                        }).sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))

                    case "date-f-l":
                        return this.pages.filter(item => {
                            return this.inFilteredList(item);
                        }).sort((a, b) => new Date(a.frontmatter.date) - new Date(b.frontmatter.date))

                    case "title-a-z":
                        return this.pages.filter(item => {
                            return this.inFilteredList(item);
                        }).sort(function(b, a) {
                            if(a.title > b.title) return -1
                            if(b.title > a.title) return 1;
                            return 0
                        })

                    case "title-z-a":
                        return this.pages.filter(item => {
                            return this.inFilteredList(item);
                        }).sort(function(a, b) {
                            if(a.title > b.title) return -1
                            if(b.title > a.title) return 1;
                            return 0
                        })
                }
            }
        },

        totalPages() {
            
            return Math.ceil(this.filteredList.length / this.pageSize)
        },
    },

    mounted() {
        this.currentPage =  Math.min(Math.max(this.currentPage, 0), this.totalPages - 1)

        for(var i = 0; i < this.pages.length; i++) {
            var page = this.pages[i];
            const isBlogPost = !!page.frontmatter.blog

            if(isBlogPost){
                for(var j = 0; j < page.frontmatter.tags.length; j++) {
                    var tag = page.frontmatter.tags[j];
                    const tagExists = this.tags.some(item => {
                        return item === tag
                    })

                    if (!tagExists){
                        this.tags = this.tags.concat(tag)
                    }
                }
            }
        }
    },

    methods: {
        inFilteredList(item) {
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
        },
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
            // for(var i = 0; i < this.selectedTags)
            for(var i = 0; i < this.selectedTags.length; i++) {
                if(this.selectedTags[i] == tag) {
                    this.selectedTags.splice(i,1);
                }
            }
        },
        tagIsActive(tag){
            const tagExists = this.selectedTags.some(item => {
                return item === tag
            });

            return tagExists;
        },
        resetTags(){
            this.selectedTags = []
        },
        toggleDropdown() {
            this.dropdownactive = !this.dropdownactive;
        },
        activateSort(sortMethod) {
            this.activeSortClass = sortMethod
            this.dropdownactive = !this.dropdownactive;
        },
        toggleTag(tag) {
            const tagExists = this.selectedTags.some(item => {
                return item === tag
            })

            if(!tagExists) {
                this.addTag(tag)
            } else {
                this.removeTag(tag)
            }
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
                color rgba(255,255,255,.75);
                font-size: 16px
                text-decoration: underline transparent;
                text-underline-offset: 4px;
                cursor:pointer;
                transition:250ms

                &:hover,&.active
                    color #fff
                    font-weight bold
                    text-decoration-color: rgb(12,255,255)
                    transition:250ms
                    

        .tag-list span:first-of-type
            margin-left 0px
            padding-left 0px

        .tag-list span:last-of-type
            padding-right:0px;
            margin-right:0px;

        .search-container
            width:240px;
            height:32px;
            border-radius:16px;
            display flex
            justify-content: flex-start
            align-items: center
            padding-left:0;
            padding-right:0px;

            .icon
                width:16px;
                height:16px;

            .search-box
                display: block;
                margin-right: 0;
                width:240px;

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
        position: relative

        .initiator
            color #fff
            font-size: 16px
            cursor:pointer
            transition:250ms

            &:hover
                font-size:17px;
                transition:250ms

        .target
            width:200px;
            position: absolute
            background:black;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
            border-radius:8px;
            right:0
            top: calc(100% + 12px)
            overflow: hidden

            ul
                line-height:unset
                padding:0;
                margin 0
                list-style-type:none;

                li
                    color:rgba(255,255,255,1);
                    line-height 40px
                    font-size: 16px
                    padding-left 16px;
                    font-weight:400
                    cursor:pointer
                    transition:250ms;

                    span
                        display:inline-block
                        color: rgba(255,255,255,.75)
                        margin-left 8px
                        font-size 14px

                    &:hover, &.active
                        color:#0CFFFF;
                        background: rgba(12,255,255,.35);
                        transition:250ms;

                        span
                            color: rgba(12,255,255,.75);

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
                
                .search-box
                    width:100%;

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

    .header 
        margin-top:0px;

        h1 
            font-size: 2.441rem !important;
  
</style>
