<template>
    <v-list nav dense v-if="isBadgesLoaded">
        <div v-for="(item, index) in availableMenu" :key="index">
            <div v-if="item.key || item.text" class="pa-1 mt-2 overline">{{ item.text }}</div>
            <nav-menu :menu="item.items"/>
        </div>
    </v-list>
</template>

<script>
import NavMenu from './NavMenu';

export default {
    components: {
        NavMenu,
    },
    data: () => ({
        badges: {
            '/product-reviews': 0,
            '/product-questions': 0
        },
        isBadgesLoaded: false
    }),
    props: {
        menu: {
            type: Array,
            default: () => [],
        },
    },
    async mounted() {
        await this.checkNewProductReviews()
        await this.checkNewProductQuestions()

        this.isBadgesLoaded = true
    },
    computed: {
        availableMenu() {
            return this.menuWithBadges.map((menu) => {
                const items = menu.items.filter((item) => !item.permission || this.$can(item.permission))
                if (!items.length) {
                    return false
                }
                return {
                    ...menu,
                    items
                }
            }).filter(Boolean)
        },
        menuWithBadges() {
            return this.menu.map((section) => ({
                    ...section,
                    items: section.items.map((item) => ({
                        ...item,
                        badge: this.badges?.[item.link] ?? null
                    }))
                })
            )
        }
    },
    methods: {
        async checkNewProductReviews() {
            const response = await this.$axios.get('/product-reviews', {
                params: {
                    "filter[status]": 1,
                    "fields[product_reviews]": "id",
                    "page[size]": 1
                }
            });

            this.badges['/product-reviews'] = response.data.meta.total;
        },
        async checkNewProductQuestions() {
            const response = await this.$axios.get('/product-questions', {
                params: {
                    "filter[status]": 1,
                    "fields[product_questions]": "id",
                    "page[size]": 1
                }
            });

            this.badges['/product-questions'] = response.data.meta.total;
        }
    }
};
</script>
